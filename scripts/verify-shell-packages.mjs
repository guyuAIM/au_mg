import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';
import { canonicalRoutes } from '../src/lib/content.js';
import { contentFile } from '../src/lib/site.js';

const root = new URL('../', import.meta.url);
const baseline = unzipSync(await readFile(new URL('release/au_mg_evguide_2026-09-17T05-45-42-115Z.zip', root)));
const decoder = new TextDecoder();
const main = html => html.match(/<main>([\s\S]*?)<\/main>/)?.[1];
const results = [];
for (const mode of ['content', 'navigation']) {
  const meta = JSON.parse(await readFile(new URL(`release/latest-${mode}.json`, root), 'utf8'));
  const files = unzipSync(await readFile(meta.archive));
  for (const route of canonicalRoutes) {
    const name = `dist${route}/index.html`;
    const html = decoder.decode(files['dist/' + contentFile(route)]);
    assert.ok(main(html));
    assert.equal(main(html), main(decoder.decode(baseline[name])), `${mode}: main changed at ${route}`);
    assert.equal((html.match(/<mg-site-shell\b/g) || []).length, mode === 'navigation' ? 2 : 0);
    assert.equal(html.includes('id="mg-navigation-config"'), mode === 'navigation');
    if (mode === 'content') assert.doesNotMatch(html, /official-shell|shadowrootmode|mg-navigation-config/);
  }
  const xml = decoder.decode(files['dist/sitemap_evguide.xml']);
  assert.equal(xml, decoder.decode(baseline['dist/sitemap_evguide.xml']));
  assert.deepEqual(files['dist/assets/styles.css'], baseline['dist/explore/ev-guides/assets/styles.css']);
  assert.equal(!!files['dist/scripts/official-shell.js'], mode === 'navigation');
  assert.match(decoder.decode(files['dist/index.html']), /<main>/);
  assert.doesNotMatch(decoder.decode(files['dist/index.html']), /location\.replace|http-equiv="refresh"|content="noindex/);
  results.push({ mode, pages: 15, mainHtmlByteExact: true, sitemapByteExact: true, originalDerivedCssByteExact: true, archive: meta.archive });
}
await writeFile(new URL('qa/delivery/shell-packages.json', root), JSON.stringify({ passed: true, results }, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
