import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalRoutes, editorialGuides, questionsPath } from '../src/lib/content.js';
import { resourceHref, absoluteAsset, canonical, contentFile } from '../src/lib/site.js';

test('16 canonical URLs include EV questions but exclude original MG FAQ and vehicle ownership', () => {
  assert.equal(canonicalRoutes.length, 16);
  assert.equal(new Set(canonicalRoutes).size, 16);
  assert.ok(canonicalRoutes.every(route => route.startsWith('/explore/ev-guides') && !route.endsWith('/')));
  assert.ok(canonicalRoutes.includes(questionsPath));
  assert.ok(!canonicalRoutes.includes('/about/faqs'));
  assert.ok(!canonicalRoutes.includes('/vehicles/mgs6-ev'));
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
    const page = new URL(contentFile(route), root);
    const inferredRoot = new URL('../'.repeat(route.split('/').filter(Boolean).length - 2), new URL('.', page));
    assert.equal(inferredRoot.href, root.href);
    assert.equal(new URL(resourceHref('/assets/styles.css', route), page).href, new URL('assets/styles.css', root).href);
    for (const destination of canonicalRoutes) assert.equal(new URL(contentFile(destination), inferredRoot).href, new URL(contentFile(destination), root).href);
  }
});

test('package root is the real hub, article folders do not repeat the public prefix', () => {
  assert.equal(contentFile('/explore/ev-guides'), 'index.html');
  assert.equal(contentFile(questionsPath), 'questions/index.html');
  assert.equal(contentFile('/explore/ev-guides/how-electric-cars-work'), 'how-electric-cars-work/index.html');
  for (const route of ['/other', '/explore/ev-guides/../outside', '/explore/ev-guides/assets/styles.css']) assert.throws(() => contentFile(route));
});

test('guide dates remain data-owned and valid ISO dates', () => {
  for (const guide of editorialGuides) assert.match(guide.modifiedIso, /^\d{4}-\d{2}-\d{2}$/);
});
