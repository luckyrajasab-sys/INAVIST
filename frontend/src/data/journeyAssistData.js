// Journey Assist Data — Pre-Boarding & Post-Deboarding Complete Travel Lifecycle
// Covers: Home → Transport Hub (cab, auto, metro, bus) + Transport Hub → Stay/Tourist Places

// ========================================================
// PRE-BOARDING: How to get from HOME → TRANSPORT HUB
// ========================================================
export const PRE_BOARDING_OPTIONS = [
  // ---- CAB FROM HOME ----
  {
    id: "pre-cab-ola",
    type: "cab",
    name: "Ola Cab (Sedan/SUV)",
    icon: "🚕",
    description: "App-based doorstep pickup to station/airport",
    priceRange: { min: 150, max: 800 },
    pricingNote: "Base ₹50 + ₹12/km. Surge pricing during rush hours (8-10 AM, 5-8 PM)",
    bookingMethod: "Ola App / Phone",
    availability: "24/7 in metros, 6 AM–11 PM in smaller cities",
    advanceBooking: "Schedule up to 7 days in advance",
    luggagePolicy: "1 large + 1 cabin bag (Sedan), 3 bags (SUV)",
    estimatedWait: "3-8 minutes in metros, 10-20 min in tier-2 cities",
    paymentModes: ["UPI", "Cash", "Ola Money", "Credit/Debit Card"],
    tips: [
      "Book 30 min before departure for airport rides",
      "Use 'Schedule Ride' for early morning flights (4-6 AM)",
      "Share ride OTP only with verified driver",
      "Check surge pricing — auto-rickshaw may be cheaper during peak"
    ]
  },
  {
    id: "pre-cab-uber",
    type: "cab",
    name: "Uber (Go/Premier/XL)",
    icon: "🚗",
    description: "Reliable app-based ride to any transport hub",
    priceRange: { min: 140, max: 900 },
    pricingNote: "Go (₹7/km), Premier (₹12/km), XL (₹14/km). Upfront pricing shown before booking",
    bookingMethod: "Uber App",
    availability: "24/7 in 100+ Indian cities",
    advanceBooking: "Reserve up to 30 days ahead",
    luggagePolicy: "2 bags standard, XL fits 4+ bags",
    estimatedWait: "4-10 minutes",
    paymentModes: ["UPI", "Cash", "Uber Cash", "Card", "Paytm"],
    tips: [
      "Uber Reserve guarantees driver 15 min before pickup",
      "Share trip with family for safety tracking",
      "Use Uber Intercity for outstation at flat rates",
      "Check if airport has Uber pickup zone to avoid fines"
    ]
  },
  {
    id: "pre-cab-local",
    type: "cab",
    name: "Local Prepaid Taxi / Call Taxi",
    icon: "🚖",
    description: "City-specific government/private call taxis (FastTrack, Meru, etc.)",
    priceRange: { min: 100, max: 600 },
    pricingNote: "Meter-based or fixed prepaid from station counters. No surge pricing.",
    bookingMethod: "Phone call / Station prepaid counter",
    availability: "Major stations and airports 24/7",
    advanceBooking: "Phone booking 1-2 hours ahead",
    luggagePolicy: "Flexible, negotiate for extra luggage",
    estimatedWait: "5-15 minutes at prepaid stand",
    paymentModes: ["Cash", "UPI at some counters"],
    tips: [
      "Always use prepaid taxi counter at airports/stations for fixed fares",
      "Keep small change — drivers may not have change",
      "Note taxi number before boarding for safety",
      "Ask for receipt at prepaid counter"
    ]
  },

  // ---- AUTO-RICKSHAW ----
  {
    id: "pre-auto",
    type: "auto",
    name: "Auto-Rickshaw (Metered/Fixed)",
    icon: "🛺",
    description: "Most affordable door-to-station transport in Indian cities",
    priceRange: { min: 30, max: 250 },
    pricingNote: "Meter: ₹25 base + ₹13/km. Many cities have fixed-fare auto stands near stations.",
    bookingMethod: "Hail on street / Ola-Uber Auto / Rapido",
    availability: "5 AM – 11 PM (reduced late night)",
    advanceBooking: "Not typically available, hail or app-book",
    luggagePolicy: "1 medium bag + 1 backpack. No large suitcases.",
    estimatedWait: "1-5 minutes in city areas",
    paymentModes: ["Cash", "UPI", "Ola/Uber Auto"],
    tips: [
      "Insist on meter in cities where it's mandatory (Mumbai, Bengaluru)",
      "In Chennai/Hyderabad — agree fare BEFORE boarding",
      "Ola/Uber Auto gives upfront fare with no negotiation needed",
      "Not ideal for airport runs with heavy luggage — use cab instead"
    ]
  },

  // ---- CITY BUS ----
  {
    id: "pre-bus-city",
    type: "city_bus",
    name: "City Government Bus (MTC/BMTC/BEST/DTC)",
    icon: "🚌",
    description: "Ultra-budget public transit to railway stations and bus stands",
    priceRange: { min: 5, max: 50 },
    pricingNote: "Flat or distance-based. AC buses ₹20-50, Non-AC ₹5-25.",
    bookingMethod: "Board at bus stop, pay conductor. Apps: Chalo, Google Maps for routes.",
    availability: "4:30 AM – 11:30 PM (varies by city)",
    advanceBooking: "Not required — frequent service",
    luggagePolicy: "Small bags only. No large suitcases on crowded buses.",
    estimatedWait: "5-20 minutes depending on route frequency",
    paymentModes: ["Cash", "Bus Pass", "Smart Card", "UPI (some cities)"],
    citySpecific: {
      "Chennai": { operator: "MTC", appName: "Chalo", busToStation: "Route 15B/27C to Central, Route 70 to Egmore" },
      "Mumbai": { operator: "BEST", appName: "BEST Buses / Chalo", busToStation: "Route 1/3 to CSMT, Route 83 to Dadar" },
      "Delhi": { operator: "DTC / Cluster", appName: "One Delhi", busToStation: "Route 764 to NDLS, Airport Express Feeder" },
      "Bengaluru": { operator: "BMTC", appName: "Tummoc / BMTC Official", busToStation: "Vayu Vajra KIA-Series to Airport, BMTC-356 to Majestic" },
      "Kolkata": { operator: "CSTC / WBTC", appName: "Chalo", busToStation: "Route S12 to Howrah, Route AC9 to Sealdah" },
      "Hyderabad": { operator: "TSRTC City", appName: "T-Savaari", busToStation: "Route 5K to Secunderabad, Route 49M to MGBS" }
    },
    tips: [
      "Download 'Chalo' app for real-time bus tracking in most Indian cities",
      "AC Volvo city buses are comfortable but less frequent",
      "Avoid peak hours (8-10 AM, 5-7 PM) with heavy luggage",
      "Google Maps shows live bus routes and timings in major cities"
    ]
  },

  // ---- METRO / SUBURBAN TRAIN ----
  {
    id: "pre-metro",
    type: "metro",
    name: "Metro Rail / Suburban Train",
    icon: "🚇",
    description: "Fastest, traffic-free route to major transport hubs",
    priceRange: { min: 10, max: 80 },
    pricingNote: "Token: ₹10-60 based on distance. Smart Card: 10% discount.",
    bookingMethod: "Token at station counter / Smart Card / UPI QR at gates",
    availability: "5:00 AM – 11:30 PM (most cities)",
    advanceBooking: "Not needed — frequency every 3-8 minutes",
    luggagePolicy: "Max 25kg per person. Large bags allowed in designated space.",
    estimatedWait: "3-8 minutes between trains",
    paymentModes: ["Cash (Token)", "Smart Card", "UPI/QR", "NCMC Card"],
    citySpecific: {
      "Delhi": { lines: "Yellow/Blue/Magenta/Violet/Green/Pink/Grey/Rapid", stationConnect: "New Delhi Metro → NDLS Railway (direct walkway), Airport Express → T3 IGI" },
      "Chennai": { lines: "Blue Line (Wimco Nagar–Airport), Green Line (Central–St.Thomas Mount)", stationConnect: "Chennai Central Metro ↔ Chennai Central Railway (underground passage)" },
      "Mumbai": { lines: "Line 1/2A/7 Metro + Western/Central/Harbour Suburban", stationConnect: "Andheri Metro ↔ Andheri Station (2 min walk), CSMT Suburban ↔ CSMT terminus" },
      "Bengaluru": { lines: "Purple Line + Green Line", stationConnect: "Majestic Metro ↔ KSR Bengaluru City Station (300m walk)" },
      "Kolkata": { lines: "Blue Line (Dakshineswar–Kavi Subhash) + Green/Purple/Orange", stationConnect: "Esplanade Metro → Howrah (ferry), Dum Dum Metro ↔ Airport (bus link)" },
      "Hyderabad": { lines: "Red/Blue/Green Lines", stationConnect: "Ameerpet Interchange Hub, MGBS Metro → Imliban Bus Terminal" }
    },
    tips: [
      "Delhi Airport Express Metro is the cheapest way (₹60) to reach T3 from New Delhi Station in 20 min",
      "Chennai Metro Blue Line goes directly underground to the airport terminal",
      "Mumbai Local Trains are the lifeline — avoid 8-10 AM and 6-8 PM peak crush",
      "Buy a National Common Mobility Card (NCMC) — works across all metros in India",
      "Keep luggage compact; escalators get crowded during rush hour"
    ]
  },

  // ---- TWO-WHEELER / BIKE TAXI ----
  {
    id: "pre-bike-taxi",
    type: "bike_taxi",
    name: "Bike Taxi (Rapido / Ola Bike)",
    icon: "🏍️",
    description: "Fastest solo commute to station — beats traffic jams",
    priceRange: { min: 25, max: 150 },
    pricingNote: "₹5/km base. Cheapest option for solo travelers without luggage.",
    bookingMethod: "Rapido App / Ola Bike",
    availability: "6 AM – 10 PM in supported cities",
    advanceBooking: "Not available — instant booking only",
    luggagePolicy: "Backpack only. No suitcases.",
    estimatedWait: "2-5 minutes",
    paymentModes: ["UPI", "Cash", "Wallet"],
    tips: [
      "Only for solo travelers with a small backpack",
      "Helmet provided by driver — mandatory to wear",
      "Great for last-mile to metro station, then metro to main hub",
      "Not available in all cities — check app coverage"
    ]
  },

  // ---- E-RICKSHAW ----
  {
    id: "pre-e-rickshaw",
    type: "e_rickshaw",
    name: "E-Rickshaw (Battery Auto)",
    icon: "🔋",
    description: "Shared/private electric rickshaw for short distances to local stops",
    priceRange: { min: 10, max: 50 },
    pricingNote: "₹10 shared per head, ₹30-50 private for 1-3 km",
    bookingMethod: "Hail on street near bus stops and metro stations",
    availability: "6 AM – 9 PM in North Indian cities",
    advanceBooking: "Not available",
    luggagePolicy: "Small bag only",
    estimatedWait: "1-3 minutes (very common in Delhi NCR, UP, Bihar)",
    paymentModes: ["Cash", "UPI"],
    tips: [
      "Very common around Delhi Metro stations as last-mile feeder",
      "Shared rides are ultra-cheap at ₹10 per person",
      "Confirm fare before boarding — no meter system",
      "Great for distances under 3 km"
    ]
  }
];

