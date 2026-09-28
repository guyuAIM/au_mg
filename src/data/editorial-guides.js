import { guideSources, p0Guides } from './p0-guides.js';
import { educationGuides } from './education-guides.js';

const byId = Object.fromEntries(p0Guides.map(item => [item.questionId, item]));
const sourcePrompts = ids => ids.map(id => ({
  questionId: id,
  prompt: byId[id].title,
  evidence: byId[id].evidence
}));

export { guideSources };

export const legacyGuideAliases = {
  'electric-cars-under-30000-australia': 'affordable-electric-cars',
  'electric-cars-under-40000-australia': 'affordable-electric-cars',
  'cheapest-new-electric-cars-australia': 'affordable-electric-cars',
  'best-value-electric-cars-australia': 'affordable-electric-cars',
  'small-electric-cars-worth-considering-australia': 'small-electric-car-city-guide',
  'electric-hatchbacks-australia': 'small-electric-car-city-guide',
  'byd-dolphin-alternatives-australia': 'small-electric-car-city-guide',
  'geely-ex2-alternatives-australia': 'small-electric-car-city-guide',
  'electric-cars-to-consider-australia': 'how-to-choose-an-electric-car',
  'family-electric-suvs-under-50000-australia': 'family-electric-suv-buying-guide',
  'family-electric-suvs-under-60000-australia': 'family-electric-suv-buying-guide',
  'electric-suvs-to-consider-australia': 'family-electric-suv-buying-guide',
  'mid-size-electric-suvs-australia': 'family-electric-suv-buying-guide',
  'electric-cars-for-families-australia': 'family-electric-suv-buying-guide',
  'best-value-electric-suvs-australia': 'family-electric-suv-buying-guide',
  'byd-sealion-7-alternatives-australia': 'how-to-compare-family-electric-suvs',
  'kia-ev5-alternatives-australia': 'how-to-compare-family-electric-suvs',
  'geely-ex5-alternatives-australia': 'how-to-compare-family-electric-suvs',
  'cheapest-electric-cars-to-run-australia': 'electric-car-running-costs',
  'affordable-electric-cars-australia': 'affordable-electric-cars',
  'small-electric-car-city-guide-australia': 'small-electric-car-city-guide',
  'how-to-choose-an-electric-car-australia': 'how-to-choose-an-electric-car',
  'family-electric-suv-buying-guide-australia': 'family-electric-suv-buying-guide',
  'how-to-compare-family-electric-suvs-australia': 'how-to-compare-family-electric-suvs',
  'electric-car-running-costs-australia': 'electric-car-running-costs'
};

