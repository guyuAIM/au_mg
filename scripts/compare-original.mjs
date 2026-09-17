import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const original = path.resolve(process.env.ORIGINAL_PROJECT || path.join(root, '..', 'MG_Australia_EV_Guides_Source_20260916'));
const pairs = [
  ['src/faq-data.json', 'src/data/faq-data.json'],
  ['src/p0-guides.js', 'src/data/p0-guides.js'],
  ['src/editorial-guides.js', 'src/data/editorial-guides.js'],
  ['src/education-guides.js', 'src/data/education-guides.js'],
  ['src/styles.css', 'public/assets/styles.css']
];
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

const mismatches = [];
for (const [source, target] of pairs) {
  const [a, b] = await Promise.all([readFile(path.join(original, source)), readFile(path.join(root, target))]);
  if (sha256(a) !== sha256(b)) mismatches.push({ source, target });
}

const listFiles = async (directory, prefix = '') => {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) results.push(...await listFiles(path.join(directory, entry.name), relative));
    else results.push(relative);
  }
  return results.sort();
};

const originalAssets = await listFiles(path.join(original, 'public', 'assets'));
const newAssets = (await listFiles(path.join(root, 'public', 'assets'))).filter((name) => !['styles.css', 'geo-static.css'].includes(name));
const originalContentAssets = originalAssets.filter((name) => name !== 'styles.css');
if (JSON.stringify(originalContentAssets) !== JSON.stringify(newAssets)) mismatches.push({ source: 'public/assets inventory', target: 'public/assets inventory' });
for (const asset of originalContentAssets) {
  const [a, b] = await Promise.all([readFile(path.join(original, 'public', 'assets', asset)), readFile(path.join(root, 'public', 'assets', asset))]);
  if (sha256(a) !== sha256(b)) mismatches.push({ source: `public/assets/${asset}`, target: `public/assets/${asset}` });
}

if (mismatches.length) throw new Error(`Original comparison failed:\n${JSON.stringify(mismatches, null, 2)}`);
console.log(JSON.stringify({ original, comparedGoldenFiles: pairs.length, comparedAssets: originalContentAssets.length, mismatches: 0 }, null, 2));