// ========================================================
// POST-DEBOARDING: Transport Hub → Hotel / Tourist Places
// ========================================================
export const POST_DEBOARDING_OPTIONS = [
  {
    id: "post-prepaid-taxi",
    type: "prepaid_taxi",
    name: "Station/Airport Prepaid Taxi",
    icon: "🚕",
    description: "Government-regulated fixed-fare taxi from arrival point",
    priceRange: { min: 200, max: 1500 },
    pricingNote: "Fixed fare based on destination zone. Displayed at counter.",
    availability: "24/7 at major stations and airports",
    howToFind: "Look for 'PREPAID TAXI' counter immediately after exit gate",
    tips: [
      "ALWAYS use prepaid counter — avoid touts outside station",
      "Keep the receipt — it has the fare and taxi number",
      "Give receipt to driver ONLY after reaching destination",
      "If driver demands extra — call helpline on receipt"
    ]
  },
  {
    id: "post-local-auto",
    type: "auto",
    name: "Local Auto-Rickshaw / Tuk-Tuk",
    icon: "🛺",
    description: "Metered or fixed-fare auto to your hotel or tourist spot",
    priceRange: { min: 30, max: 300 },
    pricingNote: "Meter: ₹25 base. Hill stations often have fixed rates (e.g., Ooty auto stand ₹60-150).",
    availability: "5 AM – 10 PM most places",
    howToFind: "Auto stand outside every railway station and bus terminus",
    tips: [
      "In hill stations (Ooty, Kodaikanal, Shimla) — pre-fixed rates from auto union",
      "Use Google Maps to verify route and distance",
      "In Goa — autos are scarce; rent a scooter instead",
      "In Rajasthan — negotiate before boarding, autos rarely use meters"
    ]
  },
  {
    id: "post-local-bus",
    type: "local_bus",
    name: "Local Town Bus / Minibus",
    icon: "🚌",
    description: "Government local bus to tourist spots and hotel areas",
    priceRange: { min: 5, max: 40 },
    pricingNote: "Ultra-budget. ₹5-15 for most town routes.",
    availability: "6 AM – 8 PM in most tourist towns",
    howToFind: "Ask at bus stand information counter for tourist spot routes",
    tips: [
      "In Ooty — bus to Botanical Garden, Rose Garden, Lake (Route 1/2)",
      "In Kodaikanal — town bus covers Lake, Pillar Rocks, Coaker's Walk",
      "In Manali — local buses go to Solang, Rohtang base, Old Manali",
      "Ask locals for 'tourist circuit' buses — many hill stations have them"
    ]
  },
  {
    id: "post-shared-jeep",
    type: "shared_jeep",
    name: "Shared Jeep / Sumo / Traveller",
    icon: "🚙",
    description: "Common in hill stations and Northeast — shared vehicle to remote spots",
    priceRange: { min: 50, max: 500 },
    pricingNote: "Per seat pricing. Full vehicle hire 5-10x single seat rate.",
    availability: "6 AM – 4 PM (leave early — last departures by 2-3 PM in mountains)",
    howToFind: "Designated jeep stand near main town square or bus stand",
    tips: [
      "In Ladakh — shared Sumo to Pangong/Nubra available from Leh main market",
      "In Sikkim — shared jeeps are THE primary transport (no trains/buses)",
      "In Meghalaya — shared Sumo Shillong to Cherrapunji/Dawki",
      "Book front seat if prone to motion sickness — it costs ₹50-100 extra",
      "Leave early morning (6-7 AM) — last shared jeeps leave by 2 PM"
    ]
  },
  {
    id: "post-hotel-shuttle",
    type: "hotel_shuttle",
    name: "Hotel Pickup / Resort Shuttle",
    icon: "🏨",
    description: "Complimentary or paid pickup arranged by your hotel/resort",
    priceRange: { min: 0, max: 500 },
    pricingNote: "Many premium hotels offer free airport/station pickup. Budget stays: ₹200-500.",
    availability: "Arrange 24h before arrival",
    howToFind: "Contact your hotel directly — share train/flight PNR",
    tips: [
      "Always ask hotel at booking time if pickup is complimentary",
      "Share your PNR/flight number for live tracking arrival",
      "Resorts in remote areas (Coorg, Wayanad) — MUST arrange pickup as autos are rare",
      "Many homestays in Kerala/Himachal offer free pickup from nearest town"
    ]
  },
  {
    id: "post-rental-scooter",
    type: "rental",
    name: "Rent Scooter / Bike at Destination",
    icon: "🛵",
    description: "Self-drive two-wheeler for full-day tourist spot hopping",
    priceRange: { min: 300, max: 1200 },
    pricingNote: "Scooter (Activa) ₹300-500/day, Bike (RE) ₹800-1800/day. Petrol extra.",
    availability: "Rental shops near every major tourist bus stand",
    howToFind: "Google 'bike rental [city name]' or ask at hotel reception",
    tips: [
      "Carry original DL — photocopy not accepted at checkpoints",
      "In Goa — scooter is the BEST way to explore (₹300/day)",
      "In Ladakh — Royal Enfield rental is iconic but check bike condition",
      "In Pondicherry — cycle rental (₹100/day) covers French Quarter easily",
      "Take photos of bike before renting to avoid scratch disputes"
    ]
  }
];

