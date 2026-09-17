import { zipSync, unzipSync } from 'fflate';
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const release = path.join(root, 'release');
const files = {};
const builtConfig = JSON.parse(await readFile(path.join(root, 'dist/delivery-config.json'), 'utf8'));
async function collect(directory, prefix) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + '/' + entry.name;
    if (entry.isDirectory()) await collect(path.join(directory, entry.name), name);
    else files[name] = new Uint8Array(await readFile(path.join(directory, entry.name)));
  }
}
await collect(path.join(root, 'dist'), 'dist');
await collect(path.join(root, 'deployment'), 'deployment');
files['README.md'] = new TextEncoder().encode(`Delivery mode: ${builtConfig.mode}\n\n` + await readFile(path.join(root, 'DELIVERY.md'), 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = Object.keys(files).sort().map(name => `${hash(files[name])}  ${name}`).join('\n') + '\n';
files['SHA256SUMS.txt'] = new TextEncoder().encode(manifest);
const name = 'au_mg_evguide_' + builtConfig.mode + '_' + new Date().toISOString().replace(/[:.]/g, '-');
await mkdir(release, { recursive: true });
const archive = path.join(release, name + '.zip');
await writeFile(archive, zipSync(files, { level: 6 }));
const extracted = unzipSync(await readFile(archive));
const verificationDirectory = path.join(release, '验收 空格 ' + name);
for (const [name, bytes] of Object.entries(extracted)) {
  if (!files[name] || hash(bytes) !== hash(files[name])) throw new Error('ZIP mismatch: ' + name);
  const target = path.resolve(verificationDirectory, name);
  if (!target.startsWith(verificationDirectory + path.sep)) throw new Error('Invalid ZIP path: ' + name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
}
if (Object.keys(extracted).length !== Object.keys(files).length) throw new Error('ZIP inventory mismatch');
const report = { mode: builtConfig.mode, archive, verificationDirectory, filesVerified: Object.keys(files).length, archiveSha256: hash(await readFile(archive)), entry: path.join(verificationDirectory, 'dist/index.html') };
await writeFile(path.join(release, 'latest.json'), JSON.stringify(report, null, 2) + '\n');
await writeFile(path.join(release, `latest-${builtConfig.mode}.json`), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
