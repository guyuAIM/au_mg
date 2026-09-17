import faqData from '../data/faq-data.json' with { type: 'json' };
import { editorialGuides, guideSources, legacyGuideAliases } from '../data/editorial-guides.js';

export { faqData, editorialGuides, guideSources, legacyGuideAliases };

export const faqCategories = ['All topics', 'Budget & offers', 'Choosing your MG', 'Compare models', 'Space & family', 'Ownership & warranty'];
export const faqModels = [['all', 'All models'], ['urban', 'MG4 EV Urban'], ['mg4', 'MG4 EV'], ['s5', 'MGS5 EV'], ['s6', 'MGS6 EV'], ['hybrid', 'MG hybrids']];
export const guideCategories = ['All guides', 'EV basics', 'Charging', 'Range & batteries', 'Budget & value', 'Choosing an EV', 'Family electric SUVs', 'Ownership costs'];
export const guidePath = (slug) => `/explore/ev-guides/${slug}`;
export const questionsPath = '/explore/ev-guides/questions';

export const canonicalRoutes = [
  '/explore/ev-guides',
  questionsPath,
  ...editorialGuides.map((guide) => guidePath(guide.slug))
];

function assert(condition, message) {
  if (!condition) throw new Error(`Content contract failed: ${message}`);
}

export function validateContent() {
  assert(faqData.faqs.length === 16, `expected 16 FAQs, found ${faqData.faqs.length}`);
  assert(editorialGuides.length === 14, `expected 14 guides, found ${editorialGuides.length}`);
  assert(Object.keys(legacyGuideAliases).length === 25, `expected 25 legacy aliases, found ${Object.keys(legacyGuideAliases).length}`);
  assert(new Set(editorialGuides.map((guide) => guide.slug)).size === editorialGuides.length, 'guide slugs must be unique');
  assert(new Set(editorialGuides.map((guide) => guide.guideId)).size === editorialGuides.length, 'guide IDs must be unique');
  assert(new Set(faqData.faqs.map((faq) => faq.id)).size === faqData.faqs.length, 'FAQ IDs must be unique');

  const faqIds = new Set(faqData.faqs.map((faq) => faq.id));
  const guideIds = new Set(editorialGuides.map((guide) => guide.guideId));
  const sourceIds = new Set(Object.keys(guideSources));
  const faqSourceIds = new Set(Object.keys(faqData.sources));

  for (const faq of faqData.faqs) {
    assert(faq.question && faq.paragraphs?.length, `FAQ ${faq.id} is missing visible content`);
    for (const id of faq.related || []) assert(faqIds.has(id), `FAQ ${faq.id} references missing FAQ ${id}`);
    for (const id of faq.sources || []) assert(faqSourceIds.has(id), `FAQ ${faq.id} references missing source ${id}`);
    assert(faqSourceIds.has(faq.cta), `FAQ ${faq.id} references missing CTA source ${faq.cta}`);
  }

  for (const guide of editorialGuides) {
    assert(guide.title && guide.summary && guide.quickAnswer, `guide ${guide.guideId} is missing visible content`);
    assert(guide.sections?.length >= 2, `guide ${guide.guideId} must contain sections`);
    assert(guide.faq?.length >= 4, `guide ${guide.guideId} must contain buyer FAQs`);
    for (const id of guide.related || []) assert(guideIds.has(id), `guide ${guide.guideId} references missing guide ${id}`);
    for (const id of [...guide.sources, ...guide.sections.flatMap((section) => section.sources || [])]) {
      assert(sourceIds.has(id), `guide ${guide.guideId} references missing source ${id}`);
    }
  }

  for (const [alias, slug] of Object.entries(legacyGuideAliases)) {
    assert(alias !== slug, `legacy alias ${alias} maps to itself`);
    assert(editorialGuides.some((guide) => guide.slug === slug), `legacy alias ${alias} references missing guide ${slug}`);
  }

  return {
    faqCount: faqData.faqs.length,
    guideCount: editorialGuides.length,
    legacyAliasCount: Object.keys(legacyGuideAliases).length,
    guideSourceCount: Object.keys(guideSources).length,
    canonicalRouteCount: canonicalRoutes.length
  };
}

validateContent();
