import assert from 'node:assert/strict';
import { access, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { canonicalRoutes } from '../src/lib/content.js';
import { canonical, contentFile } from '../src/lib/site.js';
import { normalizePagesBase, transformPagesHtml } from '../src/lib/pages-preview.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'dist');
const target = path.join(root, '.pages');
assert.equal(path.dirname(target), root, 'Pages output must remain directly under the project root');
const args = process.argv.slice(2);
const index = args.indexOf('--base');
const base = normalizePagesBase(index >= 0 ? args[index + 1] : process.env.PAGES_BASE_PATH || '/au_mg');

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await visit(absolute);
    else if (entry.name.endsWith('.html')) {
      const relative = path.relative(target, absolute).replaceAll('\\', '/');
      await writeFile(absolute, transformPagesHtml(await readFile(absolute, 'utf8'), relative, base));
    }
  }
}
await visit(target);
await writeFile(path.join(target, '.nojekyll'), '');

const entry = await readFile(path.join(target, 'index.html'), 'utf8');
assert.match(entry, new RegExp(`<base href="${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/">`));
assert.match(entry, /<meta name="robots" content="noindex, follow">/);
assert.doesNotMatch(entry, /href="\/explore\/ev-guides(?:\/|#|\?|\")/);
assert.match(entry, /rel="canonical" href="https:\/\/mgmotor\.com\.au\/explore\/ev-guides"/);
for (const route of canonicalRoutes) {
  const relative = contentFile(route);
  const html = await readFile(path.join(target, relative), 'utf8');
  const document = parseHTML(html).document;
  assert.equal(document.querySelectorAll('h1').length, 1, `${relative}: one h1 required`);
  assert.equal(document.querySelector('meta[name="robots"]')?.getAttribute('content'), 'noindex, follow', `${relative}: preview robots`);
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), canonical(route), `${relative}: production canonical`);
  assert.equal(document.documentElement.dataset.pagesBase, base, `${relative}: Pages base marker`);
  for (const element of document.querySelectorAll('[href],[src]')) {
    const value = element.getAttribute('href') || element.getAttribute('src');
    if (!value || /^(?:https?:|data:|#)/.test(value)) continue;
    if (value.startsWith(base + '/')) {
      const pathname = new URL(value, 'https://pages.invalid').pathname.slice(base.length).replace(/^\/|\/$/g, '');
      await access(path.join(target, pathname ? pathname + '/index.html' : 'index.html'));
    } else {
      await access(path.resolve(path.dirname(path.join(target, relative)), value.split(/[?#]/, 1)[0]));
    }
  }
}
console.log(`Prepared and verified ${canonicalRoutes.length} GitHub Pages preview pages at ${target} with base ${base}; production canonical metadata unchanged.`);
