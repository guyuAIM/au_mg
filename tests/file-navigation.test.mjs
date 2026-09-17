import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { canonicalRoutes } from '../src/lib/content.js';
import { contentFile } from '../src/lib/site.js';

test('actual file adapter resolves all 225 guide links inside a flat Chinese/space package', async () => {
  const source = await readFile(new URL('../public/scripts/file-navigation.js', import.meta.url), 'utf8');
  const packageRoot = new URL('file:///D:/客户 交付/任意容器目录/');
  for (const page of canonicalRoutes) {
    const links = canonicalRoutes.map(destination => ({
      value: destination + '#guide-content',
      getAttribute() { return this.value; },
      closest() { return true; }
    }));
    const location = new URL(contentFile(page) + '?category=Charging&q=home', packageRoot);
    vm.runInNewContext(source, { URL, location, document: { body: { dataset: { pagePath: page } }, querySelectorAll: () => links } });
    for (let i = 0; i < links.length; i++) {
      const target = new URL(links[i].href);
      const expected = new URL(contentFile(canonicalRoutes[i]), packageRoot);
      assert.equal(target.pathname, expected.pathname);
      assert.equal(target.hash, '#guide-content');
      assert.equal(target.searchParams.get('category'), 'Charging');
      assert.equal(target.searchParams.get('q'), 'home');
    }
  }
});

test('HTTP adapter leaves canonical links alone', async () => {
  const source = await readFile(new URL('../public/scripts/file-navigation.js', import.meta.url), 'utf8');
  vm.runInNewContext(source, { URL, location: new URL('https://mgmotor.com.au/explore/ev-guides'), document: { querySelectorAll() { throw new Error('HTTP links must not be rewritten'); } } });
});