// ========================================================
// TOURIST PLACE TIMINGS, AVAILABILITY & PREPARATION
// ========================================================
export const TOURIST_PLACE_INFO = [
  // LADAKH
  {
    id: "tp-pangong",
    name: "Pangong Tso Lake",
    state: "Ladakh",
    district: "Leh",
    openingTime: "06:00 AM",
    closingTime: "06:30 PM",
    bestVisitTime: "6:30 AM – 9:00 AM (sunrise colors) & 4:00 PM – 6:00 PM (sunset)",
    ticketPrice: "₹200 (Environmental Fee)",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Open daily (May–September season)",
    seasonalAvailability: "May to September only. Road closed Oct–April due to snow.",
    currentCrowdLevel: "Moderate",
    avgVisitDuration: "3-4 hours",
    dressCode: "Warm layers mandatory — temp drops to 0°C even in summer",
    preparation: [
      "Get Inner Line Permit (ILP) from DC office Leh or online",
      "Acclimatize in Leh for 48 hours before visiting",
      "Carry Diamox tablets for altitude sickness prevention",
      "No fuel stations after Karu — fill tank in Leh",
      "Carry dry snacks and water — no restaurants at lake",
      "Oxygen cylinder recommended for elderly travelers"
    ],
    localTransport: [
      { mode: "Shared Sumo from Leh", price: "₹600-800/seat", duration: "5h" },
      { mode: "Private SUV (Innova/Xylo)", price: "₹5,000-7,000 round trip", duration: "5h" },
      { mode: "Bike (Self-drive RE)", price: "₹1,500/day + fuel", duration: "5-6h" }
    ],
    nearbyStays: [
      { name: "Pangong Camps (Spangmik)", type: "Luxury Camp", price: "₹3,000-6,000/night", distance: "At lake" },
      { name: "Homestay Tangtse Village", type: "Homestay", price: "₹800-1,500/night", distance: "30 km before lake" }
    ]
  },
  // TAMIL NADU — KODAIKANAL
  {
    id: "tp-kodai-lake",
    name: "Kodaikanal Lake (Kodai Lake)",
    state: "Tamil Nadu",
    district: "Dindigul",
    openingTime: "06:00 AM",
    closingTime: "06:00 PM",
    bestVisitTime: "6:30 AM – 9:00 AM (misty morning) & 4:00 PM – 5:30 PM",
    ticketPrice: "Free (Boating: ₹80-300)",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Open daily",
    seasonalAvailability: "Year-round. Best April–June & September–November.",
    currentCrowdLevel: "High (weekends/holidays)",
    avgVisitDuration: "2-3 hours",
    dressCode: "Light woolens/jacket — 10-20°C year round",
    preparation: [
      "Book boats early morning to avoid 2-3 hour queue on weekends",
      "Carry a light raincoat — sudden showers common",
      "Walking the 5 km lake circuit is more scenic than boating",
      "Horse riding available on lake road (₹200-400)",
      "Carry cash — many lake vendors don't accept UPI"
    ],
    localTransport: [
      { mode: "Auto from Kodai Bus Stand", price: "₹60-100", duration: "10 min" },
      { mode: "Walking from town center", price: "Free", duration: "15 min" },
      { mode: "Bicycle rental (town)", price: "₹100-200/day", duration: "Self-paced" }
    ],
    nearbyStays: [
      { name: "Hotels on Lake Road", type: "Mid-range", price: "₹1,500-4,000/night", distance: "100m" },
      { name: "Budget lodges (Anna Salai)", type: "Budget", price: "₹600-1,200/night", distance: "500m" },
      { name: "Carlton Hotel", type: "Premium", price: "₹6,000-12,000/night", distance: "1 km" }
    ]
  },
  {
    id: "tp-kodai-pillar-rocks",
    name: "Pillar Rocks & Guna Caves",
    state: "Tamil Nadu",
    district: "Dindigul",
    openingTime: "09:00 AM",
    closingTime: "05:30 PM",
    bestVisitTime: "9:00 AM – 10:30 AM (before fog rolls in)",
    ticketPrice: "₹10",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Open daily",
    seasonalAvailability: "Year-round. Clearest views Oct–Feb.",
    currentCrowdLevel: "Moderate",
    avgVisitDuration: "1-1.5 hours",
    dressCode: "Comfortable walking shoes — rocky terrain",
    preparation: [
      "Guna Caves closed for safety — only viewpoint open",
      "Carry binoculars for valley views on clear days",
      "Arrive by 9:00 AM before afternoon mist obscures pillars",
      "Combine with nearby Kurinji Andavar Temple visit"
    ],
    localTransport: [
      { mode: "Auto from Kodai town", price: "₹150-200", duration: "15 min" },
      { mode: "Rented cycle", price: "₹100/day", duration: "25 min (uphill)" }
    ],
    nearbyStays: []
  },
  // RAJASTHAN — JAIPUR
  {
    id: "tp-hawa-mahal",
    name: "Hawa Mahal (Palace of Winds)",
    state: "Rajasthan",
    district: "Jaipur",
    openingTime: "09:00 AM",
    closingTime: "05:00 PM",
    bestVisitTime: "9:00 AM – 11:00 AM (morning sun illuminates façade)",
    ticketPrice: "₹50 (Indians), ₹200 (Foreigners). Composite ticket ₹300 for all Jaipur monuments.",
    onlineBooking: true,
    isClosed: false,
    closedOn: "Open daily including holidays",
    seasonalAvailability: "Year-round. Best October–March (pleasant weather).",
    currentCrowdLevel: "High",
    avgVisitDuration: "1-1.5 hours",
    dressCode: "Comfortable shoes for narrow staircases. No dress code.",
    preparation: [
      "Buy composite ticket (₹300) — covers Hawa Mahal, Amber Fort, Nahargarh, Jantar Mantar, Albert Hall",
      "Best exterior photo is from the OPPOSITE side cafe (Wind View Cafe rooftop)",
      "No elevator — narrow ramp staircases to top (5 floors)",
      "Combine with Jantar Mantar (200m walk) and City Palace (300m)"
    ],
    localTransport: [
      { mode: "Metro to Badi Chaupar Station", price: "₹20-30", duration: "Direct stop" },
      { mode: "Auto from Jaipur Junction", price: "₹80-120", duration: "15 min" },
      { mode: "Ola/Uber", price: "₹100-180", duration: "12 min" }
    ],
    nearbyStays: [
      { name: "Hotels on MI Road", type: "Mid-range", price: "₹1,200-3,000/night", distance: "1 km" },
      { name: "Hostels near Badi Chaupar", type: "Budget", price: "₹400-800/night", distance: "300m" },
      { name: "Raj Palace", type: "Heritage Premium", price: "₹8,000-25,000/night", distance: "2 km" }
    ]
  },
  {
    id: "tp-amer-fort",
    name: "Amer (Amber) Fort",
    state: "Rajasthan",
    district: "Jaipur",
    openingTime: "08:00 AM",
    closingTime: "05:30 PM",
    bestVisitTime: "8:00 AM – 10:00 AM (cool, less crowded) & Evening Light Show 6:30 PM",
    ticketPrice: "₹100 (Indians), ₹500 (Foreigners). Light Show ₹300.",
    onlineBooking: true,
    isClosed: false,
    closedOn: "Open daily",
    seasonalAvailability: "Year-round. Avoid May-June (extreme heat 45°C+).",
    currentCrowdLevel: "Very High",
    avgVisitDuration: "2-3 hours",
    dressCode: "Comfortable walking shoes. Lots of steps and ramps.",
    preparation: [
      "DO NOT take elephant rides — animal welfare concerns",
      "Jeep ride to top available (₹200/person) if unable to walk",
      "Sheesh Mahal (Mirror Palace) is the highlight — use phone flashlight to see reflections",
      "Arrive by 8:00 AM to avoid tour bus crowds (10 AM – 2 PM peak)",
      "Evening Light & Sound Show (English 7:30 PM) is spectacular"
    ],
    localTransport: [
      { mode: "City bus from Badi Chaupar", price: "₹15", duration: "25 min" },
      { mode: "Auto from Jaipur city", price: "₹200-300", duration: "20 min" },
      { mode: "Ola/Uber", price: "₹180-250", duration: "18 min" }
    ],
    nearbyStays: []
  },
  // KERALA — MUNNAR
  {
    id: "tp-munnar-tea",
    name: "Munnar Tea Museum & Tea Gardens",
    state: "Kerala",
    district: "Idukki",
    openingTime: "09:00 AM",
    closingTime: "04:30 PM",
    bestVisitTime: "9:00 AM – 11:00 AM (tea plucking in action)",
    ticketPrice: "₹125 (Museum entry with tea tasting)",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Mondays",
    seasonalAvailability: "Year-round. Best Sept–March. Avoid heavy monsoon (June-Aug).",
    currentCrowdLevel: "Moderate",
    avgVisitDuration: "1.5-2 hours",
    dressCode: "Comfortable shoes for garden walks. Light jacket.",
    preparation: [
      "Buy fresh tea directly from museum shop — best quality & price",
      "Photography allowed in gardens but NOT inside processing unit",
      "Walk through the surrounding Kannan Devan tea estate for free",
      "Combine with Mattupetty Dam visit (13 km away)"
    ],
    localTransport: [
      { mode: "Auto from Munnar town", price: "₹50-80", duration: "5 min" },
      { mode: "Walking from town center", price: "Free", duration: "20 min" },
      { mode: "Rented scooter", price: "₹400/day", duration: "Self-paced" }
    ],
    nearbyStays: [
      { name: "Hotels on Munnar Main Road", type: "Mid-range", price: "₹1,500-3,500/night", distance: "1 km" },
      { name: "Homestays (Pothamedu)", type: "Budget", price: "₹800-1,500/night", distance: "3 km" },
      { name: "Tea County Resort", type: "Premium", price: "₹5,000-10,000/night", distance: "2 km" }
    ]
  },
  // HIMACHAL PRADESH — SHIMLA
  {
    id: "tp-shimla-ridge",
    name: "The Ridge & Mall Road",
    state: "Himachal Pradesh",
    district: "Shimla",
    openingTime: "Open 24 Hours",
    closingTime: "Open 24 Hours",
    bestVisitTime: "6:00 AM – 8:00 AM (sunrise) & 5:00 PM – 8:00 PM (sunset & lights)",
    ticketPrice: "Free",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Never",
    seasonalAvailability: "Year-round. Snow Dec–Feb. Best March–June & Sept–Nov.",
    currentCrowdLevel: "High (weekends/holidays)",
    avgVisitDuration: "2-3 hours (walking)",
    dressCode: "Warm jacket Oct–March. Comfortable walking shoes always.",
    preparation: [
      "Mall Road is vehicle-free — enjoy the pedestrian walk",
      "Visit Christ Church for beautiful neo-Gothic architecture",
      "Book Jakhoo Ropeway online to avoid 1-hour queue",
      "Try 'Baljees' restaurant on Mall Road for samosas and coffee",
      "Carry umbrella — sudden rain/snow showers common"
    ],
    localTransport: [
      { mode: "Walk from Shimla Bus Stand", price: "Free", duration: "10 min uphill" },
      { mode: "Lift/Elevator from Cart Road", price: "₹10", duration: "2 min" },
      { mode: "Local taxi from railway station", price: "₹100-150", duration: "8 min" }
    ],
    nearbyStays: [
      { name: "Hotels on Mall Road", type: "Mid-range", price: "₹2,000-5,000/night", distance: "On Mall Road" },
      { name: "Hostels near Lakkar Bazaar", type: "Budget", price: "₹500-1,000/night", distance: "500m" },
      { name: "Oberoi Cecil", type: "Heritage Luxury", price: "₹15,000-30,000/night", distance: "On Mall Road" }
    ]
  },
  // UTTARAKHAND — RISHIKESH
  {
    id: "tp-rishikesh-laxman-jhula",
    name: "Ram Jhula & Laxman Jhula",
    state: "Uttarakhand",
    district: "Dehradun",
    openingTime: "Open 24 Hours",
    closingTime: "Open 24 Hours",
    bestVisitTime: "6:00 AM – 8:00 AM (yoga by Ganga) & 6:30 PM (Triveni Ghat Aarti)",
    ticketPrice: "Free",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Open daily (Laxman Jhula currently closed for reconstruction — Ram Jhula open)",
    seasonalAvailability: "Year-round. Best Oct–March. River rafting season Sep–Jun.",
    currentCrowdLevel: "Moderate",
    avgVisitDuration: "3-4 hours (both bridges + ghats)",
    dressCode: "Modest clothing near ashrams and temples. Comfortable shoes.",
    preparation: [
      "Laxman Jhula bridge currently closed for safety reconstruction — cross via Ram Jhula",
      "Attend evening Ganga Aarti at Triveni Ghat (6:30 PM) — arrive 30 min early for front seats",
      "White water rafting booking at official Garhwal Mandal counters only",
      "Carry water shoes if you want to walk into the Ganga at sandy ghats",
      "Vegetarian zone — no alcohol or non-veg food allowed in Rishikesh"
    ],
    localTransport: [
      { mode: "Auto from Rishikesh Bus Stand", price: "₹80-150", duration: "15 min" },
      { mode: "Shared auto/vikram", price: "₹20/person", duration: "20 min" },
      { mode: "Walk along Ganga ghat path", price: "Free", duration: "40 min (scenic)" }
    ],
    nearbyStays: [
      { name: "Ashram stays (Parmarth Niketan)", type: "Ashram", price: "₹500-1,500/night", distance: "At Ram Jhula" },
      { name: "Hostels at Tapovan", type: "Budget", price: "₹400-1,000/night", distance: "2 km" },
      { name: "Hotels near Laxman Jhula", type: "Mid-range", price: "₹1,500-3,500/night", distance: "500m" }
    ]
  },
  // GOA
  {
    id: "tp-goa-calangute",
    name: "Calangute & Baga Beach",
    state: "Goa",
    district: "North Goa",
    openingTime: "Open 24 Hours",
    closingTime: "Open 24 Hours",
    bestVisitTime: "6:00 AM – 9:00 AM (peaceful) & 4:00 PM – sunset (golden hour)",
    ticketPrice: "Free",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Never",
    seasonalAvailability: "Best Oct–March. Monsoon (Jun–Sep) beach shacks closed, heavy rain.",
    currentCrowdLevel: "Very High (peak season Nov–Jan)",
    avgVisitDuration: "Half day or full day",
    dressCode: "Beachwear. Swimwear at beach, cover up when visiting churches/temples.",
    preparation: [
      "RENT A SCOOTER — it's the only practical way to explore Goa (₹300-400/day)",
      "Avoid touts on beach — negotiate water sports prices (parasailing ₹800-1200, jet ski ₹500-800)",
      "Beach shacks serve fresh seafood — try Kingfish Thali and Prawn Curry Rice",
      "Carry sunscreen SPF 50+ and stay hydrated",
      "Saturday Night Market at Arpora (near Baga) — must visit for shopping"
    ],
    localTransport: [
      { mode: "Rent Scooter/Activa", price: "₹300-400/day", duration: "Self-paced" },
      { mode: "Pilot (motorcycle taxi)", price: "₹100-300", duration: "Varies" },
      { mode: "Ola/Uber (limited in Goa)", price: "₹200-500", duration: "20-30 min from Panaji" },
      { mode: "Local Kadamba bus", price: "₹15-30", duration: "30-45 min" }
    ],
    nearbyStays: [
      { name: "Beach shack rooms", type: "Budget", price: "₹800-2,000/night", distance: "On beach" },
      { name: "Hotels Calangute main road", type: "Mid-range", price: "₹2,000-5,000/night", distance: "500m" },
      { name: "Resorts at Baga", type: "Premium", price: "₹6,000-15,000/night", distance: "1 km" }
    ]
  },
  // VARANASI
  {
    id: "tp-varanasi-ganga-aarti",
    name: "Dashashwamedh Ghat Ganga Aarti",
    state: "Uttar Pradesh",
    district: "Varanasi",
    openingTime: "Open 24 Hours (Ghats)",
    closingTime: "Open 24 Hours (Ghats)",
    bestVisitTime: "5:00 AM – 7:00 AM (sunrise boat ride) & 6:00 PM – 7:30 PM (Maha Aarti)",
    ticketPrice: "Free (Boat ride ₹200-500)",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Aarti happens EVERY day without exception",
    seasonalAvailability: "Year-round. Best Oct–March. Dev Deepawali in November is magical.",
    currentCrowdLevel: "Very High",
    avgVisitDuration: "2-3 hours per session (morning + evening)",
    dressCode: "Modest clothing at ghats. Remove shoes near temples.",
    preparation: [
      "Arrive at Dashashwamedh Ghat by 5:30 PM to get a good viewing spot for Aarti",
      "Book boat through official Namo Ghat counter — avoid unlicensed boatmen",
      "Morning sunrise boat ride from Assi Ghat is the MOST recommended experience",
      "Try Banarasi Paan at Keshav Paan Bhandar and Blue Lassi Shop lassi",
      "The narrow galis (lanes) are confusing — use Google Maps offline or hire a local guide",
      "Carry mosquito repellent for evening ghat visits"
    ],
    localTransport: [
      { mode: "E-Rickshaw from Varanasi Jn", price: "₹30-50", duration: "20 min" },
      { mode: "Auto-rickshaw", price: "₹80-150", duration: "15 min" },
      { mode: "Ola/Uber", price: "₹100-200", duration: "15 min" },
      { mode: "Walking through galis", price: "Free", duration: "30 min (scenic but winding)" }
    ],
    nearbyStays: [
      { name: "Ghat-facing guesthouses", type: "Heritage", price: "₹1,500-4,000/night", distance: "At ghats" },
      { name: "BrijRama Palace", type: "Heritage Luxury", price: "₹10,000-25,000/night", distance: "Darbhanga Ghat" },
      { name: "Hostels (Godowlia area)", type: "Budget", price: "₹400-1,000/night", distance: "500m from ghats" }
    ]
  },
  // KARNATAKA — HAMPI
  {
    id: "tp-hampi-ruins",
    name: "Hampi Vijayanagara Ruins (UNESCO)",
    state: "Karnataka",
    district: "Vijayanagara",
    openingTime: "06:00 AM",
    closingTime: "06:00 PM",
    bestVisitTime: "6:00 AM – 10:00 AM (cool, golden light on ruins) & 4:00 PM – sunset at Hemakuta Hill",
    ticketPrice: "₹40 (Indians), ₹600 (Foreigners) — covers all zones",
    onlineBooking: true,
    isClosed: false,
    closedOn: "Open daily",
    seasonalAvailability: "Best Oct–Feb. Extremely hot Mar–Jun (40°C+). Monsoon Jul–Sep partly flooded.",
    currentCrowdLevel: "Moderate",
    avgVisitDuration: "Full day minimum (2 days recommended)",
    dressCode: "Light cotton clothes. Hat/cap essential. Comfortable walking shoes.",
    preparation: [
      "Hampi is HUGE — rent a bicycle (₹100-150/day) or moped (₹300/day)",
      "Carry 3+ liters of water — very hot and dry terrain",
      "Virupaksha Temple is free entry and the most iconic structure",
      "Sunset from Hemakuta Hill or Matanga Hill is unmissable",
      "Hippie Island (across river) has cafes and bouldering — take coracle boat (₹50)"
    ],
    localTransport: [
      { mode: "Bicycle rental", price: "₹100-150/day", duration: "Self-paced" },
      { mode: "Moped/scooter rental", price: "₹300-400/day", duration: "Self-paced" },
      { mode: "Auto from Hospet", price: "₹150-200", duration: "20 min" },
      { mode: "Coracle boat to Hippie Island", price: "₹50", duration: "5 min" }
    ],
    nearbyStays: [
      { name: "Guesthouses Hampi Bazaar", type: "Budget", price: "₹500-1,200/night", distance: "At ruins" },
      { name: "Hippie Island huts", type: "Budget", price: "₹400-1,000/night", distance: "Across river" },
      { name: "Hotels in Hospet", type: "Mid-range", price: "₹1,500-3,500/night", distance: "13 km" }
    ]
  },
  // MEGHALAYA — CHERRAPUNJI
  {
    id: "tp-cherrapunji-root-bridge",
    name: "Double Decker Living Root Bridge (Nongriat)",
    state: "Meghalaya",
    district: "East Khasi Hills",
    openingTime: "06:00 AM",
    closingTime: "04:00 PM (start trek before noon)",
    bestVisitTime: "7:00 AM – 11:00 AM (cooler, less slippery)",
    ticketPrice: "₹50 (Conservation fee)",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Open daily (avoid heavy monsoon days — slippery trail)",
    seasonalAvailability: "Best Oct–April. Monsoon (Jun–Sep) trail extremely slippery & dangerous.",
    currentCrowdLevel: "Low to Moderate",
    avgVisitDuration: "5-7 hours (including trek)",
    dressCode: "Trek shoes with grip MANDATORY. Quick-dry clothes.",
    preparation: [
      "Trek involves 3,500+ steep steps DOWN and then back UP — moderate to hard difficulty",
      "Start by 7:00 AM — you need 5-7 hours roundtrip",
      "Carry 2-3 liters of water and energy snacks (glucose, chikki)",
      "Hire a local Khasi guide (₹500-800) — trail has confusing forks",
      "Natural pool at base — carry swimwear for a refreshing dip",
      "Overnight stay possible at Nongriat village homestays (₹500-800/night)",
      "DO NOT attempt in heavy rain — rocks become extremely slippery"
    ],
    localTransport: [
      { mode: "Shared Sumo from Shillong", price: "₹200-300/seat", duration: "2h to Cherrapunji" },
      { mode: "Private cab from Shillong", price: "₹2,500-3,500", duration: "1.5h" },
      { mode: "Trek from Tyrna village", price: "Guide ₹500-800", duration: "1.5h descent" }
    ],
    nearbyStays: [
      { name: "Nongriat village homestay", type: "Homestay", price: "₹500-800/night", distance: "At bridge" },
      { name: "Hotels in Cherrapunji", type: "Mid-range", price: "₹1,500-3,000/night", distance: "12 km" },
      { name: "Guesthouses Tyrna", type: "Budget", price: "₹600-1,200/night", distance: "At trek start" }
    ]
  },
  // ANDAMAN
  {
    id: "tp-havelock-radhanagar",
    name: "Radhanagar Beach (Beach No. 7)",
    state: "Andaman and Nicobar",
    district: "South Andaman",
    openingTime: "05:00 AM",
    closingTime: "05:30 PM",
    bestVisitTime: "4:00 PM – 5:30 PM (golden sunset) & 6:00 AM – 8:00 AM (empty beach)",
    ticketPrice: "Free",
    onlineBooking: false,
    isClosed: false,
    closedOn: "Open daily",
    seasonalAvailability: "Best Oct–May. Monsoon (Jun–Sep) beach access restricted.",
    currentCrowdLevel: "Moderate",
    avgVisitDuration: "3-4 hours",
    dressCode: "Swimwear/beachwear. Reef-safe sunscreen.",
    preparation: [
      "Voted Asia's Best Beach by TIME Magazine",
      "No restaurants ON the beach — eat at resorts before visiting",
      "Changing rooms and lockers available at entrance",
      "Swimming safe in designated areas only — strong undercurrents",
      "Elephanta Beach for snorkeling is nearby (glass-bottom boat ₹600)"
    ],
    localTransport: [
      { mode: "Rent scooter on Havelock", price: "₹500-800/day", duration: "Self-paced" },
      { mode: "Auto from Havelock Jetty", price: "₹200-300", duration: "20 min" },
      { mode: "Resort shuttle", price: "₹100-200", duration: "15 min" }
    ],
    nearbyStays: [
      { name: "Resorts near Radhanagar", type: "Premium", price: "₹5,000-15,000/night", distance: "1 km" },
      { name: "Guesthouses at Beach 3", type: "Budget", price: "₹800-2,000/night", distance: "5 km" },
      { name: "Taj Exotica", type: "Luxury", price: "₹20,000+/night", distance: "3 km" }
    ]
  }
];

