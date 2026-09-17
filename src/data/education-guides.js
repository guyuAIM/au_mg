const generalNotes = [
  'Charging, range and battery guidance is general. Follow the vehicle owner’s manual and the charger manufacturer’s safety instructions for the exact vehicle and equipment.',
  'Published range and charging figures are comparison references. Weather, speed, terrain, load, battery temperature, charger capability and state of charge can change real-world results.'
];

export const educationGuides = [
  {
    guideId: 'G07',
    slug: 'how-electric-cars-work',
    category: 'EV basics',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026', showLeadImage: false,
    title: 'How do electric cars work?',
    summary: 'Understand the battery, inverter, electric motor and regenerative braking without the technical jargon.',
    quickAnswer: 'A battery-electric car stores electricity in a high-voltage battery. Power electronics control how that energy reaches one or more electric motors, which turn the wheels. When the car slows, regenerative braking can return some energy to the battery. The car is recharged by connecting it to an external electricity supply.',
    sections: [
      { heading: 'The four parts to understand', paragraphs: ['The battery stores electrical energy. An inverter and other power electronics manage the flow of electricity. The motor converts electrical energy into motion. A charge port connects the car to AC or DC charging equipment.'], table: [['Battery', 'Stores energy; capacity is usually shown in kWh'], ['Power electronics', 'Control and convert electricity for the motor and battery'], ['Electric motor', 'Turns electrical energy into movement'], ['Charge port', 'Connects the car to compatible charging equipment']], sources: ['auEvBattery', 'auEvDefinitions'] },
      { heading: 'What happens when you press the accelerator', paragraphs: ['The vehicle asks the battery for power and the motor responds without waiting for engine revs or a conventional gear change. That is why electric cars can feel smooth and immediate at low speed. The exact response depends on the selected drive mode and vehicle calibration.'], sources: ['auEvBattery', 'auEvDefinitions'] },
      { heading: 'What regenerative braking does', paragraphs: ['When the driver lifts off the accelerator or brakes, the motor can act as a generator and recover some of the car’s movement as electrical energy. It cannot recover every unit of energy used, and conventional friction brakes remain essential. The MG4 EV Urban offers one-pedal mode plus multiple regeneration settings; the MGS6 EV also provides selectable regeneration and one-pedal operation.'], sources: ['auEvBattery', 'mg4Brochure', 's6Brochure'] }
    ],
    notes: ['High-voltage components must only be inspected or repaired by appropriately trained technicians.', ...generalNotes],
    faq: [
      ['Does an electric car have an engine?', 'A battery-electric vehicle uses an electric motor instead of a petrol or diesel combustion engine.'],
      ['Does an EV have a normal gearbox?', 'Most battery-electric cars use a much simpler single-speed reduction gear rather than a conventional multi-speed transmission.'],
      ['Does regenerative braking fully recharge the battery?', 'No. It recovers some energy during deceleration, but the vehicle still needs external charging.'],
      ['Do EVs still have conventional brakes?', 'Yes. Regenerative braking works alongside friction brakes, which still require inspection and maintenance.']
    ],
    sources: ['auEvBattery', 'auEvDefinitions', 'mg4Brochure', 's6Brochure'],
    image: { src: '/assets/mg4-urban-side.jpg', alt: 'MG4 EV Urban electric hatchback viewed from the side', href: 'https://mgmotor.com.au/vehicles/mg4-ev-urban' },
    related: ['G08', 'G09', 'G12']
  },
  {
    guideId: 'G08',
    slug: 'ev-hybrid-plug-in-hybrid-differences',
    category: 'EV basics',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026', showLeadImage: false,
    title: 'EV, hybrid or plug-in hybrid: what is the difference?',
    summary: 'Compare how battery electric, hybrid and plug-in hybrid cars are powered, charged and used every day.',
    quickAnswer: 'A battery-electric vehicle runs entirely on electricity and must be plugged in. A conventional hybrid combines fuel with a small battery that is charged by the vehicle rather than a plug. A plug-in hybrid has a larger battery that can be externally charged, then uses fuel when its electric range is exhausted or extra power is required.',
    sections: [
      { heading: 'Three powertrains, three ownership routines', paragraphs: ['The right choice depends on regular trip length, where the car parks, charging access and how often it travels beyond its electric range. Compare the complete routine rather than assuming one technology suits every household.'], table: [['Battery electric vehicle', 'Electric motor only; plugs in; no tailpipe emissions'], ['Hybrid electric vehicle', 'Fuel engine plus electric assistance; does not plug in'], ['Plug-in hybrid vehicle', 'Larger rechargeable battery plus fuel engine; plugs in']], sources: ['auEvTypes', 'auEvDefinitions'] },
      { heading: 'When a battery-electric vehicle makes sense', paragraphs: ['A BEV can suit drivers who can plan regular charging at home, work or reliable public locations and whose longer trips fit available charging routes. MG4 EV Urban and MGS6 EV are battery-electric vehicles, so their driving range and charging needs should be assessed before purchase.'], sources: ['auEvTypes', 'mg4Page', 's6Page'] },
      { heading: 'What to compare before choosing', paragraphs: ['Compare purchase price, expected electric driving, fuel use where relevant, charging availability, servicing, boot and passenger space, towing needs and the warranty that applies to both the vehicle and high-voltage battery.'], sources: ['auEvBuying', 'warranty'] }
    ],
    notes: ['Model availability and powertrain specifications change. Check the current model page before making a shortlist.', ...generalNotes],
    faq: [
      ['Does a hybrid need to be plugged in?', 'A conventional hybrid does not. A plug-in hybrid does need external charging to make full use of its electric range.'],
      ['Can a plug-in hybrid run without petrol?', 'It can complete some trips on battery power, but it retains a fuel engine and will use fuel under some conditions.'],
      ['Do battery-electric cars have tailpipe emissions?', 'Battery-electric vehicles do not produce tailpipe emissions while driving.'],
      ['Which type is cheapest to own?', 'That depends on purchase price, charging and fuel costs, use pattern, insurance, servicing and resale; compare the complete ownership case.']
    ],
    sources: ['auEvTypes', 'auEvDefinitions', 'evRange'],
    image: { src: '/assets/mgs6-side.jpg', alt: 'MGS6 EV battery-electric SUV on the road', href: 'https://mgmotor.com.au/vehicles/mgs6-ev' },
    related: ['G07', 'G03', 'G06']
  },
  {
    guideId: 'G09',
    slug: 'ac-and-dc-ev-charging',
    category: 'Charging',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026',
    title: 'AC and DC electric-car charging explained',
    summary: 'Learn where AC and DC charging are used, why their speeds differ and which limits matter.',
    quickAnswer: 'AC charging sends alternating current to the vehicle, where the onboard charger converts it into direct current for the battery. DC charging performs that conversion in the charging equipment and sends direct current to the battery, so it can usually charge faster. Actual speed is limited by the car, charger, battery conditions and shared site capacity.',
    sections: [
      { heading: 'AC charging suits longer stops', paragraphs: ['Australian Government definitions describe Level 1 charging as roughly 2.3–6.9 kW and Level 2 charging as 7–22 kW. AC charging is commonly used at homes, workplaces and destinations because the vehicle may remain parked for hours. A dedicated home charger must be installed by a licensed electrician.'], sources: ['auEvDefinitions', 'auEvEquipment', 'auEvHomeCharging'] },
      { heading: 'DC charging supports shorter travel stops', paragraphs: ['DC charging bypasses the vehicle’s onboard AC conversion and supplies direct current to the battery. Government definitions place Level 3 DC charging from 24 kW, with 50–99 kW described as fast and 100 kW or more as ultra-fast. The label on a charger is its maximum capability, not a promise that every vehicle will receive that rate.'], sources: ['auEvDefinitions', 'auEvEquipment'] },
      { heading: 'The vehicle still sets a limit', paragraphs: ['MG4 EV Urban has a 6.6 kW onboard AC charger, with 82 kW or 87 kW maximum DC charging depending on version. MGS6 EV has an 11 kW onboard AC charger and 144 kW maximum DC charging. Connector compatibility, battery temperature and state of charge also matter.'], table: [['MG4 EV Urban', 'Type 2 AC; CCS DC; 6.6 kW onboard AC; up to 82/87 kW DC'], ['MGS6 EV', 'Type 2 AC; CCS DC; 11 kW onboard AC; up to 144 kW DC']], sources: ['mg4Brochure', 's6Brochure'] }
    ],
    notes: generalNotes,
    faq: [
      ['Is DC charging always faster than AC charging?', 'It is generally faster, but the achieved rate depends on both the charger and the vehicle.'],
      ['Can a 350 kW charger make every EV charge at 350 kW?', 'No. The vehicle accepts power only up to its own limit, and the rate normally changes during the session.'],
      ['What plug types are common in Australia?', 'Type 2 is common for AC charging and CCS2 is the standard plug for DC fast charging on most new Australian EVs.'],
      ['Should I use DC fast charging every day?', 'Use the charging method that fits the trip and follow the manufacturer’s battery guidance. Routine slower charging can be more convenient and less expensive.']
    ],
    sources: ['auEvDefinitions', 'auEvCharging', 'auEvEquipment', 'mg4Brochure', 's6Brochure'],
    image: { src: '/assets/mg4-urban-tech.jpg', alt: 'MG4 EV Urban technology and charging-related controls', href: 'https://mgmotor.com.au/vehicles/mg4-ev-urban' },
    related: ['G10', 'G11', 'G12']
  },
  {
    guideId: 'G10',
    slug: 'how-long-does-ev-charging-take',
    category: 'Charging',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026', showLeadImage: false,
    title: 'How long does it take to charge an electric car?',
    summary: 'Estimate charging time from battery energy, charger power and the part of the battery you need to refill.',
    quickAnswer: 'Charging time depends on how much energy the battery needs, the power the charger can deliver, the maximum rate the vehicle can accept and conditions such as battery temperature. A simple estimate is energy needed in kWh divided by charging power in kW, with extra time allowed for losses and the reduction in charging speed at higher states of charge.',
    sections: [
      { heading: 'Calculate the energy you need, not a full battery every time', paragraphs: ['If a 54 kWh battery moves from 30% to 80%, the theoretical energy added is about 27 kWh. A 6.6 kW AC supply would need more than four hours before allowing for charging losses. Real sessions vary, so use the calculation as a planning estimate.'], sources: ['auEvCharging', 'auEvEquipment', 'mg4Brochure'] },
      { heading: 'DC charging figures use a defined window', paragraphs: ['Manufacturers commonly quote a 10–80% or 20–80% DC time because charging normally slows as the battery becomes fuller. Official 10–80% charging times are 28 minutes for MG4 EV Urban Essence 43, 30 minutes for Essence 54 and 38 minutes for both MGS6 EV versions. These tests were conducted at 25°C.'], table: [['MG4 EV Urban Essence 43', '43 kWh battery; 10–80% DC in 28 minutes at 25°C'], ['MG4 EV Urban Essence 54', '54 kWh battery; 10–80% DC in 30 minutes at 25°C'], ['MGS6 EV', '77 kWh battery; 10–80% DC in 38 minutes at 25°C']], sources: ['mg4Brochure', 's6Brochure'] },
      { heading: 'Plan around the slower factor', paragraphs: ['A high-power charger cannot override the vehicle’s limit. The achieved rate may also fall when a site shares power, the battery is cold or hot, or the state of charge is already high. For a trip, allow time to reach the charger, connect, authenticate and move the car after charging.'], sources: ['auEvTrip', 'auEvCharging'] }
    ],
    notes: generalNotes,
    faq: [
      ['Why does charging slow above 80%?', 'The battery management system normally reduces power at higher states of charge to manage heat and protect the battery.'],
      ['Does a larger battery always take longer to charge?', 'Not always. Charging time also depends on the vehicle’s charging curve and the power available.'],
      ['Can I calculate charging time from peak power alone?', 'No. Peak power is not maintained throughout the session. Use the manufacturer’s tested charging window where available.'],
      ['Why can two sessions at the same charger differ?', 'Battery temperature, starting charge, site load, charger condition and the vehicle can all change the result.']
    ],
    sources: ['auEvCharging', 'auEvEquipment', 'mg4Brochure', 's6Brochure'],
    image: { src: '/assets/mgs6-hero.jpg', alt: 'MGS6 EV ready for everyday and longer-distance driving', href: 'https://mgmotor.com.au/vehicles/mgs6-ev' },
    related: ['G09', 'G11', 'G12']
  },
  {
    guideId: 'G11',
    slug: 'owning-an-ev-without-home-charging',
    category: 'Charging',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026', showLeadImage: false,
    title: 'Can you own an electric car without home charging?',
    summary: 'Assess whether workplace, destination and public charging can support your weekly driving routine.',
    quickAnswer: 'EV ownership without home charging can work when reliable workplace, destination or public chargers fit naturally into the driver’s routine. It requires more planning and usually costs more than regular home charging. Before buying, map weekly kilometres, compatible chargers, expected dwell time, payment methods, backup sites and the range needed between visits.',
    sections: [
      { heading: 'Build a seven-day charging plan', paragraphs: ['List daily distance, where the car stays for at least an hour and which compatible chargers are nearby. Confirm the connector, power, access hours, price, app or payment method and whether the site is often busy. Keep at least one practical backup location.'], sources: ['auEvCharging', 'auEvTrip'] },
      { heading: 'Choose the battery around access, not anxiety', paragraphs: ['A larger official range can reduce charging frequency, but it also may increase purchase price and does not solve poor charger access. MG4 EV Urban offers 316 km or 405 km WLTP range; MGS6 EV offers 530 km RWD or 485 km AWD. Treat these as comparison figures and apply a buffer for real use.'], sources: ['mg4Brochure', 's6Brochure'] },
      { heading: 'Apartment charging may be possible later', paragraphs: ['Residents in strata buildings may need approval from the owners corporation or body corporate before installing individual or shared charging equipment. Requirements differ by state and territory, so check local rules and obtain advice from a licensed electrician.'], sources: ['auEvHomeCharging'] },
      { heading: 'Public charging habits matter', paragraphs: ['Some AC sites require the driver to bring a cable. Public stations may use apps, cards or contactless payment and may apply idle fees. Charging can slow above 80%, so moving the car when enough energy has been added helps other drivers and can shorten the stop.'], sources: ['auEvCharging', 'auEvEquipment'] }
    ],
    notes: ['Public-network availability, price and reliability can change. Recheck the intended sites before committing to a vehicle.', ...generalNotes],
    faq: [
      ['Is public charging usually more expensive than home charging?', 'The Australian Government advises that it generally costs more, although prices vary by network, charger power and time of day.'],
      ['Do all public AC chargers provide a cable?', 'No. Many slower AC sites are untethered and require the driver to bring a compatible cable.'],
      ['Should an apartment resident buy an EV before charging approval?', 'Confirm the building process and practical alternatives first; approval and electrical work can take time.'],
      ['What is the best backup plan?', 'Keep a second compatible charging site within a comfortable range and know its opening hours and payment method.']
    ],
    sources: ['auEvCharging', 'auEvHomeCharging', 'auEvBuying', 'auEvTrip', 'mg4Brochure', 's6Brochure'],
    image: { src: '/assets/mg4-urban-hero.jpg', alt: 'MG4 EV Urban used for everyday city driving', href: 'https://mgmotor.com.au/vehicles/mg4-ev-urban' },
    related: ['G09', 'G10', 'G02']
  },
  {
    guideId: 'G12',
    slug: 'electric-car-range-explained',
    category: 'Range & batteries',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026',
    title: 'Electric car range explained: WLTP, real-world driving and road trips',
    summary: 'Use WLTP figures correctly and understand how speed, weather, terrain, load and climate control affect a trip.',
    quickAnswer: 'WLTP range is a standardised comparison figure, not a guaranteed distance. Real-world range changes with speed, temperature, hills, payload, tyres, wind, heating or air-conditioning and driving style. Use the official figure to compare vehicles, then plan regular trips with a buffer based on the conditions you expect.',
    sections: [
      { heading: 'What WLTP is useful for', paragraphs: ['A common laboratory procedure gives buyers a consistent way to compare vehicles and versions. It does not reproduce every Australian road, weather pattern or household load, so use it as a comparison figure and allow a practical buffer for regular trips.'], sources: ['greenVehicleInfo', 'auEvTrip'] },
      { heading: 'The factors that change real use', paragraphs: ['Higher sustained speed increases aerodynamic demand. Cold or hot conditions can add battery and cabin-conditioning loads. Hills, headwinds, passengers, luggage, tyre pressure and rapid acceleration can also reduce the distance available. Regenerative braking can recover some energy in suitable driving, but it does not remove these effects.'], bullets: ['Speed and wind', 'Temperature and climate control', 'Terrain and elevation', 'Passengers, luggage and towing', 'Tyres, pressure and driving style'], sources: ['auEvTrip', 'auEvBattery'] },
      { heading: 'Compare MG versions using the same standard', paragraphs: ['Official WLTP ranges are 316 km for MG4 EV Urban Essence 43 and 405 km for Essence 54. MGS6 EV has an official WLTP range of 530 km in Essence RWD form and 485 km in Essence AWD form. The higher number may create more trip flexibility, but charging access, space, drivetrain and price remain part of the decision.'], table: [['MG4 EV Urban Essence 43', '316 km WLTP'], ['MG4 EV Urban Essence 54', '405 km WLTP'], ['MGS6 EV Essence RWD', '530 km WLTP'], ['MGS6 EV Essence AWD', '485 km WLTP']], sources: ['mg4Brochure', 's6Brochure'] },
      { heading: 'Plan longer trips with a buffer', paragraphs: ['Choose compatible charging stops and alternatives before departure. Allow for the conditions, reach the next charger with a comfortable reserve and remember that charging to 80% at a public fast charger can be more time-efficient than waiting for 100%.'], sources: ['auEvTrip', 'auEvCharging'] }
    ],
    notes: generalNotes,
    faq: [
      ['Is WLTP the range I will always get?', 'No. It is a standardised comparison result; actual driving range varies.'],
      ['Why can motorway driving reduce range?', 'Higher speed increases aerodynamic resistance and energy use.'],
      ['Does air-conditioning affect range?', 'Yes. Heating and cooling use energy, with the effect depending on conditions and the vehicle.'],
      ['Which MG model has the highest listed WLTP figure here?', 'Within these two model ranges, MGS6 EV Essence RWD has the highest official WLTP figure at 530 km.']
    ],
    sources: ['greenVehicleInfo', 'auEvTrip', 'mg4Page', 'mg4Brochure', 's6Page', 's6Brochure'],
    image: { src: '/assets/mgs6-hero.jpg', alt: 'MGS6 EV driving on an open road', href: 'https://mgmotor.com.au/vehicles/mgs6-ev' },
    related: ['G10', 'G13', 'G03']
  },
  {
    guideId: 'G13',
    slug: 'electric-car-battery-life-and-warranty',
    category: 'Range & batteries',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026', showLeadImage: false,
    title: 'Electric-car battery life and warranty: what owners should know',
    summary: 'Understand gradual battery degradation, battery health, charging habits and the difference between lifespan and warranty.',
    quickAnswer: 'EV batteries are designed for many years of use, but capacity normally reduces gradually over time. Battery life is not the same as battery warranty. Australian Government consumer guidance says many modern EV batteries can last 13 years or more. The current MG high-voltage battery warranty for the models covered here is 7 years or 150,000 km, whichever comes first, subject to the full terms.',
    sections: [
      { heading: 'Capacity loss is normally gradual', paragraphs: ['Battery state of health compares current usable capacity with the battery when new. Age, temperature, charging pattern, energy throughput and use can influence degradation. A health report can be useful when assessing a used EV.'], sources: ['auEvBattery', 'auEvBuying'] },
      { heading: 'Use the manufacturer’s charging guidance', paragraphs: ['General guidance cannot replace the owner’s manual because battery chemistries and battery-management systems differ. Some vehicles recommend a regular 20–80% window, while others may call for periodic charging to 100%. Use fast charging when it serves the trip and follow the model-specific instructions.'], sources: ['auEvBattery', 'mg4Brochure', 's6Brochure'] },
      { heading: 'Read the warranty as a separate document', paragraphs: ['Standard vehicle cover, service-activated cover and high-voltage battery cover have separate terms. The current high-voltage battery warranty is 7 years or 150,000 km, whichever occurs first. Terms and exclusions apply, so read the full warranty policy for eligibility, servicing requirements and limited-warranty items.'], table: [['Standard vehicle warranty', '7 years, unlimited kilometres; terms and exclusions apply'], ['Service-activated cover', 'Up to 10 years or 250,000 km for eligible personal-use passenger vehicles serviced within the program'], ['High-voltage battery warranty', '7 years or 150,000 km, whichever comes first; terms and exclusions apply']], sources: ['warranty'] },
      { heading: 'Battery chemistry is one part of the picture', paragraphs: ['MG4 EV Urban uses LFP battery chemistry in both versions. MGS6 EV uses NCM chemistry. Chemistry affects engineering choices, but buyers should compare the full vehicle, thermal management, warranty, range and charging guidance rather than ranking a car by chemistry alone.'], sources: ['mg4Brochure', 's6Brochure'] }
    ],
    notes: ['Warranty eligibility depends on vehicle use, registration date, servicing and the full policy terms. Check the current MG Australia warranty before making a purchase decision.', ...generalNotes],
    faq: [
      ['Is battery lifespan the same as battery warranty?', 'No. Lifespan describes how long a battery may remain useful; warranty is a legal promise with a defined period, distance, conditions and exclusions.'],
      ['Does an EV battery suddenly stop working after the warranty?', 'No. Warranty expiry is not a predicted failure date; capacity usually changes gradually.'],
      ['How can a used-EV buyer check the battery?', 'Ask for service history and a battery state-of-health report from an appropriate provider.'],
      ['Do MG4 EV Urban and MGS6 EV use the same chemistry?', 'No. MG4 EV Urban uses LFP, while MGS6 EV uses NCM.']
    ],
    sources: ['auEvBattery', 'auEvMaintenance', 'auEvBuying', 'warranty', 'mg4Brochure', 's6Brochure'],
    image: { src: '/assets/mg4-urban-side.jpg', alt: 'MG4 EV Urban with an LFP battery beneath the passenger compartment', href: 'https://mgmotor.com.au/vehicles/mg4-ev-urban' },
    related: ['G12', 'G14', 'G06']
  },
  {
    guideId: 'G14',
    slug: 'electric-car-maintenance',
    category: 'Ownership costs',
    targetModels: ['MG4 EV Urban', 'MGS6 EV'],
    coveredQuestionIds: [], monitoringPrompts: [], reviewed: '16 September 2026',
    title: 'Electric car maintenance and servicing: what owners should expect',
    summary: 'See which familiar service items remain and which petrol-engine components a battery EV no longer uses.',
    quickAnswer: 'Battery-electric cars still need scheduled inspection and maintenance. Tyres, friction brakes, brake fluid, suspension, cooling systems, air filters, wipers, cameras and software all need attention. They have fewer moving powertrain parts and no engine oil, spark plugs or exhaust system, but the exact service schedule comes from the owner’s manual and manufacturer.',
    sections: [
      { heading: 'The regular checks that remain', paragraphs: ['EVs still carry passengers at road speed, so their tyres, brakes, steering and suspension remain safety-critical. Battery cooling, charging cables, high-voltage warnings, cabin filters, wipers, lights, cameras and software also need inspection or updates at the appropriate interval.'], bullets: ['Tyres, pressure, rotation and wear', 'Friction brakes and brake fluid', 'Suspension and steering', 'Battery and power-electronics cooling', 'Cabin filters, wipers, lights and cameras', 'Charging equipment and cables'], sources: ['auEvMaintenance', 'service'] },
      { heading: 'Why brake wear can differ', paragraphs: ['Regenerative braking can reduce use of the friction brakes, but it does not replace them. Brake components still need regular inspection and can require cleaning, lubrication or replacement. Driving conditions and regeneration settings affect wear.'], sources: ['auEvMaintenance'] },
      { heading: 'Do not assume every EV has the same schedule', paragraphs: ['Service intervals, inspection items, fluids and software procedures vary by model. Follow the MG owner’s manual and service schedule for the exact vehicle, and use qualified technicians for high-voltage systems.'], sources: ['service', 'warranty'] },
      { heading: 'Put maintenance into the ownership budget', paragraphs: ['Add scheduled servicing, tyres, insurance, charging and finance rather than treating “less maintenance” as “no maintenance”. Check current MG service pricing and warranty terms for the exact model, vehicle use and service schedule.'], sources: ['servicePricing', 'warranty'] }
    ],
    notes: ['Never attempt work on orange high-voltage cabling or battery components. Use appropriately trained technicians.', 'Service prices and warranty programs can change; verify the current MG Australia information.'],
    faq: [
      ['Do electric cars need engine oil changes?', 'A battery-electric vehicle has no combustion engine, so it does not need engine-oil changes.'],
      ['Do EV brakes still need servicing?', 'Yes. Regenerative braking may reduce pad wear, but the complete braking system still requires inspection and maintenance.'],
      ['Can any workshop repair the high-voltage system?', 'High-voltage diagnosis and repair require appropriate training, procedures and equipment.'],
      ['Are EVs maintenance-free?', 'No. They have fewer powertrain maintenance items, but scheduled servicing and safety checks remain necessary.']
    ],
    sources: ['auEvMaintenance', 'auEvBattery', 'service', 'servicePricing', 'warranty'],
    image: { src: '/assets/mgs6-interior.jpg', alt: 'MGS6 EV interior and driver information systems', href: 'https://mgmotor.com.au/vehicles/mgs6-ev' },
    related: ['G06', 'G13', 'G07']
  }
];
