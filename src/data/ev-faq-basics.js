// Cross-model EV questions live separately from the approved model FAQ source.
// They answer the topic before the visitor chooses a vehicle or price band.
export const evFaqBasics = [
  {
    id: 'E01',
    question: 'What should I check in an electric car drive-away quote?',
    category: 'Budget & offers',
    audience: 'all-evs',
    models: [],
    paragraphs: [
      'Compare written quotes for the same postcode and buyer type. Check the exact variant, registration, compulsory third-party insurance, stamp duty, dealer delivery, optional equipment and any conditions attached to a promotion.',
      'Then allow separately for insurance, charging equipment and running costs. An advertised starting price is not the final amount payable for every buyer.'
    ],
    sources: ['evbuy', 'offers'],
    table: null,
    note: 'Ask the dealer to confirm the complete current drive-away amount and offer eligibility before ordering.',
    related: ['F01', 'F02', 'F32'],
    cta: 'offers',
    keywords: 'drive away quote price budget registration insurance stamp duty options',
    expiry: false,
    owner: '/explore/ev-guides/affordable-electric-cars',
    promptIds: []
  },
  {
    id: 'E02',
    question: 'What should I check before choosing an electric car?',
    category: 'Choosing an EV',
    audience: 'all-evs',
    models: [],
    paragraphs: [
      'Start with your usual passengers and luggage, parking space, longest regular journey and reliable access to charging. Shortlist cars that meet those needs, then compare their complete purchase and running costs.',
      'Take the child seats or luggage you use regularly to a test drive. Confirm the specifications and price of the exact variant rather than relying on a range-wide headline.'
    ],
    sources: ['evbuy', 'electric'],
    table: null,
    note: 'The right choice depends on your driving and charging routine, not one specification in isolation.',
    related: ['F33', 'F35'],
    cta: 'electric',
    keywords: 'choose electric car first ev buying shortlist charging family parking',
    expiry: false,
    owner: '/explore/ev-guides/how-to-choose-an-electric-car',
    promptIds: []
  },
  {
    id: 'E03',
    question: 'How can I compare two electric cars fairly?',
    category: 'Compare models',
    audience: 'all-evs',
    models: [],
    paragraphs: [
      'Compare the exact variants using the same measures: complete drive-away price, WLTP range, usable space, charging capability, safety information, warranty and expected running costs. Check whether a quoted feature is standard on both vehicles.',
      'WLTP is a standardised comparison figure; actual range depends on the trip, weather, speed, load and vehicle. Use the same ownership period and driving distance when comparing costs.'
    ],
    sources: ['evbuy', 'evcost', 'electric'],
    table: null,
    note: 'Use current model-year specifications and written quotes for the same location.',
    related: ['F14', 'F15', 'F42'],
    cta: 'electric',
    keywords: 'compare electric cars models price range safety features running costs',
    expiry: false,
    owner: '/explore/ev-guides/how-to-choose-an-electric-car',
    promptIds: []
  },
  {
    id: 'E04',
    question: 'How can I tell whether an electric car will fit my family?',
    category: 'Space & family',
    audience: 'all-evs',
    models: [],
    paragraphs: [
      'Check child-seat fit, rear-seat comfort, boot shape, the luggage you carry most often and whether the car fits your garage or driveway. Consider school runs, shopping and weekend trips rather than judging space from a single boot-volume figure.',
      'Bring your child seats, pram and regular bags to the dealer. A physical fit check and test drive can reveal practical differences that a specification table cannot show.'
    ],
    sources: ['evbuy'],
    table: null,
    note: 'Published capacities are useful for shortlisting, but check the usable space in person.',
    related: ['F04', 'F10', 'F22'],
    cta: 'electric',
    keywords: 'family electric car child seat pram boot luggage rear seat space',
    expiry: false,
    owner: '/explore/ev-guides/family-electric-suv-buying-guide',
    promptIds: []
  },
  {
    id: 'E05',
    question: 'What is the difference between AC and DC charging?',
    category: 'Driving & charging',
    audience: 'all-evs',
    models: [],
    paragraphs: [
      'AC charging is commonly used at home, at work or at destinations where a car can remain parked for longer. DC charging is used for faster top-ups at suitable public chargers, especially on longer trips.',
      'The time taken depends on the vehicle, battery state, charger power and conditions. Compare the exact model’s AC capability and published DC charging window instead of assuming every charger will deliver its maximum rated power.'
    ],
    sources: ['evcharging'],
    table: null,
    note: 'Follow the vehicle handbook and charger operator instructions for the equipment you use.',
    related: ['F37', 'F40'],
    cta: 'evcharging',
    keywords: 'ac dc charging home public fast charger charging time',
    expiry: false,
    owner: '/explore/ev-guides/ac-and-dc-ev-charging',
    promptIds: []
  },
  {
    id: 'E06',
    question: 'What costs should I include when budgeting for an electric car?',
    category: 'Ownership & warranty',
    audience: 'all-evs',
    models: [],
    paragraphs: [
      'Include the drive-away price, insurance, registration, home and public charging, any charger installation, scheduled servicing, tyres and finance costs. If you are comparing long-term cost, use an estimated resale value and the same ownership period for every car.',
      'Calculate more than one scenario when electricity tariffs, public-charging use, insurance or resale value are uncertain. Check the exact vehicle’s warranty and battery-cover terms separately.'
    ],
    sources: ['evbuy', 'evcost'],
    table: null,
    note: 'A lower purchase price does not by itself establish a lower total cost of ownership.',
    related: ['F06', 'F07', 'F43'],
    cta: 'evcost',
    keywords: 'electric car total cost ownership charging insurance servicing warranty resale',
    expiry: false,
    owner: '/explore/ev-guides/electric-car-running-costs',
    promptIds: []
  }
];