// ========================================================
// TRAVEL PREPARATION CHECKLISTS
// ========================================================
export const TRAVEL_PREPARATION = {
  general: {
    title: "General Travel Checklist",
    icon: "🎒",
    items: [
      { item: "Government Photo ID (Aadhaar/Voter ID/Passport)", category: "documents", essential: true },
      { item: "Printed/Digital tickets (flight/train/bus)", category: "documents", essential: true },
      { item: "Hotel booking confirmation", category: "documents", essential: true },
      { item: "Cash + UPI-enabled phone", category: "money", essential: true },
      { item: "Phone charger + power bank (20,000 mAh)", category: "electronics", essential: true },
      { item: "Basic medicines (paracetamol, band-aid, ORS)", category: "health", essential: true },
      { item: "Water bottle (refillable)", category: "essentials", essential: true },
      { item: "Sunscreen SPF 50+ & sunglasses", category: "essentials", essential: false },
      { item: "Rain jacket / compact umbrella", category: "clothing", essential: false },
      { item: "Offline Google Maps of destination", category: "electronics", essential: true }
    ]
  },
  hillStation: {
    title: "Hill Station Checklist (Ooty, Kodaikanal, Shimla, Manali, Munnar)",
    icon: "🏔️",
    items: [
      { item: "Warm jacket / fleece / hoodie", category: "clothing", essential: true },
      { item: "Thermal inner wear (for <5°C areas)", category: "clothing", essential: false },
      { item: "Sturdy trekking/walking shoes", category: "clothing", essential: true },
      { item: "Woolen socks & gloves (Nov–Feb)", category: "clothing", essential: false },
      { item: "Motion sickness tablets (Avomine)", category: "health", essential: true },
      { item: "Light raincoat (sudden showers common)", category: "clothing", essential: true },
      { item: "Hot water flask / thermos", category: "essentials", essential: false }
    ]
  },
  highAltitude: {
    title: "High Altitude Checklist (Ladakh, Spiti, Sikkim North)",
    icon: "🗻",
    items: [
      { item: "Diamox tablets (altitude sickness prevention)", category: "health", essential: true },
      { item: "Inner Line Permit (ILP) — apply online 2 days ahead", category: "documents", essential: true },
      { item: "Oxygen cylinder (available for rent in Leh)", category: "health", essential: false },
      { item: "4-layer clothing system (thermal + fleece + jacket + windproof)", category: "clothing", essential: true },
      { item: "Lip balm with SPF & moisturizer (extreme dry air)", category: "essentials", essential: true },
      { item: "UV-rated sunglasses (snow blindness prevention)", category: "essentials", essential: true },
      { item: "Backup fuel can (no petrol pumps for 100+ km stretches)", category: "travel", essential: true },
      { item: "2 days acclimatization in Leh before any excursion", category: "health", essential: true }
    ]
  },
  beach: {
    title: "Beach Destination Checklist (Goa, Andaman, Kerala Coast)",
    icon: "🏖️",
    items: [
      { item: "Swimwear & quick-dry towel", category: "clothing", essential: true },
      { item: "Reef-safe sunscreen SPF 50+", category: "essentials", essential: true },
      { item: "Waterproof phone pouch", category: "electronics", essential: true },
      { item: "Flip-flops / waterproof sandals", category: "clothing", essential: true },
      { item: "Anti-chafe cream for water sports", category: "essentials", essential: false },
      { item: "Snorkeling gear (optional — rental available)", category: "essentials", essential: false },
      { item: "Insect repellent (for evenings)", category: "health", essential: true }
    ]
  },
  temple: {
    title: "Temple & Spiritual Site Checklist",
    icon: "🛕",
    items: [
      { item: "Modest clothing — cover shoulders and knees", category: "clothing", essential: true },
      { item: "Dhoti/Saree/Mundu for South Indian temples (Padmanabhaswamy, Meenakshi)", category: "clothing", essential: true },
      { item: "Socks for hot temple floors (Varanasi, Somnath)", category: "clothing", essential: true },
      { item: "Small denomination cash for donations/prasad", category: "money", essential: true },
      { item: "Leave footwear at designated counters (₹5-10)", category: "essentials", essential: true },
      { item: "No leather items in Jain temples", category: "essentials", essential: true },
      { item: "Photography restrictions — check before clicking", category: "essentials", essential: true }
    ]
  },
  wildlife: {
    title: "Wildlife Safari Checklist (Ranthambore, Jim Corbett, Kaziranga)",
    icon: "🐯",
    items: [
      { item: "Olive/khaki/earth-tone clothing (no bright colors)", category: "clothing", essential: true },
      { item: "Binoculars (7x or 10x)", category: "essentials", essential: true },
      { item: "Camera with 200mm+ zoom lens", category: "electronics", essential: false },
      { item: "Early morning safari booking (5:30 AM — best sightings)", category: "documents", essential: true },
      { item: "Book safari online 120 days in advance (Ranthambore sells out fast)", category: "documents", essential: true },
      { item: "Insect repellent & cap/hat", category: "essentials", essential: true },
      { item: "Maintain silence during safari — no phone ringtones", category: "essentials", essential: true }
    ]
  }
};

