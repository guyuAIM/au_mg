import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePagesBase, pagesRouteForFile, transformPagesHtml } from '../src/lib/pages-preview.js';

test('GitHub Pages base accepts one safe repository segment only', () => {
  assert.equal(normalizePagesBase('/au_mg/'), '/au_mg');
  for (const value of ['', '/', '/a/b', '/../x', 'https://example.com/x']) assert.throws(() => normalizePagesBase(value));
});

test('Pages routes map flat delivery files under the repository prefix', () => {
  assert.equal(pagesRouteForFile('index.html', '/au_mg'), '/au_mg/');
  assert.equal(pagesRouteForFile('how-electric-cars-work/index.html', '/au_mg'), '/au_mg/how-electric-cars-work/');
  assert.throws(() => pagesRouteForFile('assets/nested/index.html', '/au_mg'));
});

test('Pages HTML rewrites navigation only and preserves production GEO metadata', () => {
  const input = '<html lang="en-AU"><head><base href="/explore/ev-guides/example/"><link rel="canonical" href="https://mgmotor.com.au/explore/ev-guides/example"></head><body><a href="/explore/ev-guides">Hub</a><a href="/explore/ev-guides/other?q=x#y">Other</a><script type="application/ld+json">{"url":"https://mgmotor.com.au/explore/ev-guides/example"}</script></body></html>';
  const output = transformPagesHtml(input, 'example/index.html', '/au_mg');
  assert.match(output, /<html lang="en-AU" data-pages-base="\/au_mg">/);
  assert.match(output, /<base href="\/au_mg\/example\/">/);
  assert.match(output, /<meta name="robots" content="noindex, follow">/);
  assert.match(output, /href="\/au_mg\/">Hub/);
  assert.match(output, /href="\/au_mg\/other\/\?q=x#y">Other/);
  assert.match(output, /rel="canonical" href="https:\/\/mgmotor\.com\.au\/explore\/ev-guides\/example"/);
  assert.match(output, /"url":"https:\/\/mgmotor\.com\.au\/explore\/ev-guides\/example"/);
});
