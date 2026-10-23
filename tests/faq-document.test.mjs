import test from 'node:test';
import assert from 'node:assert/strict';
import october from '../src/data/faq-october-2026.json' with { type: 'json' };
import approved from '../src/data/faq-data.json' with { type: 'json' };
import { evFaqBasics } from '../src/data/ev-faq-basics.js';
import { faqData, validateContent } from '../src/lib/content.js';
import { faqAnswerText, faqTextSegments } from '../src/lib/faq-content.js';

test('append 24 document answers without replacing or editing the existing 33', () => {
  assert.equal(validateContent().faqCount, 57);
  assert.deepEqual(faqData.faqs.slice(0, 33), [...evFaqBasics, ...approved.faqs]);
  assert.deepEqual(faqData.faqs.slice(33), october.faqs);
  for (const [id, source] of Object.entries(approved.sources)) assert.deepEqual(faqData.sources[id], source);
  assert.deepEqual(october.faqs.map((faq) => faq.documentNumber), Array.from({ length: 24 }, (_, i) => i + 1));
  assert.equal(new Set(faqData.faqs.map((faq) => faq.id)).size, 57);
});

test('all document questions use the agreed topic assignments and no added notes', () => {
  const expected = {
    'Budget & offers': [2, 3],
    'Choosing an EV': [1, 4, 5, 7],
    'Compare models': [6, 8, 12, 24],
    'Space & family': [9, 10, 11],
    'Driving & charging': [13, 14, 15, 16, 17, 20],
    'Ownership & warranty': [18, 19, 21, 22, 23]
  };
  for (const [category, numbers] of Object.entries(expected)) {
    assert.deepEqual(october.faqs.filter((faq) => faq.category === category).map((faq) => faq.documentNumber), numbers);
  }
  for (const faq of october.faqs) {
    assert.equal(faq.note, undefined);
    assert.equal(faq.expiry, false, 'must not inherit the September expiry substitution');
    assert.notEqual(faq.audience, 'all-evs');
    assert.ok(faq.sources.length > 0);
    assert.equal(new Set(faq.sources.map((id) => faqData.sources[id].url)).size, faq.sources.length);
  }
});

test('preserve tables in place, source captions, multiline cells and October offer terms', () => {
  assert.equal(october.faqs.flatMap((faq) => faq.blocks).filter((block) => block.type === 'table').length, 10);
  const urban = october.faqs[4];
  assert.deepEqual(urban.blocks.map((block) => block.type), ['paragraph', 'paragraph', 'table', 'paragraph']);
  assert.equal(urban.blocks[2].rows[7][1], '17-inch alloy\n205/50 R17');
  assert.match(urban.blocks[3].text, /1–31 October 2026/);
  const s6 = october.faqs[11];
  assert.deepEqual(s6.blocks.map((block) => block.type), ['paragraph', 'paragraph', 'table', 'paragraph', 'paragraph']);
  assert.deepEqual(s6.sources.map((id) => faqData.sources[id].url), [
    'https://mgmotor.com.au/offers',
    'https://mgmotor.com.au/vehicles/mgs6-ev',
    'https://mgmotor.com.au/brochures/MGS6_EV_2026.pdf'
  ]);
  const prices = october.faqs[2].blocks.find((block) => block.type === 'table').rows;
  assert.deepEqual(prices.slice(0, 2).map((row) => row[1]), ['$39,990', '$44,990']);
  assert.match(faqAnswerText(october.faqs[18], faqData.faqs), /\$1,321/);
});

test('document cross references point to new questions rather than old ordinal positions', () => {
  const expected = [[1, 12], [4, 5], [8, 12], [13, 12]];
  for (const [number, target] of expected) {
    const faq = october.faqs[number - 1];
    const segments = faq.blocks.flatMap((block) => block.type === 'paragraph' ? faqTextSegments(block.text, faq, faqData.faqs) : []);
    const links = segments.filter((segment) => segment.href);
    assert.deepEqual(links, [{ text: october.faqs[target - 1].question, href: `/explore/ev-guides/questions#AU20261023-${String(target).padStart(2, '0')}` }]);
    assert.doesNotMatch(faqAnswerText(faq, faqData.faqs), /\bFAQ \d+/);
  }
});
