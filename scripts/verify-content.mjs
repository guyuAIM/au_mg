import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalRoutes, editorialGuides, faqData, guideSources, legacyGuideAliases, validateContent } from '../src/lib/content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const expectedHashes = {
  'src/data/faq-data.json': 'b93557a4776bc55812452078e450531e5bb8a78e27a4aba92d4cb68a05250a23',
  'src/data/p0-guides.js': '4904c62a2b89831294d5f3950973d09563caf51d796b2f126244fd7e5e1d7135',
  'src/data/editorial-guides.js': 'fadd916e4201ad86adb7c419a1f4f706c4bc765d75f0acf211450ee1e142a45e',
  'src/data/education-guides.js': '41a5a1f41f2286c1cd4b8f8baa5666f403fe011b530923a25215225d3c07ef2c',
  'public/assets/styles.css': 'b3fee603caf2b5fd0d8bcf0cc4e7576d2834d964c822564b46f0a8e93c120a2f'
};

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
for (const [relativePath, expected] of Object.entries(expectedHashes)) {
  const actual = sha256(await readFile(path.join(root, relativePath)));
  if (actual !== expected) throw new Error(`Golden file changed: ${relativePath}\nexpected ${expected}\nactual   ${actual}`);
}

const summary = validateContent();
if (canonicalRoutes.length !== 16) throw new Error(`Expected 16 canonical routes, found ${canonicalRoutes.length}`);
if (Object.keys(guideSources).length !== 28) throw new Error(`Expected 28 guide sources, found ${Object.keys(guideSources).length}`);

const payload = {
  ...summary,
  faqIds: faqData.faqs.map((faq) => faq.id),
  guideSlugs: editorialGuides.map((guide) => guide.slug),
  legacyAliases: legacyGuideAliases,
  goldenFiles: expectedHashes
};
console.log(JSON.stringify(payload, null, 2));
