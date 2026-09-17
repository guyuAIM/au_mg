import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalRoutes, editorialGuides } from '../src/lib/content.js';
import { resourceHref, absoluteAsset, canonical } from '../src/lib/site.js';

test('15 canonical URLs exclude original MG FAQ and vehicle ownership', () => {
  assert.equal(canonicalRoutes.length, 15);
  assert.equal(new Set(canonicalRoutes).size, 15);
  assert.ok(canonicalRoutes.every(route => route.startsWith('/explore/ev-guides') && !route.endsWith('/')));
});

test('asset and metadata paths use guide namespace without changing canonical URLs', () => {
  assert.equal(resourceHref('/assets/styles.css', '/explore/ev-guides'), 'assets/styles.css');
  assert.equal(resourceHref('/assets/styles.css', '/explore/ev-guides/test/'), '../assets/styles.css');
  assert.equal(absoluteAsset('/assets/mg-logo.jpg'), 'https://mgmotor.com.au/explore/ev-guides/assets/mg-logo.jpg');
  assert.equal(canonical('/explore/ev-guides'), 'https://mgmotor.com.au/explore/ev-guides');
});

test('local URL arithmetic retains a package root with spaces and Chinese characters', () => {
  const root = new URL('file:///D:/交付 文件/dist/');
  for (const route of canonicalRoutes) {
    const page = new URL(route.slice(1) + '/index.html', root);
    const inferredRoot = new URL('../'.repeat(route.split('/').filter(Boolean).length), new URL('.', page));
    assert.equal(inferredRoot.href, root.href);
    assert.equal(new URL(resourceHref('/assets/styles.css', route), page).href, new URL('explore/ev-guides/assets/styles.css', root).href);
    for (const destination of canonicalRoutes) assert.equal(new URL(destination.slice(1) + '/index.html', inferredRoot).href, new URL(destination.slice(1) + '/index.html', root).href);
  }
});

test('guide dates remain data-owned and valid ISO dates', () => {
  for (const guide of editorialGuides) assert.match(guide.modifiedIso, /^\d{4}-\d{2}-\d{2}$/);
});