// ========================================================
// NOTIFICATION TEMPLATES
// ========================================================
export const NOTIFICATION_TEMPLATES = [
  {
    id: "notif-24h",
    triggerBefore: "24 hours",
    triggerHours: 24,
    title: "🎒 Travel Preparation Reminder",
    message: "Your trip to {destination} is tomorrow! Check your packing list, download offline maps, and confirm your hotel booking.",
    priority: "medium",
    actions: ["View Packing List", "Check Weather", "Download Offline Map"]
  },
  {
    id: "notif-12h",
    triggerBefore: "12 hours",
    triggerHours: 12,
    title: "📋 Pre-Travel Document Check",
    message: "12 hours to departure! Verify: tickets printed/downloaded, ID ready, hotel confirmation saved, emergency contacts shared with family.",
    priority: "high",
    actions: ["View Tickets", "Check Documents", "Share Trip Details"]
  },
  {
    id: "notif-6h",
    triggerBefore: "6 hours",
    triggerHours: 6,
    title: "🚕 Book Your Cab to Station/Airport",
    message: "Your {transportType} departs at {departureTime}. Book your cab/auto NOW to reach {fromStation} on time. Recommended: Leave 1 hour early.",
    priority: "high",
    actions: ["Book Ola", "Book Uber", "Check Metro Route"]
  },
  {
    id: "notif-3h",
    triggerBefore: "3 hours",
    triggerHours: 3,
    title: "⏰ Time to Leave for {fromStation}",
    message: "Leave for {fromStation} now! Factor in traffic and security checks. Your {transportType} departs at {departureTime}.",
    priority: "critical",
    actions: ["Get Directions", "Check Live Status"]
  },
  {
    id: "notif-1h",
    triggerBefore: "1 hour",
    triggerHours: 1,
    title: "🎫 Final Boarding Check",
    message: "1 hour to departure! Check: Platform/Gate number, boarding pass, luggage. Track live status of your {transportType}.",
    priority: "critical",
    actions: ["Check PNR Status", "Check Platform/Gate"]
  },
  {
    id: "notif-arrival",
    triggerBefore: "On Arrival",
    triggerHours: 0,
    title: "📍 Welcome to {destination}!",
    message: "You've arrived! Here are your options: prepaid taxi counter, auto stand, hotel pickup. Tourist places nearby with timings and current crowd levels.",
    priority: "medium",
    actions: ["View Local Transport", "Navigate to Hotel", "See Tourist Places"]
  },
  {
    id: "notif-tourist-opening",
    triggerBefore: "Tourist Place Opening",
    triggerHours: -1,
    title: "🏛️ {placeName} Opens Soon!",
    message: "{placeName} opens at {openingTime}. Current crowd level: {crowdLevel}. Best to arrive 30 min early for popular spots.",
    priority: "low",
    actions: ["Get Directions", "View Details", "Check Crowd Level"]
  }
];

