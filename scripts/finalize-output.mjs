// Astro source routes retain their public URL structure for development.
// Only generated build files are relocated into the self-contained delivery root.
import assert from 'node:assert/strict';
import { readFile, readdir, rename, unlink, rmdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { editorialGuides } from '../src/lib/content.js';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const nested = path.resolve(dist, 'explore/ev-guides');
assert.ok(nested.startsWith(path.resolve(dist) + path.sep));
const entry = await readFile(path.join(dist, 'index.html'), 'utf8');
const nestedEntry = await readFile(path.join(nested, 'index.html'), 'utf8');
assert.equal(entry, nestedEntry, 'Root entry must render exactly the same guide hub');
const names = ['assets', 'scripts', ...editorialGuides.map(guide => guide.slug)];
assert.deepEqual((await readdir(nested)).sort(), [...names, 'index.html'].sort(), 'Unexpected generated guide output');
for (const name of names) await rename(path.join(nested, name), path.join(dist, name));
await unlink(path.join(nested, 'index.html')); // Duplicate generated hub only.
await rmdir(nested); // Fail if anything unexpected remains; never recursively delete.
await rmdir(path.dirname(nested));
console.log('Prepared self-contained dist: full root index, 14 article folders, assets, scripts and child sitemap.');
