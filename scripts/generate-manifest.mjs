import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excludedDirectories = new Set(['node_modules', '.git', '.astro', '.generated', 'release']);
const excludedFiles = new Set(['FILE_MANIFEST_SHA256.txt']);
const files = [];
const walk = async (directory, prefix = '') => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) await walk(path.join(directory, entry.name), relative);
    else if (!excludedFiles.has(relative)) files.push(relative);
  }
};
await walk(root);
files.sort();
const lines = [];
for (const relative of files) {
  const buffer = await readFile(path.join(root, ...relative.split('/')));
  lines.push(`${createHash('sha256').update(buffer).digest('hex')}  ${relative}`);
}
await writeFile(path.join(root, 'FILE_MANIFEST_SHA256.txt'), `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote SHA-256 manifest for ${files.length} files.`);
