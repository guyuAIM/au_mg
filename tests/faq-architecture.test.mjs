import test from 'node:test';
import assert from 'node:assert/strict';
import { budgetBands, evModels, evPriceSnapshot, modelBudgetBands } from '../src/data/ev-models.js';
import { evFaqBasics } from '../src/data/ev-faq-basics.js';

test('every EV topic has one cross-model answer before model selection', () => {
  const topics = ['Budget & offers', 'Choosing an EV', 'Compare models', 'Space & family', 'Driving & charging', 'Ownership & warranty'];
  assert.deepEqual(evFaqBasics.map((faq) => faq.category), topics);
  assert.ok(evFaqBasics.every((faq) => faq.audience === 'all-evs' && faq.models.length === 0 && faq.sources.length > 0));
});

test('variant prices place models in every applicable budget band', () => {
  assert.equal(budgetBands.length, 4);
  const byId = Object.fromEntries(evModels.map((model) => [model.id, modelBudgetBands(model)]));
  assert.deepEqual(byId.urban, ['under-30', '30-50']);
  assert.deepEqual(byId.mg4, ['30-50']);
  assert.deepEqual(byId.s5, ['30-50']);
  assert.deepEqual(byId.s6, ['30-50', '50-100']);
  assert.deepEqual(byId.im5, ['50-100']);
  assert.deepEqual(byId.im6, ['50-100']);
  assert.deepEqual(byId.cyberster, ['50-100', '100-plus']);
  assert.deepEqual(byId.u9ev, []);
  assert.ok(evModels.filter((model) => model.variants.length).every((model) => model.priceSource?.startsWith('/configurator/')));
  assert.ok(new Date(evPriceSnapshot.checked) <= new Date(evPriceSnapshot.validUntil));
});
