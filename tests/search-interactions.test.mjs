import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { parseHTML } from 'linkedom';

const interactions = await readFile(new URL('../public/scripts/site-interactions.js', import.meta.url), 'utf8');

function render(html, href) {
  const { document, window } = parseHTML(html);
  const location = new URL(href);
  const stored = new Map();
  vm.runInNewContext(interactions, {
    document,
    window,
    location,
    URL,
    Event: window.Event,
    sessionStorage: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, String(value)),
      removeItem: (key) => stored.delete(key)
    },
    requestAnimationFrame: (callback) => callback()
  });
  return { document, window };
}

function keydown(window, element, key) {
  const event = new window.Event('keydown', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'key', { value: key });
  element.dispatchEvent(event);
  return event;
}

test('guide search matches words in any case or order and handles Enter', () => {
  const { document, window } = render(`
    <main data-guide-root>
      <input data-guide-search />
      <button data-guide-search-clear hidden>Clear</button>
      <button class="selected" data-guide-category="All guides" aria-pressed="true">All guides</button>
      <button data-guide-category="Charging" aria-pressed="false">Charging</button>
      <p data-guide-eyebrow></p><h2 data-guide-heading></h2><span data-guide-count></span>
      <article data-guide-card data-category="Charging" data-search="AC and DC EV charging MG4 charging at home"></article>
      <article data-guide-card data-category="Ownership" data-search="EV running costs and servicing"></article>
      <div data-guide-empty hidden><button data-guide-reset>Reset</button></div>
    </main>
  `, 'https://mgmotor.com.au/explore/ev-guides');
  const input = document.querySelector('[data-guide-search]');
  const cards = [...document.querySelectorAll('[data-guide-card]')];

  input.value = 'MG4 CHARGING';
  const enter = keydown(window, input, 'Enter');
  assert.equal(enter.defaultPrevented, true);
  assert.equal(cards[0].hidden, false);
  assert.equal(cards[1].hidden, true);
  assert.equal(document.querySelector('[data-guide-count]').textContent, '1 guide');

  input.value = 'charging, mg4';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(cards[0].hidden, false);
  document.querySelector('[data-guide-search-clear]').click();
  assert.equal(input.value, '');
  assert.ok(cards.every((card) => !card.hidden));
});

test('FAQ search accepts price formats and combines with topic selection', () => {
  const { document, window } = render(`
    <main data-faq-root>
      <input data-faq-search />
      <button data-faq-search-clear hidden>Clear</button>
      <button class="selected" data-faq-category="All topics" aria-pressed="true">All topics</button>
      <button data-faq-category="Budget &amp; offers" aria-pressed="false">Budget &amp; offers</button>
      <button data-faq-category="Driving &amp; charging" aria-pressed="false">Driving &amp; charging</button>
      <span data-faq-count></span><button data-faq-expand-all>Expand all</button>
      <article data-faq-item data-faq-kind="model" data-category="Budget &amp; offers" data-search="Budget &amp; offers MG4 price quote affordable">
        <button data-faq-trigger aria-expanded="false">Budget question</button><div class="answer" hidden>Answer</div>
      </article>
      <article data-faq-item data-faq-kind="model" data-category="Driving &amp; charging" data-search="Driving &amp; charging MG4 public charger">
        <button data-faq-trigger aria-expanded="false">Charging question</button><div class="answer" hidden>Answer</div>
      </article>
      <div data-faq-empty hidden><button data-faq-reset>Reset</button></div>
      <button id="reset-faq" data-faq-reset hidden>Clear filters</button>
    </main>
  `, 'https://mgmotor.com.au/explore/ev-guides/questions');
  const input = document.querySelector('[data-faq-search]');
  const items = [...document.querySelectorAll('[data-faq-item]')];

  for (const query of ['25000', '$25,000', '25k']) {
    input.value = query;
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    assert.equal(items[0].hidden, false, `${query} should show Budget & offers`);
    assert.equal(items[1].hidden, true, `${query} should hide unrelated topics`);
    assert.equal(document.querySelector('[data-faq-count]').textContent, '1 question');
  }

  input.value = 'quote';
  document.querySelector('[data-faq-category="Budget & offers"]').click();
  assert.equal(items[0].hidden, false);
  assert.equal(items[1].hidden, true);

  document.querySelector('[data-faq-search-clear]').click();
  assert.equal(input.value, '');
  assert.equal(items[0].hidden, false);
  assert.equal(items[1].hidden, true);

  document.querySelector('#reset-faq').click();
  assert.ok(items.every((item) => !item.hidden));
  assert.equal(document.querySelector('[data-faq-count]').textContent, '2 questions');

  items[0].querySelector('[data-faq-trigger]').click();
  assert.equal(items[0].classList.contains('is-open'), true);
  assert.equal(items[0].querySelector('.answer').hidden, false);
});
