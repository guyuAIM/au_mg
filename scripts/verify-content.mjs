import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalRoutes, editorialGuides, faqData, guideSources, legacyGuideAliases, validateContent } from '../src/lib/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedHashes = {
  'src/data/faq-data.json': 'c1644517ff2f1c4edc947a29c8d1fc3270f8bde2b59f8357d82450a4e68da799',
  'src/data/p0-guides.js': 'e71c308ac13eac31c62dba8ad0cbdd8cd24c86fd284f95eeb4957f3cfc3ae0e5',
  'src/data/editorial-guides.js': 'dca61ea8b421a8f1cc2f7e68f75ce50e75dbec04890925c998922b2a0714588d',
  'src/data/education-guides.js': '1805915ee59eb5f9bc9385219c9d02b06e9166b8dabd7de3a2f8ea0c22fa53f9',
  'public/assets/styles.css': '7c08f1be48edd167e95aaec51cf6affeef6f635c412da7cc78c27b8388825b72'
};

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
for (const [relativePath, expected] of Object.entries(expectedHashes)) {
  const actual = sha256(await readFile(path.join(root, relativePath)));
  if (actual !== expected) throw new Error(`Golden file changed: ${relativePath}\nexpected ${expected}\nactual   ${actual}`);
}

const summary = validateContent();
if (canonicalRoutes.length !== 16) throw new Error(`Expected 16 canonical routes, found ${canonicalRoutes.length}`);
if (Object.keys(guideSources).length !== 25) throw new Error(`Expected 25 guide sources, found ${Object.keys(guideSources).length}`);

const payload = {
  ...summary,
  faqIds: faqData.faqs.map((faq) => faq.id),
  guideSlugs: editorialGuides.map((guide) => guide.slug),
  legacyAliases: legacyGuideAliases,
  goldenFiles: expectedHashes
};
console.log(JSON.stringify(payload, null, 2));
