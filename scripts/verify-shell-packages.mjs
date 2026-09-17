import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';
import { canonicalRoutes } from '../src/lib/content.js';
import { contentFile } from '../src/lib/site.js';

const root = new URL('../', import.meta.url);
const decoder = new TextDecoder();
const main = html => html.match(/<main>([\s\S]*?)<\/main>/)?.[1];
const results = [];
const contentMeta = JSON.parse(await readFile(new URL('release/latest-content.json', root), 'utf8'));
const baseline = unzipSync(await readFile(contentMeta.archive));
for (const mode of ['content', 'navigation']) {
  const meta = JSON.parse(await readFile(new URL(`release/latest-${mode}.json`, root), 'utf8'));
  const files = unzipSync(await readFile(meta.archive));
  for (const route of canonicalRoutes) {
    const name = 'dist/' + contentFile(route);
    const html = decoder.decode(files[name]);
    assert.ok(main(html));
    assert.equal(main(html), main(decoder.decode(baseline[name])), `${mode}: main changed at ${route}`);
    assert.equal((html.match(/<mg-site-shell\b/g) || []).length, mode === 'navigation' ? 2 : 0);
    assert.equal(html.includes('id="mg-navigation-config"'), mode === 'navigation');
    if (mode === 'content') assert.doesNotMatch(html, /official-shell|shadowrootmode|mg-navigation-config/);
  }
  const xml = decoder.decode(files['dist/sitemap_evguide.xml']);
  assert.equal(xml, decoder.decode(baseline['dist/sitemap_evguide.xml']));
  assert.deepEqual(files['dist/assets/styles.css'], baseline['dist/assets/styles.css']);
  assert.equal(!!files['dist/scripts/official-shell.js'], mode === 'navigation');
  assert.match(decoder.decode(files['dist/index.html']), /<main>/);
  assert.doesNotMatch(decoder.decode(files['dist/index.html']), /location\.replace|http-equiv="refresh"|content="noindex/);
  results.push({ mode, pages: canonicalRoutes.length, mainHtmlByteExact: true, sitemapByteExact: true, originalDerivedCssByteExact: true, archive: meta.archive });
}
await writeFile(new URL('qa/delivery/shell-packages.json', root), JSON.stringify({ passed: true, results }, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
