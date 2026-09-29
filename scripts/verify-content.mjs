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
  'src/data/education-guides.js': 'fac0cf56daf9f296391fd754f449c8d528d5f49042f89b0430515e4d62318164',
  'public/assets/styles.css': 'bfbc421a410f8cd5d936e09a606fb9118d8d20738c4a164a146232f435983ac8'
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
