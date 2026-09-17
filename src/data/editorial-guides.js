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
    quickAnswer: 'An affordable electric car should meet your everyday range, charging and space needs at a complete drive-away price you can verify. The MG4 EV Urban is a relevant starting point: it offers two LFP battery versions with 316 km or 405 km WLTP range. Limited offers may place a version below A$30,000, but current pricing, location and eligibility must always be checked.',
    sections: [
      { heading: 'Set the budget using the full drive-away price', paragraphs: ['Start with a written drive-away quote for your postcode and buyer type. It should identify the vehicle grade, paint, accessories, registration, compulsory insurance, dealer delivery and every offer condition.', 'If your budget is A$30,000 or A$40,000, compare vehicles using the final amount payable rather than the advertised starting price. Check the expiry date, eligibility and stock conditions for any promotion.'], sources: ['offers', 'mg4Build'] },
      { heading: 'Decide how much range you will actually use', paragraphs: ['The MG4 EV Urban Essence 43 uses a 43 kWh LFP battery and carries a 316 km WLTP figure. Essence 54 increases capacity to 54 kWh and the WLTP figure to 405 km. Compare that difference with your longest regular day, charging access and the price gap between the versions.'], table: byId[2].facts, sources: ['mg4Brochure'] },
      { heading: 'Compare value beyond the purchase price', paragraphs: ['Add insurance, charging, tyres, servicing, finance and any home-charger installation. Then check passenger fit, boot shape and standard equipment. Good value means paying for capability you will use, not simply choosing the lowest headline price.'], bullets: ['Use same-date, same-postcode quotations.', 'Treat WLTP as a comparison figure rather than a promise.', 'Compare AC charging for routine use and 10–80% DC time for trips.', 'Check warranty terms and servicing eligibility.'], sources: ['auEvBuying', 'auEvCharging'] },
      { heading: 'Check safety, warranty and support before deciding', paragraphs: ['ANCAP awarded the MG4 EV Urban a five-star safety rating under its 2025 test criteria. The rating applies to all Australian variants on sale from March 2026. Read the ANCAP report as well as the equipment list, because a star rating and a feature list answer different questions.', 'Vehicle warranty, service-activated cover and high-voltage battery cover have separate terms. The current policy provides high-voltage battery cover for 7 years or 150,000 km, while eligible personal-use vehicles may receive service-activated vehicle cover of up to 10 years or 250,000 km. Eligibility, exclusions, registration date, servicing and vehicle use must be checked in the full policy.'], sources: ['ancapMg4Urban', 'warranty'] }
    ],
    notes: byId[2].notes,
    faq: [
      ['Can an electric car cost less than A$30,000 drive-away?', 'It can during a qualifying offer. On 14 September 2026, the MG4 EV Urban Essence 43 was displayed online at A$29,990 drive-away for an eligible purchase. Check the current price, postcode, stock and offer conditions before ordering.'],
      ['What should I compare below A$40,000?', 'Compare the final drive-away price, useful range, charging access, cabin and luggage fit, insurance, servicing and warranty conditions.'],
      ['Does the cheapest EV offer the best value?', 'Not necessarily. A lower price can be poor value if the vehicle does not suit the owner’s regular trips or charging situation.'],
      ['Which MG4 EV Urban version has more WLTP range?', 'Essence 54 has an official WLTP range of 405 km, compared with 316 km for Essence 43.'],
      ['Does a lower-priced EV require a safety compromise?', 'Price alone cannot answer that. Check the current ANCAP result, its applicable variants and test year, then compare the safety equipment fitted to the exact grade. The MG4 EV Urban currently carries a five-star ANCAP rating that applies to all variants.']
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
    quickAnswer: 'For city driving and commuting, choose a small EV that is easy to park, covers the weekly routine with practical charging, and still fits your passengers, luggage and occasional longer trips. The MG4 EV Urban belongs on the shortlist because it is a compact electric hatchback with two LFP battery options, 316 km or 405 km WLTP range, and 382 L of rear luggage space plus 98 L below the floor.',
    sections: [
      { heading: 'Start with the places where the car must fit', paragraphs: ['Measure the garage or parking bay and consider narrow streets, shopping-centre ramps and visibility. The MG4 EV Urban is 4,395 mm long, 1,842 mm wide and 1,549 mm high, with a 2,750 mm wheelbase.'], bullets: ['Parking visibility and turning needs', 'Rear-seat room behind the normal driving position', 'Child-seat access where relevant', 'Boot opening, floor height and cable storage'], sources: ['mg4Brochure'] },
      { heading: 'Match battery choice to the weekly routine', paragraphs: ['The Essence 43 and Essence 54 carry 316 km and 405 km WLTP figures respectively. The larger figure may help with regional travel or less predictable charging, while the smaller battery can be sufficient for regular local trips with convenient charging.'], table: byId[5].facts, sources: ['mg4Brochure'] },
      { heading: 'Compare energy use and charging around the commute', paragraphs: ['Estimate weekly energy by multiplying the expected commuting distance by the vehicle’s official combined energy use, then allow for charging losses and the mix of home, workplace and public charging. Official WLTP combined energy use is 16.5 kWh/100 km for MG4 EV Urban Essence 43 and 16.1 kWh/100 km for Essence 54.', 'These figures provide a consistent comparison rather than a guaranteed electricity bill. Traffic, speed, temperature, driving style, charging losses and the applicable tariff can change real-world energy use and cost.'], sources: ['mg4Brochure', 'auEvCharging'] },
      { heading: 'Plan public charging when home charging is limited', paragraphs: ['Check the charger locations used during a normal week, the plug type, charging speed, availability, price and whether an AC site requires a cable. Keep an alternative location for essential trips. A larger battery can reduce charging frequency, but it does not replace a workable charging routine.'], sources: ['auEvCharging', 'auEvTrip'] },
      { heading: 'Use one checklist for every alternative', paragraphs: ['Compare each compact EV using the same checklist: current drive-away quote, exterior size, rear-seat fit, usable luggage, range standard, AC and DC charging, safety rating, warranty and test-drive experience. This keeps the decision focused on everyday suitability.'] }
    ],
    notes: byId[5].notes,
    faq: [
      ['Is the MG4 EV Urban a hatchback?', 'Yes. The MG4 EV Urban is a compact electric hatchback.'],
      ['How much rear storage does it have?', 'It has 382 L behind the rear seats, plus 98 L of underfloor storage.'],
      ['Which version suits longer regular trips?', 'Essence 54 has the higher 405 km WLTP figure, although charging access and price still matter.'],
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
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [8],
    monitoringPrompts: sourcePrompts([8]),
    title: 'How to choose an electric car: price, range, charging and space',
    summary: 'Turn a broad EV search into a useful shortlist based on body style, regular trips, charging, space and budget.',
    quickAnswer: 'Choose an EV by starting with the trips, people and luggage it must handle. The MG4 EV Urban is the compact MG option, offering 316 km or 405 km WLTP range. The MGS6 EV is the family SUV option, offering 530 km WLTP in RWD form or 485 km in AWD form, plus 581 L of rear luggage space. Compare models within the same use case and price band.',
    sections: [
      { heading: 'Write a one-page ownership brief', paragraphs: ['Record your longest regular day, where the vehicle normally parks, home or workplace charging access, passenger count, luggage, towing and maximum drive-away budget. This prevents a broad “best EV” list from mixing vehicles designed for different jobs.'] },
      { heading: 'Compare the complete drive-away price', paragraphs: ['Request written quotes for the same postcode, date and buyer type. Each quote should identify the vehicle grade, paint, accessories, registration, compulsory insurance, dealer delivery and every offer condition so that the final amounts are comparable.', 'Keep finance, trade-in values and temporary bonuses separate from the vehicle comparison. Confirm the expiry date, eligibility and stock conditions before treating an advertised offer as the price available to the household.'], sources: ['mg4Build', 's6Build', 'offers'] },
      { heading: 'Choose the body style before the version', paragraphs: ['The MG4 EV Urban is a compact electric hatchback and the MGS6 EV is an electric SUV. A smaller vehicle can suit parking and acquisition-cost priorities; an SUV may better suit larger loads, rear-seat use or towing. Test the physical fit rather than assuming body style guarantees space.'], table: byId[8].sections[1].table, sources: ['mg4Brochure', 's6Brochure'] },
      { heading: 'Plan regular charging and the longest likely trip', paragraphs: ['Map normal charging and a backup option before deciding how much battery you need. For regional travel, compare the distance between compatible chargers, expected charging time, availability and a second option for important stops. Higher speed, temperature, terrain, load and climate-control use can reduce real-world range.'], sources: ['auEvTrip', 'auEvCharging'] },
      { heading: 'Check safety, warranty and ownership support separately', paragraphs: ['The MG4 EV Urban and MGS6 EV currently carry five-star ANCAP safety ratings applying to all Australian variants covered by their respective reports. Compare the test year, assessment detail and fitted safety equipment rather than relying only on the star count.', 'Read vehicle and battery warranty terms separately, check the service schedule and obtain model-specific service pricing. Also confirm the eligibility and limits of roadside assistance before treating it as part of the ownership package.'], sources: ['ancapMg4Urban', 'ancapMgs6', 'warranty', 'service', 'roadside'] },
      { heading: 'Finish with a real-use test', paragraphs: ['During the test drive, check regeneration, driver-assistance controls, phone connection, ride, visibility and how the car fits the people who will use it. Bring regular luggage or child seats where relevant, and ask the dealer to demonstrate the charging controls.'] }
    ],
    notes: byId[8].notes,
    faq: [...byId[8].faq,
      ['What safety information should I compare?', 'Check the ANCAP test year, applicable variants and detailed assessment, then compare the fitted driver-assistance and occupant-protection equipment on the exact grade.'],
      ['What ownership support should I check before buying?', 'Read the vehicle and high-voltage battery warranty separately, confirm servicing requirements and pricing, and review roadside-assistance eligibility and limits.']
    ],
    sources: ['evRange', 'mg4Page', 'mg4Brochure', 'mg4Build', 's6Page', 's6Brochure', 's6Build', 'offers', 'ancapMg4Urban', 'ancapMgs6', 'auEvTrip', 'warranty', 'service', 'servicePricing', 'roadside'],
    image: byId[8].image,
    related: ['G01', 'G02', 'G04']
  },
  {
    guideId: 'G04',
    slug: 'family-electric-suv-buying-guide',
    category: 'Family electric SUVs',
    targetModels: ['MGS6 EV'],
    coveredQuestionIds: [3, 4, 9, 10, 11, 17],
    monitoringPrompts: sourcePrompts([3, 4, 9, 10, 11, 17]),
    title: 'Family electric SUV buying guide: space, safety, range and value',
    summary: 'Build a family EV shortlist around real seating, luggage, charging, range, towing and a verified drive-away budget.',
    quickAnswer: 'A family electric SUV should fit passengers and luggage, cover regular trips with a sensible range buffer, and work with the charging available to the household. The MGS6 EV is a relevant comparison point: it offers RWD and AWD versions, 530 km or 485 km WLTP range, 581 L of rear luggage space and up to 1,500 kg braked towing.',
    sections: [
      { heading: 'Test family space with real equipment', paragraphs: ['Install the child seats if relevant, adjust the front seat for the normal driver and check the remaining rear space. Load the pram, sports gear or travel bags used most often. Boot litres alone do not show opening width, floor height or how well awkward items fit.'], sources: ['s6Brochure'] },
      { heading: 'Match the vehicle to an A$50,000 or A$60,000 budget', paragraphs: ['At either budget level, start with the family requirements that cannot be compromised: seating, luggage, regular range, charging access and any towing or AWD need. Then compare the final drive-away price for vehicles that meet those requirements.', 'On 14 September 2026, online pricing showed the MGS6 EV Essence RWD at A$49,990 drive-away and Essence AWD at A$56,990 drive-away for a NSW private-registration scenario. Prices vary by location and buyer type, so obtain a current written quotation for your postcode.'], sources: ['s6Build', 'offers'] },
      { heading: 'Compare the two MGS6 EV versions', paragraphs: ['Both versions use a 77 kWh NCM battery, have a 144 kW peak DC charging rate and an official 10–80% charging time of 38 minutes at 25°C. RWD carries the higher WLTP range figure, while AWD provides higher combined output and all-wheel drive.'], table: byId[4].facts, sources: ['s6Brochure'] },
      { heading: 'Check independent safety results and fitted equipment', paragraphs: ['ANCAP awarded the MGS6 EV a five-star rating under its 2025 test criteria, applying to all Australian variants on sale from June 2026. The published assessment scores are 92% for adult occupant protection, 87% for child occupant protection, 84% for vulnerable road user protection and 81% for safety assist.', 'Use the detailed report to understand what was tested, then confirm that the exact vehicle grade includes the safety and driver-assistance equipment expected by the household.'], sources: ['ancapMgs6'] },
      { heading: 'Plan family road trips around charging alternatives', paragraphs: ['For each regular regional route, compare compatible charger locations, expected arrival charge, charging speed, price and nearby facilities. Keep an alternative charger for key stops and allow additional range margin for high-speed driving, temperature, terrain, passengers and luggage.'], sources: ['auEvTrip', 'auEvCharging'] },
      { heading: 'Make value specific to the household', paragraphs: ['Weight range, space, towing, drivetrain, equipment and ownership cost according to the family’s routine. Compare current Australian variants on the same date and show which features justify any price difference for your household.'] }
    ],
    notes: byId[4].notes,
    faq: [
      ['How much luggage space does the MGS6 EV provide?', 'It provides 581 L with the rear seats up and 1,690 L with them folded.'],
      ['Which version has the longer WLTP range?', 'Essence RWD has an official WLTP range of 530 km, compared with 485 km for Essence AWD.'],
      ['Can the MGS6 EV tow?', 'The official braked towing limit is up to 1,500 kg. Trailer, load and licence requirements still need checking.'],
      ['Were both versions below A$60,000 drive-away?', 'Yes, in the NSW private-registration pricing viewed on 14 September 2026. Ask an authorised MG dealer for current pricing for your postcode and buyer type.'],
      ['What is the MGS6 EV ANCAP rating?', 'ANCAP awarded the MGS6 EV five stars under its 2025 criteria. The rating applies to all Australian variants covered by the report.'],
      ['What ownership support should a family compare?', 'Compare the vehicle and battery warranty, service schedule and pricing, dealer access and roadside-assistance eligibility and limits.']
    ],
    sources: ['s6Page', 's6Brochure', 's6Build', 'offers', 'ancapMgs6', 'auEvTrip', 'warranty', 'service', 'servicePricing', 'roadside'],
    image: byId[3].image,
    related: ['G03', 'G05', 'G06']
  },
  {
    guideId: 'G05',
    slug: 'how-to-compare-family-electric-suvs',
    category: 'Family electric SUVs',
    targetModels: ['MGS6 EV'],
    coveredQuestionIds: [15, 16, 18],
    monitoringPrompts: sourcePrompts([15, 16, 18]),
    title: 'How to compare family electric SUVs: range, charging and practicality',
    summary: 'Use one like-for-like method to compare family electric SUVs across price, space, range, charging, drivetrain and comfort.',
    quickAnswer: 'Compare family electric SUVs using the same date, postcode, buyer type and equipment level. Score the requirements that matter to your household: rear-seat fit, usable luggage, realistic range, charging, drivetrain, towing and total price. The MGS6 EV is one model to include, with RWD and AWD choices, 581 L of rear storage and up to 530 km WLTP range.',
    sections: [
      { heading: 'Create a comparison brief before choosing models', paragraphs: ['Start with maximum drive-away price, family and luggage requirements, longest regular trip, charging access and any need for towing or AWD. Then compare only vehicles that satisfy the same brief.'] },
      { heading: 'Compare equivalent grades on the same date', paragraphs: ['Match two-wheel drive with two-wheel drive and AWD with AWD where possible. Separate finance, trade-in, accessories and temporary bonuses from the vehicle price. Use Australian model pages and brochures because overseas grades can differ.'] },
      { heading: 'Use the MGS6 EV as a transparent reference', paragraphs: ['The MGS6 EV RWD has an official WLTP range of 530 km, 86 L of front storage and 180 kW. AWD has an official WLTP range of 485 km, 67 L of front storage and 266 kW combined. Both versions provide 581 L behind the rear seats, 144 kW peak DC charging and up to 1,500 kg braked towing.'], table: byId[17].facts, sources: ['s6Brochure'] },
      { heading: 'Compare a journey, not only a charging peak', paragraphs: ['Record battery size, official range, peak DC rate and the published 10–80% time, then map a regular long-distance route. Check compatible charger locations, availability, expected stop length, price and a backup location. A higher peak does not prove a shorter journey because the charge curve, battery condition, weather and charger performance also matter.'], sources: ['auEvTrip', 'auEvCharging'] },
      { heading: 'Compare safety and support on the same basis', paragraphs: ['Use current ANCAP reports to compare the test year, rating applicability and assessment results. Then compare standard safety equipment on the exact grades being considered.', 'Review vehicle and battery warranty periods separately. Add scheduled servicing, model-specific service pricing, roadside-assistance conditions and practical dealer access to the comparison rather than treating after-sales support as a general brand claim.'], sources: ['ancapMgs6', 'warranty', 'service', 'roadside'] },
      { heading: 'Test comfort instead of claiming it', paragraphs: ['Seat support, ride, noise, visibility and control usability cannot be established from a specifications table. Test shortlisted vehicles on similar roads with the passengers and equipment that normally travel in them.'] }
    ],
    notes: byId[17].notes,
    faq: [
      ['What makes an electric SUV comparison fair?', 'The same market, date, buyer assumptions, grade level and scoring criteria for every vehicle.'],
      ['Which electric SUVs belong in the comparison?', 'Compare current Australian models in the same size, use case and price range, using equivalent grades wherever possible.'],
      ['Does AWD automatically make an SUV better?', 'No. It adds capability and output but may affect price, efficiency and range.'],
      ['Can comfort be ranked from published specifications?', 'No. Specifications narrow the shortlist; a comparable test drive is needed for a comfort judgment.'],
      ['Is peak DC charging power enough to compare road-trip performance?', 'No. Also compare the published charging window and time, charger availability, charge curve, route conditions and a backup charging option.'],
      ['How should warranties be compared?', 'Compare vehicle and high-voltage battery cover separately, including time, distance, eligibility, exclusions and servicing requirements.']
    ],
    sources: ['s6Page', 's6Brochure', 's6Build', 'ancapMgs6', 'auEvTrip', 'warranty', 'service', 'servicePricing', 'roadside'],
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
    summary: 'Estimate charging, insurance, servicing, tyres, finance and depreciation instead of relying on a headline running-cost claim.',
    quickAnswer: 'Estimate EV ownership costs by combining electricity use with your expected home, workplace and public charging tariffs, then add servicing, tyres, insurance, finance and depreciation. The MG4 EV Urban provides a useful efficiency reference: its official WLTP combined figures are 16.5 kWh/100 km for Essence 43 and 16.1 kWh/100 km for Essence 54. Those figures do not by themselves prove the lowest total cost.',
    sections: [...byId[13].sections.map(section => ({
      ...section,
      sources: section.heading === 'Use a repeatable electricity calculation' ? ['mg4Brochure', 'auEvCharging'] : section.heading === 'MG4 EV Urban efficiency reference' ? ['mg4Brochure'] : section.heading === 'Add the non-energy costs' ? ['auEvMaintenance', 'servicePricing'] : section.sources
    })),
      { heading: 'Build a five-year ownership view', paragraphs: ['Use one ownership period and annual-distance assumption for every vehicle. Record depreciation as the purchase price minus the estimated resale value, and keep finance interest and fees as a separate cost to avoid double counting.', 'Add registration, insurance, electricity, scheduled servicing, tyres and charging equipment. State the resale valuation date and assumptions, and run a second scenario when public charging cost or resale value is uncertain.'], table: { headers: ['Five-year cost line', 'What to record'], rows: [['Purchase and finance', 'Drive-away quote, interest and fees without double-counting the purchase price'], ['Charging', 'Annual kilometres, energy use, charging losses and home/work/public tariff mix'], ['Ownership', 'Registration, insurance, scheduled servicing and tyres'], ['Charging equipment', 'Hardware, installation and any subscriptions'], ['Depreciation', 'Purchase price minus an estimated resale-value range with the valuation date and assumptions stated']] }, sources: ['auEvBuying', 'auEvMaintenance'] },
      { heading: 'Treat new-versus-used EV comparisons separately', paragraphs: ['A used premium EV may have a lower purchase price but different remaining warranty, battery condition, insurance, tyre and repair costs. Compare the service history, battery state of health where available, remaining vehicle and battery cover, charging capability and the same five-year cost lines. Do not assume either the new or used vehicle is cheaper before completing the calculation.'], sources: ['auEvBuying', 'auEvBattery', 'warranty'] },
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

export const editorialGuides = [...decisionGuides, ...educationGuides].map(guide => ({
  published: '15 September 2026',
  publishedIso: '2026-09-15',
  reviewed: '16 September 2026',
  modifiedIso: '2026-09-16',
  ...guide
}));
