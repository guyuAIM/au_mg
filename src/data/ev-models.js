// Editorial snapshot for the local FAQ prototype. Prices are variant-level NSW
// private-registration drive-away figures, not a live pricing feed.
export const evPriceSnapshot = {
  checked: '2026-09-28',
  validUntil: '2026-09-30',
  context: 'NSW private registration; eligible offers and vehicle availability vary. Confirm a current written quote for your postcode.'
};

export const budgetBands = [
  { id: 'under-30', label: 'Under A$30,000', min: 0, max: 30000 },
  { id: '30-50', label: 'A$30,000–49,999', min: 30000, max: 50000 },
  { id: '50-100', label: 'A$50,000–99,999', min: 50000, max: 100000 },
  { id: '100-plus', label: 'A$100,000+', min: 100000, max: Infinity }
];

export const evModels = [
  { id: 'urban', name: 'MG4 EV Urban', type: 'Electric hatchback', url: '/vehicles/mg4-ev-urban', priceSource: '/configurator/mg4-ev-urban', variants: [{ name: 'Essence 43', price: 29990 }, { name: 'Essence 54', price: 32990 }] },
  { id: 'mg4', name: 'MG4 EV', type: 'Electric hatchback', url: '/vehicles/mg4-ev', priceSource: '/configurator/mg4-ev', variants: [{ name: 'Essence 64', price: 39990 }, { name: 'XPOWER', price: 47990 }] },
  { id: 's5', name: 'MGS5 EV', type: 'Electric SUV', url: '/vehicles/mgs5-ev', priceSource: '/configurator/mgs5-ev', variants: [{ name: 'Essence 49 kWh', price: 41990 }, { name: 'Essence 62 kWh', price: 46990 }] },
  { id: 's6', name: 'MGS6 EV', type: 'Electric SUV', url: '/vehicles/mgs6-ev', priceSource: '/configurator/mgs6-ev', variants: [{ name: 'Essence RWD', price: 49990 }, { name: 'Essence AWD', price: 56990 }] },
  { id: 'im5', name: 'IM5', type: 'Electric luxury sedan', brandNote: 'Presented by MG', url: '/vehicles/im5', priceSource: '/configurator/im5', variants: [{ name: 'Premium', price: 57990 }, { name: 'Platinum', price: 64990 }, { name: 'Performance', price: 74990 }] },
  { id: 'im6', name: 'IM6', type: 'Electric luxury SUV', brandNote: 'Presented by MG', url: '/vehicles/im6', priceSource: '/configurator/im6', variants: [{ name: 'Premium', price: 57990 }, { name: 'Platinum', price: 64990 }, { name: 'Performance', price: 74990 }] },
  { id: 'cyberster', name: 'Cyberster', type: 'Electric roadster', url: '/vehicles/cyberster', priceSource: '/configurator/cyberster', variants: [{ name: 'RWD', price: 99900 }, { name: 'AWD', price: 115000 }] },
  { id: 'u9ev', name: 'MGU9 EV', type: 'Electric dual-cab ute', url: '/vehicles/mgu9-ev', availability: 'Coming soon', variants: [] }
];

export const modelBudgetBands = (model) => [...new Set(model.variants.flatMap((variant) => budgetBands.filter((band) => variant.price >= band.min && variant.price < band.max).map((band) => band.id)))];