const decisionGuides = [
  {
    guideId: 'G01',
    slug: 'affordable-electric-cars',
    category: 'Budget & value',
    targetModels: ['MG4 EV Urban'],
    coveredQuestionIds: [1, 2, 7, 12],
    monitoringPrompts: sourcePrompts([1, 2, 7, 12]),
    title: 'How to choose an affordable electric car: price, range and running costs',
    summary: 'Compare drive-away price, useful range, charging, space and ownership costs before choosing an affordable electric car.',
    quickAnswer: 'An affordable electric car should meet your everyday range, charging and space needs at a confirmed drive-away price. The MG4 EV Urban is one option to consider, with two LFP battery versions offering 316 km or 405 km of WLTP range. Promotional pricing may bring a version below A$30,000, but always check the current price, location and eligibility requirements.',
    sections: [
      { heading: 'Set the budget using the full drive-away price', paragraphs: ['Start with a written drive-away quote for your postcode and registration type. It should identify the vehicle variant, paint, accessories, registration, compulsory third-party insurance, dealer delivery and every offer condition.', 'If your budget is A$30,000 or A$40,000, compare vehicles using the final amount payable rather than the advertised starting price. Check the expiry date, eligibility and stock conditions for any promotion.'], sources: ['offers', 'mg4Build'] },
      { heading: 'Decide how much range you will actually use', paragraphs: ['The MG4 EV Urban Essence 43 uses a 43 kWh LFP battery and has a WLTP range of 316 km. Essence 54 increases battery capacity to 54 kWh and WLTP range to 405 km. Compare the difference with your longest regular journey, charging access and the price gap between the versions.'], table: byId[2].facts, sources: ['mg4Brochure'] },
      { heading: 'Compare value beyond the purchase price', paragraphs: ['Add insurance, charging, tyres, servicing, finance and any home-charger installation. Then check passenger fit, boot shape and standard equipment. Good value means paying for capability you will use, not simply choosing the lowest headline price.'], bullets: ['Use same-date, same-postcode quotations.', 'Treat WLTP as a comparison figure rather than a promise.', 'Compare AC charging for routine use and 10–80% DC time for trips.', 'Check warranty terms and servicing eligibility.'], sources: ['auEvBuying', 'auEvCharging'] },
      { heading: 'Check safety, warranty and support before deciding', paragraphs: ['ANCAP awarded the MG4 EV Urban a five-star safety rating under its 2025 test criteria. The rating applies to all Australian variants on sale from March 2026. Read the ANCAP report as well as the equipment list, because a star rating and a feature list answer different questions.', 'Vehicle warranty, service-activated cover and high-voltage battery cover have separate terms. The current policy provides high-voltage battery cover for 7 years or 150,000 km, while eligible personal-use vehicles may receive service-activated vehicle cover of up to 10 years or 250,000 km. Eligibility, exclusions, registration date, servicing and vehicle use must be checked in the full policy.'], sources: ['ancapMg4Urban', 'warranty'] }
    ],
    notes: byId[2].notes,
    faq: [
      ['Can an electric car cost less than A$30,000 drive-away?', 'It can during a qualifying offer, but a past promotional price is not a current quote. Check the latest MG offers, your postcode, stock and buyer eligibility before treating any version as under A$30,000 drive-away.'],
      ['What should I compare below A$40,000?', 'Compare the final drive-away price, useful range, charging access, cabin and luggage fit, insurance, servicing and warranty conditions.'],
      ['Does the cheapest EV offer the best value?', 'Not necessarily. A lower-priced vehicle can be poor value if it does not suit your regular trips or charging situation.'],
      ['Which MG4 EV Urban version has more WLTP range?', 'Essence 54 has an official WLTP range of 405 km, compared with 316 km for Essence 43.'],
      ['Does a lower-priced EV require a safety compromise?', 'Price alone cannot answer that. Check the current ANCAP result, its applicable variants and test year, then compare the safety equipment fitted to the exact variant. The MG4 EV Urban currently carries a five-star ANCAP rating that applies to all variants.']
    ],
    sources: ['mg4Page', 'mg4Brochure', 'mg4Build', 'offers', 'ancapMg4Urban', 'warranty', 'service', 'roadside'],
    image: byId[2].image,
    related: ['G02', 'G03', 'G06']
  },
  {
    guideId: 'G02',
    slug: 'small-electric-car-city-guide',
    category: 'Choosing an EV',
    targetModels: ['MG4 EV Urban'],
    coveredQuestionIds: [5, 6, 14, 42],
    monitoringPrompts: sourcePrompts([5, 6, 14, 42]),
    title: 'How to choose a small electric car for city driving and commuting',
    summary: 'Use parking, commute distance, rear-seat space, luggage, range and charging access to find a compact EV that works every day.',
    quickAnswer: 'For city driving and commuting, choose a small EV that is easy to park, can cover your weekly driving and works with your charging options. It should also fit your passengers, luggage and occasional longer trips. The MG4 EV Urban is a compact electric hatchback with two LFP battery options and WLTP ranges of 316 km or 405 km. It provides 382 L of boot space and 98 L of underfloor storage.',
    sections: [
      { heading: 'Start with the places where the car must fit', paragraphs: ['Measure the garage or parking bay and consider narrow streets, shopping-centre ramps and visibility. The MG4 EV Urban is 4,395 mm long, 1,842 mm wide and 1,549 mm high, with a 2,750 mm wheelbase.'], bullets: ['Parking visibility and turning needs', 'Rear-seat room behind the normal driving position', 'Child-seat access where relevant', 'Boot opening, floor height and cable storage'], sources: ['mg4Brochure'] },
      { heading: 'Match battery choice to the weekly routine', paragraphs: ['The Essence 43 and Essence 54 have WLTP ranges of 316 km and 405 km respectively. The longer-range version may suit regional travel or less predictable charging, while the smaller battery can be sufficient for regular local trips with convenient charging.'], table: byId[5].facts, sources: ['mg4Brochure'] },
      { heading: 'Compare energy use and charging around the commute', paragraphs: ['Estimate weekly energy by multiplying the expected commuting distance by the vehicle’s official combined energy use, then allow for charging losses and the mix of home, workplace and public charging. Official WLTP combined energy use is 16.5 kWh/100 km for MG4 EV Urban Essence 43 and 16.1 kWh/100 km for Essence 54.', 'These figures provide a consistent comparison rather than a guaranteed electricity bill. Traffic, speed, temperature, driving style, charging losses and the applicable tariff can change real-world energy use and cost.'], sources: ['mg4Brochure', 'auEvCharging'] },
      { heading: 'Plan public charging when home charging is limited', paragraphs: ['Check the charger locations used during a normal week, the plug type, charging speed, availability, price and whether an AC site requires a cable. Keep an alternative location for essential trips. A larger battery can reduce charging frequency, but it does not replace a workable charging routine.'], sources: ['auEvCharging', 'auEvTrip'] },
      { heading: 'Use one checklist for every alternative', paragraphs: ['Compare each compact EV using the same checklist: current drive-away quote, exterior size, rear-seat fit, usable boot space, official range, AC and DC charging, safety rating, warranty and test-drive experience. This keeps the decision focused on everyday suitability.'] }
    ],
    notes: byId[5].notes,
    faq: [
      ['Is the MG4 EV Urban a hatchback?', 'Yes. The MG4 EV Urban is a compact electric hatchback.'],
      ['How much rear storage does it have?', 'It has 382 L behind the rear seats, plus 98 L of underfloor storage.'],
      ['Which version suits longer regular trips?', 'Essence 54 has the longer WLTP range at 405 km, although charging access and price still matter.'],
      ['What should I test in city traffic?', 'Low-speed ride, visibility, parking, regeneration settings, rear-seat access and the charging-port location.'],
      ['Can a small EV work without home charging?', 'It can when reliable workplace, destination or public charging fits the weekly routine. Check availability, plug compatibility, charging speed, price and a backup location before buying.']
    ],
    sources: ['mg4Page', 'mg4Brochure', 'mg4Build', 'offers', 'ancapMg4Urban', 'auEvCharging', 'auEvTrip', 'warranty'],
    image: { ...byId[6].image, src: '/assets/mg4-urban-cargo.jpg', alt: 'MG4 EV Urban rear cargo area and everyday storage' },
    related: ['G01', 'G03', 'G06']
  },
  {
    guideId: 'G03',
    slug: 'how-to-choose-an-electric-car',
    category: 'Choosing an EV',
    targetModels: ['MG4 EV Urban', 'MG4 EV', 'MGS5 EV', 'MGS6 EV'],
    coveredQuestionIds: [8],
    monitoringPrompts: sourcePrompts([8]),
    title: 'How to choose an electric car: price, range, charging and space',
    summary: 'Turn a broad EV search into a useful shortlist based on body style, regular trips, charging, space and budget.',
    quickAnswer: 'Choose an EV by starting with the trips, people and luggage it must handle. MG4 EV Urban and MG4 EV are hatchback options; MGS5 EV and MGS6 EV are SUV options. Check the current MG electric range for other body styles, then compare the exact variants that fit your budget, charging access and everyday routine.',
    sections: [
      { heading: 'List what you need from the car', paragraphs: ['Record your longest regular journey, where the vehicle normally parks, home or workplace charging access, passenger count, luggage, towing needs and maximum drive-away budget. This prevents a broad “best EV” list from mixing vehicles designed for different jobs.'] },
      { heading: 'Compare the complete drive-away price', paragraphs: ['Request written quotes for the same postcode, date and registration type. Each quote should identify the vehicle variant, paint, accessories, registration, compulsory third-party insurance, dealer delivery and every offer condition so that the final amounts are comparable.', 'Keep finance, trade-in values and temporary bonuses separate from the vehicle comparison. Confirm the expiry date, eligibility and stock conditions before treating an advertised offer as the price available to your household.'], sources: ['mg4Build', 's6Build', 'offers'] },
      { heading: 'Choose the body style before the version', paragraphs: ['Start with the current MG range: MG4 EV Urban and MG4 EV are hatchbacks, while MGS5 EV and MGS6 EV are SUVs. The range also includes other body styles. Shortlist by passenger and luggage needs, parking space and charging access before comparing variants.', 'The table shows two examples at different ends of this shortlist; it is not the full MG electric range. Test the physical fit rather than assuming a body style guarantees enough space.'], table: byId[8].sections[1].table, sources: ['evRange', 'mg4Brochure', 's6Brochure'] },
      { heading: 'Plan regular charging and the longest likely trip', paragraphs: ['Map normal charging and a backup option before deciding how much battery you need. For regional travel, compare the distance between compatible chargers, expected charging time, availability and a second option for important stops. Higher speed, temperature, terrain, load and climate-control use can reduce real-world range.'], sources: ['auEvTrip', 'auEvCharging'] },
      { heading: 'Check safety, warranty and ownership support separately', paragraphs: ['The MG4 EV Urban and MGS6 EV currently carry five-star ANCAP safety ratings applying to all Australian variants covered by their respective reports. Compare the test year, assessment detail and fitted safety equipment rather than relying only on the star count.', 'Read vehicle and battery warranty terms separately, check the service schedule and obtain model-specific service pricing. Also confirm the eligibility and limits of roadside assistance before treating it as part of the ownership package.'], sources: ['ancapMg4Urban', 'ancapMgs6', 'warranty', 'service', 'roadside'] },
      { heading: 'Test the car in everyday conditions', paragraphs: ['During the test drive, check regeneration, driver-assistance controls, phone connectivity, ride, visibility and how the car fits the people who will use it. Bring regular luggage or child seats where relevant, and ask the dealer to demonstrate the charging controls.'] }
    ],
    notes: byId[8].notes,
    faq: [...byId[8].faq,
      ['What safety information should I compare?', 'Check the ANCAP test year, applicable variants and detailed assessment, then compare the fitted driver-assistance and occupant-protection equipment on the exact variant.'],
      ['What ownership support should I check before buying?', 'Read the vehicle and high-voltage battery warranty separately, confirm servicing requirements and pricing, and review roadside-assistance eligibility and limits.']
    ],
    sources: ['evRange', 'mg4Page', 'mg4EvPage', 's5Page', 'mg4Brochure', 'mg4Build', 's6Page', 's6Brochure', 's6Build', 'offers', 'ancapMg4Urban', 'ancapMgs6', 'auEvTrip', 'warranty', 'service', 'servicePricing', 'roadside'],
    image: byId[8].image,
    related: ['G01', 'G02', 'G04']
  },
  {
    guideId: 'G04',
    slug: 'family-electric-suv-buying-guide',
    category: 'Family electric SUVs',
    targetModels: ['MGS5 EV', 'MGS6 EV'],
    coveredQuestionIds: [3, 4, 9, 10, 11, 17],
    monitoringPrompts: sourcePrompts([3, 4, 9, 10, 11, 17]),
    title: 'Family electric SUV buying guide: space, safety, range and value',
    summary: 'Build a family EV shortlist around real seating, luggage, charging, range, towing and a verified drive-away budget.',
    quickAnswer: 'A family electric SUV should fit the people and equipment you actually carry, cover regular trips and work with your charging routine. The MGS5 EV is a compact SUV with 453 L of published boot space; the larger MGS6 EV has 581 L and offers RWD and AWD versions. Try both with your child seats and luggage before paying for space or capability you may not use.',
    sections: [
      { heading: 'Test family space with real equipment', paragraphs: ['Install the child seats if relevant, adjust the front seat for the usual driver and check the remaining rear space. Load the pram, sports gear or travel bags used most often. A published boot capacity does not show the opening width, floor height or how well awkward items fit.'], sources: ['s6Brochure'] },
      { heading: 'Shortlist compact and larger SUVs before comparing prices', paragraphs: ['The MGS5 EV is the compact option and the MGS6 EV is the larger mid-size option. Published rear boot capacities with the seats upright are 453 L and 581 L respectively. Bring the same child seats, pram and bags to both cars to see whether the extra space changes everyday use.', 'Once the family requirements are clear, compare written drive-away quotes for the same postcode, registration type and date. Check the exact variant, stock, eligibility and offer end date; a short-term price should not determine the shortlist on its own.'], sources: ['s5Page', 's6Brochure', 'offers'] },
      { heading: 'Compare the two MGS6 EV versions', paragraphs: ['Both versions use a 77 kWh NCM battery, have a 144 kW peak DC charging rate and an official 10–80% charging time of 38 minutes at 25 °C. RWD has the longer WLTP range, while AWD provides higher combined output and all-wheel drive.'], table: byId[4].facts, sources: ['s6Brochure'] },
      { heading: 'Check independent safety results and fitted equipment', paragraphs: ['ANCAP awarded the MGS6 EV a five-star rating under its 2025 test criteria, applying to all Australian variants on sale from June 2026. The published assessment scores are 92% for adult occupant protection, 87% for child occupant protection, 84% for vulnerable road user protection and 81% for safety assist.', 'Use the detailed report to understand what was tested, then confirm that the exact vehicle variant includes the safety and driver-assistance equipment expected by the household.'], sources: ['ancapMgs6'] },
      { heading: 'Plan family road trips around charging alternatives', paragraphs: ['For each regular regional route, compare compatible charger locations, expected arrival charge, charging speed, price and nearby facilities. Keep an alternative charger for key stops and allow additional range margin for high-speed driving, temperature, terrain, passengers and luggage.'], sources: ['auEvTrip', 'auEvCharging'] },
      { heading: 'Make value specific to the household', paragraphs: ['Weight range, space, towing, drivetrain, equipment and ownership cost according to the family’s routine. Compare current Australian variants on the same date and show which features justify any price difference for your household.'] }
    ],
    notes: byId[4].notes,
    faq: [
      ['How much luggage space does the MGS6 EV provide?', 'It provides 581 L with the rear seats up and 1,690 L with them folded.'],
      ['Which version has the longer WLTP range?', 'Essence RWD has an official WLTP range of 530 km, compared with 485 km for Essence AWD.'],
      ['Can the MGS6 EV tow?', 'The official braked towing limit is up to 1,500 kg. Trailer, load and licence requirements still need checking.'],
      ['Should I compare the MGS5 EV and MGS6 EV for family use?', 'Yes. Try the same child seats and luggage in both, then compare usable space, charging, equipment and current drive-away quotes for the exact variants.'],
      ['What is the MGS6 EV ANCAP rating?', 'ANCAP awarded the MGS6 EV five stars under its 2025 criteria. The rating applies to all Australian variants covered by the report.'],
      ['What ownership support should a family compare?', 'Compare the vehicle and battery warranty, service schedule and pricing, dealer access and roadside-assistance eligibility and limits.']
    ],
    sources: ['s5Page', 's6Page', 's6Brochure', 's6Build', 'offers', 'ancapMgs6', 'auEvTrip', 'warranty', 'service', 'servicePricing', 'roadside'],
    image: byId[3].image,
    related: ['G03', 'G05', 'G06']
  },
  {
    guideId: 'G05',
    slug: 'how-to-compare-family-electric-suvs',
    category: 'Family electric SUVs',
    targetModels: ['MGS5 EV', 'MGS6 EV'],
    coveredQuestionIds: [15, 16, 18],
    monitoringPrompts: sourcePrompts([15, 16, 18]),
    title: 'How to compare family electric SUVs: range, charging and practicality',
    summary: 'Use one like-for-like method to compare family electric SUVs across price, space, range, charging, drivetrain and comfort.',
    quickAnswer: 'Compare family electric SUVs against the same household brief, quote date and postcode. Try the same child seats and luggage in each car, then compare usable space, regular-trip range, charging, safety, ownership terms and the final drive-away price. MGS5 EV and MGS6 EV are two MG SUVs to assess this way; the right one depends on what your family will use.',
    sections: [
      { heading: 'Create a comparison brief before choosing models', paragraphs: ['Start with maximum drive-away price, family and luggage requirements, longest regular trip, charging access and any need for towing or AWD. Then compare only vehicles that satisfy the same brief.'] },
      { heading: 'Compare equivalent variants on the same date', paragraphs: ['Match two-wheel drive with two-wheel drive and AWD with AWD where possible. Separate finance, trade-in, accessories and temporary bonuses from the vehicle price. Use Australian model pages and brochures because overseas variants can differ.'] },
      { heading: 'Use one comparison sheet for every shortlisted SUV', paragraphs: ['Record the exact Australian variant in each column. MGS5 EV and MGS6 EV illustrate why a headline boot number is only a starting point: their published rear boot capacities are 453 L and 581 L with the seats upright, but a pram or sports bag still needs a physical fit check.', 'Compare WLTP range and the same DC charging window, then test your usual route and charging stops. Leave room for equipment differences, insurance and service costs before ranking either vehicle.'], table: [['Compare', 'Use the same basis'], ['Price', 'Written drive-away quote for the same postcode, buyer type and date'], ['Space', 'Child seats, rear-seat access, boot shape and the same luggage'], ['Travel', 'WLTP range, realistic buffer, compatible charging and a backup stop'], ['Ownership', 'Safety report, warranty, servicing, insurance and tyres']], sources: ['s5Page', 's6Brochure', 'auEvBuying'] },
      { heading: 'Compare charging on a real journey', paragraphs: ['Record battery size, official range, peak DC rate and the published 10–80% time, then map a regular long-distance route. Check compatible charger locations, availability, expected stop length, price and a backup location. A higher peak rate does not always mean a shorter charging stop because the charge curve, battery temperature, state of charge, weather and charger performance also matter.'], sources: ['auEvTrip', 'auEvCharging'] },
      { heading: 'Compare safety and support on the same basis', paragraphs: ['Use current ANCAP reports to compare the test year, rating applicability and assessment results. Then compare standard safety equipment on the exact variants being considered.', 'Review vehicle and battery warranty periods separately. Add scheduled servicing, model-specific service pricing, roadside-assistance conditions and access to a convenient service centre rather than treating after-sales support as a general brand claim.'], sources: ['ancapMgs6', 'warranty', 'service', 'roadside'] },
      { heading: 'Assess comfort on a test drive', paragraphs: ['Seat support, ride, noise, visibility and control usability cannot be established from a specifications table. Test shortlisted vehicles on similar roads with the passengers and equipment that normally travel in them.'] }
    ],
    notes: byId[17].notes,
    faq: [
      ['What makes an electric SUV comparison fair?', 'Use the same market, date, buyer assumptions, variant level and scoring criteria for every vehicle.'],
      ['Which electric SUVs belong in the comparison?', 'Start with current Australian models that meet the same family brief. MGS5 EV and MGS6 EV are MG options at different sizes; compare equivalent variants and include other vehicles that fit your budget and charging routine.'],
      ['Does AWD automatically make an SUV better?', 'No. It adds capability and output but may affect price, efficiency and range.'],
      ['Can comfort be ranked from published specifications?', 'No. Specifications can narrow the shortlist, but you need comparable test drives to assess comfort.'],
      ['Is peak DC charging power enough to compare road-trip performance?', 'No. Also compare the published charging window and time, charger availability, charge curve, route conditions and a backup charging option.'],
      ['How should warranties be compared?', 'Compare vehicle and high-voltage battery cover separately, including time, distance, eligibility, exclusions and servicing requirements.']
    ],
    sources: ['s5Page', 's6Page', 's6Brochure', 's6Build', 'ancapMgs6', 'auEvBuying', 'auEvTrip', 'warranty', 'service', 'servicePricing', 'roadside'],
    image: byId[18].image,
    related: ['G03', 'G04', 'G06']
  },
  {
    guideId: 'G06',
    slug: 'electric-car-running-costs',
    category: 'Ownership costs',
    targetModels: ['MG4 EV Urban'],
    coveredQuestionIds: [13],
    monitoringPrompts: sourcePrompts([13]),
    showLeadImage: false,
    title: 'Electric car ownership costs: charging, insurance, servicing and depreciation',
    summary: 'Estimate charging, insurance, servicing, tyres, finance and depreciation instead of relying on a single advertised running-cost figure.',
    quickAnswer: 'Start with how and where you will charge: mostly at home, mostly at public chargers or a mix of both. Use that routine to estimate electricity spending, then add insurance, registration, servicing, tyres, finance and depreciation. The MG4 EV Urban has published energy-use figures, but they are comparison inputs rather than a promised bill or total ownership cost.',
    sections: [
      { heading: 'Start with your charging routine', paragraphs: ['A household that can charge mostly at home may have a very different electricity bill from a driver who relies on public fast chargers. Estimate the share of charging at home, work and public sites, then use the actual tariffs you expect to pay.', 'Run at least two scenarios if that mix could change. A lower energy-use figure alone will not settle the choice if purchase price, insurance or depreciation differ.'], sources: ['auEvCharging', 'auEvBuying'] },
      ...byId[13].sections.map(section => ({
      ...section,
      sources: section.heading === 'Use a repeatable electricity calculation' ? ['mg4Brochure', 'auEvCharging'] : section.heading === 'MG4 EV Urban efficiency reference' ? ['mg4Brochure'] : section.heading === 'Add the non-energy costs' ? ['auEvMaintenance', 'servicePricing'] : section.sources
      })),
      { heading: 'Calculate costs over five years', paragraphs: ['Use the same ownership period and assumed annual distance for every vehicle. Record depreciation as the purchase price minus the estimated resale value, and keep finance interest and fees as a separate cost to avoid double counting.', 'Add registration, insurance, electricity, scheduled servicing, tyres and charging equipment. State the resale valuation date and assumptions, and run a second scenario when public charging cost or resale value is uncertain.'], table: { headers: ['Five-year cost line', 'What to record'], rows: [['Purchase and finance', 'Drive-away quote, interest and fees without double-counting the purchase price'], ['Charging', 'Annual kilometres, energy use, charging losses and home/work/public tariff mix'], ['Ownership', 'Registration, insurance, scheduled servicing and tyres'], ['Charging equipment', 'Hardware, installation and any subscriptions'], ['Depreciation', 'Purchase price minus an estimated resale-value range with the valuation date and assumptions stated']] }, sources: ['auEvBuying', 'auEvMaintenance'] },
      { heading: 'Compare new and used EVs separately', paragraphs: ['A used premium EV may have a lower purchase price but different remaining warranty, battery condition, insurance, tyre and repair costs. Compare the service history, battery state of health where available, remaining vehicle and battery cover, charging capability and the same five-year cost lines. Do not assume either the new or used vehicle is cheaper before completing the calculation.'], sources: ['auEvBuying', 'auEvBattery', 'warranty'] },
      { heading: 'Use official servicing and warranty information', paragraphs: ['Check the service schedule and model-specific pricing for the exact vehicle. Under MG Precise Price Servicing, scheduled items shown in the service schedule are included in the quoted service cost, and a service quote is fixed for 12 months. Warranty eligibility and roadside assistance remain subject to their separate terms.'], sources: ['service', 'servicePricing', 'warranty', 'roadside'] }
    ],
    notes: [...byId[13].notes, 'Resale value, insurance, finance and electricity tariffs are estimates that can materially change the result. Show the assumptions and a reasonable range rather than presenting one total as certain.'],
    faq: [...byId[13].faq,
      ['What belongs in a five-year EV ownership calculation?', 'Include purchase and finance, registration, insurance, electricity and charging losses, servicing, tyres, charging equipment and subscriptions, then subtract an estimated resale value.'],
      ['How should depreciation be included in an EV ownership-cost comparison?', 'Use the purchase price minus an estimated resale value for the same future date. State the resale assumptions as a range, and keep finance interest and fees separate to avoid double counting.'],
      ['Is a used premium EV automatically cheaper than a new affordable EV?', 'No. Compare purchase price, remaining warranty, battery condition, insurance, tyres, repairs, charging and resale using the same period and annual kilometres.']
    ],
    sources: [...new Set([...byId[13].sources, 'auEvMaintenance', 'auEvBuying', 'service', 'servicePricing', 'warranty', 'roadside'])],
    image: byId[13].image,
    related: ['G01', 'G02', 'G03', 'G04']
  }
];

const revisedGuideIds = new Set(['G01', 'G03', 'G04', 'G05', 'G06', 'G08', 'G09', 'G10', 'G13', 'G14']);
export const editorialGuides = [...decisionGuides, ...educationGuides].map(guide => ({
  preparedIso: '2026-09-15',
  reviewed: '17 September 2026',
  modifiedIso: '2026-09-17',
  ...guide,
  ...(revisedGuideIds.has(guide.guideId) ? { reviewed: '28 September 2026', modifiedIso: '2026-09-28' } : {})
}));