// ========================================================
// HELPER FUNCTIONS
// ========================================================
export const getPreBoardingByType = (type) => {
  if (!type || type === "all") return PRE_BOARDING_OPTIONS;
  return PRE_BOARDING_OPTIONS.filter((o) => o.type === type);
};

export const getPostDeboarding = () => POST_DEBOARDING_OPTIONS;

export const getTouristPlaceInfo = (placeName) => {
  if (!placeName) return null;
  return TOURIST_PLACE_INFO.find(
    (p) => p.name.toLowerCase().includes(placeName.toLowerCase())
  ) || null;
};

export const getTouristPlacesByState = (state) => {
  if (!state) return TOURIST_PLACE_INFO;
  return TOURIST_PLACE_INFO.filter(
    (p) => p.state.toLowerCase() === state.toLowerCase()
  );
};

export const getPreparationChecklist = (type) => {
  return TRAVEL_PREPARATION[type] || TRAVEL_PREPARATION.general;
};

export const getNotificationTemplates = () => NOTIFICATION_TEMPLATES;

// ========================================================
// 24-HOUR PRICE VARIATION & TIMINGS GUIDE EXPORTS
// ========================================================
export const PRICE_VARIATION_24H = [
  {
    timeSlot: "Early Morning (04:00 AM – 07:00 AM)",
    pricingType: "Standard / Low Traffic",
    priceMultiplier: 1.0,
    reason: "Low road congestion, steady cab & auto availability. Best window for airport runs.",
    bestOption: "Book Uber/Ola Reserve 30 min ahead or take prepaid counter cabs."
  },
  {
    timeSlot: "Morning Peak Rush (08:00 AM – 11:00 AM)",
    pricingType: "High Surge (1.3x – 1.6x)",
    priceMultiplier: 1.4,
    reason: "Office commute & main railway arrivals create heavy terminal congestion.",
    bestOption: "Use Metro / Rapid rail or leave 45 mins earlier than usual."
  },
  {
    timeSlot: "Afternoon Off-Peak (12:00 PM – 04:30 PM)",
    pricingType: "Discounted / Flat Rate",
    priceMultiplier: 0.9,
    reason: "Clear arterial highways and abundant drivers. Great for outstation departures.",
    bestOption: "Optimal time for outstation cabs, self-drive highways, and peaceful boarding."
  },
  {
    timeSlot: "Evening Peak Rush (05:00 PM – 08:30 PM)",
    pricingType: "High Surge (1.4x – 1.8x)",
    priceMultiplier: 1.5,
    reason: "Heavy city bottleneck traffic near ISBTs and railway junction gates.",
    bestOption: "Suburban rail / Metro directly to terminal concourse."
  },
  {
    timeSlot: "Night & Midnight (09:00 PM – 03:30 AM)",
    pricingType: "Night Tariff (+20-25%)",
    priceMultiplier: 1.2,
    reason: "Standard government night fare applicable. Fast highway transit.",
    bestOption: "Pre-book verified app cabs with OTP verification and live GPS tracking."
  }
];

