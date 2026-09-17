import assert from 'node:assert/strict';
import { readFile, readdir, writeFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { canonicalRoutes, legacyGuideAliases } from '../src/lib/content.js';
import { resourceHref } from '../src/lib/site.js';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const base = '/explore/ev-guides';
const delivery = JSON.parse(await readFile(new URL('delivery-config.json', dist), 'utf8'));
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4331';
const results = [];
async function check(url, status, destination) {
  const response = await fetch(url, { redirect: 'manual' });
  assert.equal(response.status, status, url);
  if (destination) assert.equal(new URL(response.headers.get('location'), url).pathname, destination, url);
  results.push({ url, status, location: response.headers.get('location') });
  return response;
}
for (const route of canonicalRoutes) {
  await check(origin + route, 200);
  await check(origin + route + '/', 301, route);
  await check(origin + route + '/index.html', 301, route);
  // Static portability proof: the emitted asset references resolve to packaged files
  // using the local index.html base; this is not a file:// browser E2E test.
  const localPage = new URL(route.slice(1) + '/index.html', dist);
  const html = await readFile(localPage, 'utf8');
  for (const match of html.matchAll(/(?:src|srcset|href)="((?:\.\.\/)*(?:assets|scripts)\/[^"?#]+)"/g)) await access(new URL(match[1], localPage));
  assert.equal(resourceHref('/assets/styles.css', route), route === base ? 'assets/styles.css' : '../assets/styles.css');
  for (const match of html.matchAll(/<a\b[^>]*href="(\/explore\/ev-guides[^"?#]*)(?:[?#][^"]*)?"/g)) await access(new URL(match[1].slice(1) + '/index.html', dist));
}
for (const [alias, slug] of Object.entries(legacyGuideAliases)) await check(origin + base + '/' + alias, 301, base + '/' + slug);
for (const missing of ['/missing-au-mg-route', base + '/missing-article', '/about/faqs', '/vehicles/mgs6-ev', '/sitemap.xml', '/robots.txt', '/assets/styles.css']) await check(origin + missing, 404);
await check(origin + '/', 200);
const xml = await (await check(origin + '/sitemap_evguide.xml', 200)).text();
assert.equal((xml.match(/<url>/g) || []).length, 15);
const css = await readFile(new URL('explore/ev-guides/assets/styles.css', dist), 'utf8');
const golden = await readFile(new URL('public/assets/styles.css', root), 'utf8');
const originalFonts = [...golden.matchAll(/url\('\/assets\/([^']+)'\)/g)];
const embeddedFonts = [...css.matchAll(/url\('data:font\/[^;]+;base64,([^']+)'\)/g)];
assert.equal(embeddedFonts.length, originalFonts.length);
let restored = css;
for (let i = 0; i < embeddedFonts.length; i++) {
  const bytes = await readFile(new URL('public/assets/' + originalFonts[i][1], root));
  assert.deepEqual(Buffer.from(embeddedFonts[i][1], 'base64'), bytes);
  restored = restored.replace(embeddedFonts[i][0], originalFonts[i][0]);
}
assert.equal(restored, golden, 'Derived CSS must differ only in font URL encoding');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
for (const name of await readdir(new URL('public/assets/', root))) {
  if (name === 'styles.css') continue;
  if (delivery.mode === 'content' && name === 'official-shell.css') continue;
  assert.equal(sha(await readFile(new URL('public/assets/' + name, root))), sha(await readFile(new URL('explore/ev-guides/assets/' + name, dist))));
  await check(origin + base + '/assets/' + name, 200);
}
for (const name of await readdir(new URL('public/scripts/', root))) {
  if (delivery.mode === 'content' && name === 'official-shell.js') continue;
  await check(origin + base + '/scripts/' + name, 200);
}
if (delivery.mode === 'navigation') {
  await check(origin + base + '/scripts/official-shell-core.js', 200);
  for (const name of await readdir(new URL('explore/ev-guides/assets/official-shell/', dist))) await check(origin + base + '/assets/official-shell/' + name, 200);
}
for (const route of ['/', '/robots.txt', '/sitemap.xml', '/about/faqs', '/vehicles/mgs6-ev']) {
  const response = await check('http://127.0.0.1:4333' + route, 200);
  assert.match(await response.text(), /^Existing MG /);
}
const nojs = await check('http://127.0.0.1:4332' + base, 200);
assert.equal(nojs.headers.get('content-security-policy'), "script-src 'none'");
const report = { passed: true, checks: results.length, originalFontsEmbeddedExactly: originalFonts.length, originalCssDeclarationsExact: true, localFilePathsResolved: canonicalRoutes.length, nginxResults: results };
await mkdir(new URL('qa/delivery/', root), { recursive: true });
await writeFile(new URL('qa/delivery/technical.json', root), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, nginxResults: undefined }, null, 2));
