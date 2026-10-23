"""Import the approved October FAQ document without rewriting its answers.

Usage: python scripts/import-faq-docx.py input.docx [output.json]
Uses only Python's standard library. Headings identify questions, not web topics.
"""
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
W = "{" + NS["w"] + "}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
PREFIX = "AU20261023-"
TOPICS = {
    "Budget & offers": [2, 3],
    "Choosing an EV": [1, 4, 5, 7],
    "Compare models": [6, 8, 12, 24],
    "Space & family": [9, 10, 11],
    "Driving & charging": [13, 14, 15, 16, 17, 20],
    "Ownership & warranty": [18, 19, 21, 22, 23],
}
MODELS = {
    1: ["urban", "mg4", "s5", "s6"], 2: ["urban", "mg4"],
    3: ["s5", "s6"], 4: ["urban"], 5: ["urban"],
    6: ["urban", "mg4"], 7: [], 8: ["s5", "s6"],
    9: ["s6"], 10: ["s6"], 11: ["s6"], 12: ["s6"],
    13: ["s6"], 14: ["urban", "s6"], 15: ["urban", "s6"],
    16: [], 17: ["s6"], 18: [], 19: ["s6"], 20: [],
    21: ["urban", "s6"], 22: [], 23: [], 24: ["urban", "s6"],
}


def text(element):
    return "".join(
        node.text or "" if node.tag == W + "t" else "\n"
        for node in element.iter() if node.tag in {W + "t", W + "br"}
    )


def import_document(document):
    with zipfile.ZipFile(document) as archive:
        body = ET.fromstring(archive.read("word/document.xml")).find("w:body", NS)
        relationships = ET.fromstring(archive.read("word/_rels/document.xml.rels"))
    links = {item.get("Id"): item.get("Target") for item in relationships}
    faqs, sources, source_keys = [], {}, {}
    current = None
    for element in body:
        if element.tag == W + "p":
            value = text(element).strip()
            style_node = element.find("w:pPr/w:pStyle", NS)
            style = style_node.get(W + "val") if style_node is not None else ""
            if style == "Heading1":
                number = int(value.split()[0])
                current = {
                    "id": f"{PREFIX}{number:02d}",
                    "documentNumber": number,
                    "category": next(topic for topic, numbers in TOPICS.items() if number in numbers),
                    "audience": "model",
                    "models": MODELS[number],
                    "referencePrefix": PREFIX,
                    "question": "",
                    "blocks": [],
                    "sources": [],
                    "keywords": "",
                    "expiry": False,
                    "owner": "/explore/ev-guides/questions",
                }
                faqs.append(current)
            elif current is not None and style == "Heading2":
                current["question"] = value
            elif current is not None and value.startswith("Sources:"):
                hyperlinks = element.findall(".//w:hyperlink", NS)
                if not hyperlinks:
                    raise ValueError(f"Sources missing hyperlinks: {current['id']}")
                for link in hyperlinks:
                    title, url = text(link), links[link.get(R + "id")]
                    if not url.startswith("https://"):
                        raise ValueError(f"Unexpected source URL: {url}")
                    key = (title, url)
                    if key not in source_keys:
                        source_id = f"oct2026-source-{len(sources) + 1:02d}"
                        source_keys[key] = source_id
                        sources[source_id] = {"title": title, "url": url}
                    source_id = source_keys[key]
                    if url not in [sources[item]["url"] for item in current["sources"]]:
                        current["sources"].append(source_id)
            elif current is not None and value:
                # Caption-style conditions are part of the answer, not an added note.
                current["blocks"].append({"type": "paragraph", "text": value})
        elif current is not None and element.tag == W + "tbl":
            rows = [
                ["\n".join(text(p) for p in cell.findall("w:p", NS)) for cell in row.findall("w:tc", NS)]
                for row in element.findall("w:tr", NS)
            ]
            current["blocks"].append({"type": "table", "headers": rows[0], "rows": rows[1:]})
    if [faq["documentNumber"] for faq in faqs] != list(range(1, 25)):
        raise ValueError("Expected document questions 01–24 in order")
    if sum(block["type"] == "table" for faq in faqs for block in faq["blocks"]) != 10:
        raise ValueError("Expected ten document tables")
    for faq in faqs:
        if not faq["question"] or not faq["sources"] or not faq["blocks"]:
            raise ValueError(f"Incomplete FAQ: {faq['id']}")
        faq["cta"] = faq["sources"][0]
        references = re.findall(r"\bFAQ (\d+)\b", " ".join(block.get("text", "") for block in faq["blocks"]))
        faq["related"] = list(dict.fromkeys(f"{PREFIX}{int(number):02d}" for number in references))
    return {
        "sourceDocument": document.name,
        "sourceSha256": hashlib.sha256(document.read_bytes()).hexdigest(),
        "reviewed": "2026-10-22",
        "modified": "2026-10-23",
        "sources": sources,
        "faqs": faqs,
    }


if __name__ == "__main__":
    document = Path(sys.argv[1])
    output = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).resolve().parents[1] / "src/data/faq-october-2026.json"
    data = import_document(document)
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"Imported {len(data['faqs'])} FAQs, 10 tables and {len(data['sources'])} source labels into {output}")