export const ATTRACTION_TIMING_GUIDE = [
  {
    category: "Viewpoints, Peaks & Ghat Terraces",
    typicalHours: "06:00 AM – 06:00 PM",
    bestTimeToVisit: "06:30 AM – 09:00 AM (Sunrise & Mist) or 04:30 PM – 06:00 PM (Sunset)",
    ticketCounterCloses: "Last entry at 05:00 PM",
    weeklyClosure: "Open all 7 days"
  },
  {
    category: "Botanical Gardens, Parks & Lakes",
    typicalHours: "08:30 AM – 06:30 PM",
    bestTimeToVisit: "09:00 AM – 11:30 AM (Crisp light & shortest boating queues)",
    ticketCounterCloses: "Boating ticket counter closes at 05:30 PM",
    weeklyClosure: "Open all days"
  },
  {
    category: "Heritage Temples, Forts & Monasteries",
    typicalHours: "06:00 AM – 12:30 PM & 04:00 PM – 08:30 PM",
    bestTimeToVisit: "06:30 AM (Morning Darshan) or 06:00 PM (Evening Aarti)",
    ticketCounterCloses: "Afternoon closure 12:30 PM – 04:00 PM",
    weeklyClosure: "Open all days"
  },
  {
    category: "Waterfalls & Forest Sanctuaries",
    typicalHours: "09:00 AM – 04:30 PM",
    bestTimeToVisit: "10:00 AM – 02:00 PM (Bright sunlight inside forest canopies)",
    ticketCounterCloses: "Forest checkpost closes at 03:30 PM",
    weeklyClosure: "Monsoon safety restrictions may apply"
  }
];

export const TRAVEL_PREP_CHECKLIST = [
  {
    category: "Essential Documents & Payment",
    items: [
      "Government Photo ID (Aadhaar / Voter ID / Passport / DL)",
      "Digital / Printed transport tickets & QR boarding pass",
      "Hotel / Resort booking confirmation vouchers",
      "Cash backup (₹1,500 – ₹3,000 for tolls, tea stalls & ghat fees)",
      "UPI payment apps active and loaded"
    ]
  },
  {
    category: "Electronics & Navigation",
    items: [
      "Power bank (10,000 – 20,000 mAh) fully charged",
      "Phone charging cables & car adaptor",
      "Offline maps downloaded for destination district",
      "Earphones / noise-cancelling headphones for bus/train",
      "Emergency SOS contacts saved on speed dial"
    ]
  },
  {
    category: "Health, Medication & Road Comfort",
    items: [
      "Motion sickness tablets (Avomine) for ghat hairpin bends",
      "Basic first-aid kit (Paracetamol, Band-Aids, ORS, Antacid)",
      "Refillable insulated water bottle",
      "Light jacket / hoodie for AC transport or evening hill breeze",
      "Hand sanitizer and wet wipes"
    ]
  }
];

