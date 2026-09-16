// src/data/endToEndTransportData.js
// Provides dynamic multi-app First-Mile (Cab from Home), Local Transport Price Comparison, and Post-Deboarding options for all transport modes (Train, Bus, Flight, Cab, Multi-modal)

/**
 * Hub Presets for different transport modes across major Indian cities
 */
export const getHubPresets = (city = "Chennai", mode = "train") => {
  const c = city.toLowerCase();
  
  if (mode === "train" || mode === "railway") {
    if (c.includes("chennai")) return ["Chennai Central (MAS) - Gate 1", "Chennai Egmore (MS) - Main Porch", "Tambaram Railway Station"];
    if (c.includes("bengaluru") || c.includes("bangalore")) return ["KSR Bengaluru City (SBC) - Platform 1 Entry", "Yesvantpur Junction (YPR)", "Bengaluru Cantt (BNC)"];
    if (c.includes("delhi")) return ["New Delhi Railway Station (NDLS) - Ajmeri Gate", "Hazrat Nizamuddin (NZM)", "Old Delhi (DLI)"];
    if (c.includes("mumbai")) return ["CSMT Mumbai Terminal - Main Concourse", "Mumbai Central (MMCT)", "Bandra Terminus (BDTS)"];
    if (c.includes("hyderabad")) return ["Secunderabad Junction (SC) - Gate 1", "Hyderabad Deccan (HYB)", "Kacheguda (KCG)"];
    if (c.includes("kolkata")) return ["Howrah Junction (HWH) - New Complex", "Sealdah Railway Station (SDAH)", "Kolkata Station (KOAA)"];
    if (c.includes("pune")) return ["Pune Junction (PUNE) - Main Entrance", "Shivajinagar Station"];
    if (c.includes("goa")) return ["Madgaon Junction (MAO) - Exit Gate 1", "Thivim Railway Station (THVM)", "Vasco Da Gama (VSG)"];
    return [`${city} Junction Railway Station - Platform 1`, `${city} North Railway Station`];
  }

  if (mode === "bus") {
    if (c.includes("chennai")) return ["CMBT Koyambedu Bus Terminus - Bay 3", "Kilambakkam KCBT Terminus", "Madhavaram MMBT"];
    if (c.includes("bengaluru") || c.includes("bangalore")) return ["Majestic KSRTC Bus Stand - Platform 2", "Shantinagar Bus Station", "Anand Rao Circle Private Bus Bay"];
    if (c.includes("delhi")) return ["Kashmere Gate ISBT - Bay 5", "Anand Vihar ISBT", "Sarai Kale Khan ISBT"];
    if (c.includes("mumbai")) return ["Borivali Bus Hub - National Park", "Dadar Central Bus Stand", "Vashi Highway Bus Stop"];
    if (c.includes("hyderabad")) return ["MGBS Central Bus Station - Bay 4", "JBS Secunderabad", "Ameerpet Bus Stop"];
    if (c.includes("pune")) return ["Swargate Bus Stand - Platform 1", "Shivajinagar Bus Stand", "Wakad Highway Bridge"];
    if (c.includes("goa")) return ["Panaji KSRTC Bus Stand - Platform 1", "Mapusa Bus Stand", "Margao KTC Bus Terminal"];
    return [`${city} Central Bus Stand (ISBT) - Bay 1`, `${city} Bypass Highway Stop`];
  }

  if (mode === "flight" || mode === "airport") {
    if (c.includes("chennai")) return ["Chennai Intl Airport (MAA) - Terminal 1 Domestic", "Terminal 4 (T4)"];
    if (c.includes("bengaluru") || c.includes("bangalore")) return ["Kempegowda Intl Airport (BLR) - Terminal 1", "Terminal 2 (Garden Terminal)"];
    if (c.includes("delhi")) return ["Indira Gandhi Intl Airport (DEL) - Terminal 3 Departure", "Terminal 2 Domestic", "Terminal 1"];
    if (c.includes("mumbai")) return ["Chhatrapati Shivaji Maharaj Intl (BOM) - T2 Departure", "T1 Domestic Santacruz"];
    if (c.includes("hyderabad")) return ["Rajiv Gandhi Intl Airport (HYD) - Departure Gate 3"];
    if (c.includes("kolkata")) return ["Netaji Subhash Chandra Bose Intl (CCU) - Domestic Gate 2"];
    if (c.includes("goa")) return ["Manohar Intl Airport Mopa (GOX) - Departure", "Dabolim Airport (GOI)"];
    return [`${city} Airport (Domestic Terminal 1)`];
  }

  // Intercity cab / highway pickup
  return [`${city} Doorstep Pickup (Home / Hotel)`, `${city} Main Highway Toll Plaza`];
};

/**
 * Standard Pickup Area Presets for Origin City
 */
export const getPickupPresets = (city = "Chennai") => {
  const c = city.toLowerCase();
  if (c.includes("chennai")) return ["Home - T. Nagar / Anna Nagar", "Home - Adyar / Velachery", "Office - OMR IT Corridor", "Current GPS Location", "Custom Address"];
  if (c.includes("bengaluru") || c.includes("bangalore")) return ["Home - Indiranagar / Koramangala", "Home - Whitefield / HSR Layout", "Office - Manyata / Electronic City", "Current GPS Location", "Custom Address"];
  if (c.includes("delhi")) return ["Home - Connaught Place / South Ex", "Home - Dwarka / Rohini", "Office - Cyber City Gurgaon / Noida", "Current GPS Location", "Custom Address"];
  if (c.includes("mumbai")) return ["Home - Bandra / Andheri West", "Home - Powai / Thane", "Office - BKC / Lower Parel", "Current GPS Location", "Custom Address"];
  if (c.includes("hyderabad")) return ["Home - Jubilee Hills / Banjara Hills", "Home - Gachibowli / Madhapur", "Office - Hitec City", "Current GPS Location", "Custom Address"];
  if (c.includes("pune")) return ["Home - Kothrud / Viman Nagar", "Home - Baner / Hinjawadi", "Current GPS Location", "Custom Address"];
  return ["Home Address", "Current GPS Location", "Office / Work Location", "Hotel / Stay Location", "Custom Address"];
};

/**
 * Generate Local Transport Options Comparison Matrix (Auto vs Cab vs Bike vs Metro vs Shuttle)
 * for any given pickup and drop point
 */
export const getLocalTransportComparison = (pickup = "Home", drop = "Railway Station", distanceKm = 12) => {
  const dist = Math.max(2, distanceKm);

  // Auto Rickshaw
  const autoFare = Math.max(50, Math.round(dist * 13 + 30));
  const autoEta = Math.max(8, Math.round(dist * 2.2));

  // Bike Taxi (Rapido / Uber Moto)
  const bikeFare = Math.max(35, Math.round(dist * 7.5 + 20));
  const bikeEta = Math.max(6, Math.round(dist * 1.6));

  // AC Hatchback / Uber Go / Ola Mini
  const cabHatchFare = Math.max(140, Math.round(dist * 15 + 60));
  const cabHatchEta = Math.max(10, Math.round(dist * 2.4));

  // AC Prime Sedan / BluSmart EV
  const cabSedanFare = Math.max(220, Math.round(dist * 20 + 90));
  const cabSedanEta = Math.max(10, Math.round(dist * 2.4));

  // Metro / Local Bus Feeder
  const publicTransitFare = Math.max(20, Math.min(60, Math.round(dist * 2.5 + 10)));
  const publicTransitEta = Math.max(15, Math.round(dist * 2.8 + 10));

  // Prepaid Station / Airport Taxi Counter
  const prepaidFare = Math.max(180, Math.round(dist * 17 + 80));
  const prepaidEta = Math.max(10, Math.round(dist * 2.4));

  return [
    {
      id: "local-auto",
      mode: "auto",
      name: "Auto-Rickshaw (Meter / Ola / Uber Auto)",
      iconType: "auto",
      price: autoFare,
      etaMins: autoEta,
      etaFormatted: `${autoEta} min`,
      waitMins: 2,
      waitFormatted: "2-3 min wait",
      category: "Quick & Easy",
      luggage: "1-2 Medium Bags",
      capacity: "Up to 3 Pax",
      bestFor: "Budget solo or pair, quick city maneuver",
      pros: ["Lowest cab price", "Quickest pickup", "No cancellation hassle"],
      rating: 4.6,
      badge: "BEST VALUE",
      badgeColor: "#F59E0B"
    },
    {
      id: "local-bike",
      mode: "bike",
      name: "Bike Taxi (Rapido / Uber Moto)",
      iconType: "bike",
      price: bikeFare,
      etaMins: bikeEta,
      etaFormatted: `${bikeEta} min`,
      waitMins: 2,
      waitFormatted: "1-2 min wait",
      category: "Fastest in Traffic",
      luggage: "Backpack Only",
      capacity: "1 Passenger",
      bestFor: "Solo travelers beating rush hour traffic",
      pros: ["Cheapest option (₹" + bikeFare + ")", "Cuts through heavy jams", "Instant arrival"],
      rating: 4.7,
      badge: "FASTEST & CHEAPEST",
      badgeColor: "#10B981"
    },
    {
      id: "local-cab-hatch",
      mode: "cab",
      name: "AC City Cab (Uber Go / Ola Mini)",
      iconType: "car",
      price: cabHatchFare,
      etaMins: cabHatchEta,
      etaFormatted: `${cabHatchEta} min`,
      waitMins: 4,
      waitFormatted: "3-5 min wait",
      category: "AC Comfort Hatchback",
      luggage: "2-3 Large Bags",
      capacity: "Up to 4 Pax",
      bestFor: "Comfortable family or luggage ride",
      pros: ["Air conditioned", "Doorstep trunk space", "Live GPS tracking"],
      rating: 4.8,
      badge: "MOST POPULAR",
      badgeColor: "#2563EB",
      recommended: true
    },
    {
      id: "local-cab-sedan",
      mode: "sedan",
      name: "Prime Sedan / BluSmart EV",
      iconType: "car",
      price: cabSedanFare,
      etaMins: cabSedanEta,
      etaFormatted: `${cabSedanEta} min`,
      waitMins: 5,
      waitFormatted: "4-6 min wait",
      category: "Premium EV / Sedan",
      luggage: "3-4 Large Bags",
      capacity: "Up to 4 Pax",
      bestFor: "Executive luxury, zero surge guarantee",
      pros: ["Spacious boot", "Zero cancellation guarantee", "Silent electric drive"],
      rating: 4.9,
      badge: "PREMIUM COMFORT",
      badgeColor: "#7C3AED"
    },
    {
      id: "local-prepaid-taxi",
      mode: "prepaid",
      name: "Station/Airport Prepaid Taxi",
      iconType: "car",
      price: prepaidFare,
      etaMins: prepaidEta,
      etaFormatted: `${prepaidEta} min`,
      waitMins: 3,
      waitFormatted: "Instant at Counter",
      category: "Fixed Govt Fare",
      luggage: "3 Large Bags",
      capacity: "Up to 4 Pax",
      bestFor: "Fixed price without app dependency",
      pros: ["Official fixed slip", "Zero surge price", "Police verified driver"],
      rating: 4.65,
      badge: "GOVT FIXED",
      badgeColor: "#059669"
    },
    {
      id: "local-public-transit",
      mode: "transit",
      name: "Metro Rail / City Feeder Bus",
      iconType: "train",
      price: publicTransitFare,
      etaMins: publicTransitEta,
      etaFormatted: `${publicTransitEta} min`,
      waitMins: 6,
      waitFormatted: "5-10 min frequency",
      category: "Mass Public Transit",
      luggage: "Hand Luggage",
      capacity: "Solo / Group",
      bestFor: "Lowest cost eco-commute",
      pros: ["100% traffic free corridor", "Lowest fare (₹" + publicTransitFare + ")", "Eco friendly"],
      rating: 4.5,
      badge: "ECO SAVER",
      badgeColor: "#6B7280"
    }
  ];
};

/**
 * Generate First-Mile Ride App Options for getting from Home to Departure Hub
 * @param {string} fromCity Origin city name (e.g. "Chennai", "Delhi", "Bengaluru", "Mumbai")
 * @param {string} hubType Type of hub ("railway", "airport", "bus", "generic")
 * @param {number} distanceKm Distance from home to departure hub (default 12-18km)
 */
export const getFirstMileAppOptions = (fromCity = "Chennai", hubType = "railway", distanceKm = 14) => {
  const isMetroCity = ["chennai", "delhi", "bengaluru", "mumbai", "hyderabad", "kolkata", "pune", "ahmedabad"].some((c) =>
    fromCity.toLowerCase().includes(c)
  );

  const baseMinutes = hubType === "airport" ? 38 : hubType === "railway" ? 22 : 18;
  const distMultiplier = hubType === "airport" ? 2.2 : 1.0;
  const estDist = Math.max(4, Math.round(distanceKm * distMultiplier));

  // Uber Prices
  const uberGoFare = Math.max(160, Math.round(estDist * 14 + 60));
  const uberPremierFare = Math.max(240, Math.round(estDist * 19 + 90));
  const uberAutoFare = Math.max(90, Math.round(estDist * 10 + 35));

  // Ola Prices
  const olaMiniFare = Math.max(150, Math.round(estDist * 13.5 + 65));
  const olaPrimeFare = Math.max(230, Math.round(estDist * 18.5 + 85));
  const olaAutoFare = Math.max(85, Math.round(estDist * 9.5 + 35));

  // Rapido Prices
  const rapidoBikeFare = Math.max(55, Math.round(estDist * 6.5 + 25));
  const rapidoAutoFare = Math.max(80, Math.round(estDist * 9.0 + 30));

  // BluSmart Prices (Metros only)
  const bluSmartFare = Math.max(260, Math.round(estDist * 18.0 + 100));

  // Metro / Public Transit
  const metroFare = Math.max(20, Math.min(60, Math.round(estDist * 2.5 + 10)));

  return [
    {
      id: "app-uber",
      appId: "uber",
      appName: "Uber",
      brandColor: "#000000",
      brandBg: "rgba(0, 0, 0, 0.08)",
      tag: "POPULAR",
      tagColor: "#2563EB",
      iconType: "car",
      category: "Uber Go / Premier",
      description: "Direct doorstep pickup with live driver tracking & verified OTP.",
      estimatedDurationMinutes: baseMinutes,
      durationFormatted: `${baseMinutes} min`,
      pickupWaitMinutes: 3,
      pickupWaitFormatted: "3–5 min wait",
      price: uberGoFare,
      priceRange: `₹${uberGoFare} – ₹${uberPremierFare}`,
      subOptions: [
        { name: "Uber Go (AC Hatchback)", price: uberGoFare, eta: "3 min", luggage: "2 Bags" },
        { name: "Uber Premier (Sedan)", price: uberPremierFare, eta: "5 min", luggage: "3 Bags" },
        { name: "Uber Auto", price: uberAutoFare, eta: "2 min", luggage: "1 Bag" }
      ],
      features: ["Live GPS Share", "Zero Negotiation", "Safety PIN Verification", "Cashless UPI"],
      deepLinkUrl: "https://m.uber.com/looking",
      rating: 4.8,
      recommended: true
    },
    {
      id: "app-ola",
      appName: "Ola Cabs",
      appId: "ola",
      brandColor: "#65A30D",
      brandBg: "rgba(101, 163, 13, 0.10)",
      tag: "RELIABLE",
      tagColor: "#16A34A",
      iconType: "car",
      category: "Ola Mini / Prime",
      description: "Wide network of city cabs with scheduled ride options.",
      estimatedDurationMinutes: baseMinutes + 2,
      durationFormatted: `${baseMinutes + 2} min`,
      pickupWaitMinutes: 4,
      pickupWaitFormatted: "4–6 min wait",
      price: olaMiniFare,
      priceRange: `₹${olaMiniFare} – ₹${olaPrimeFare}`,
      subOptions: [
        { name: "Ola Mini (AC)", price: olaMiniFare, eta: "4 min", luggage: "2 Bags" },
        { name: "Ola Prime Sedan", price: olaPrimeFare, eta: "6 min", luggage: "3 Bags" },
        { name: "Ola Auto", price: olaAutoFare, eta: "3 min", luggage: "1 Bag" }
      ],
      features: ["Advance Scheduling", "Prime Play Screen", "Emergency SOS Button"],
      deepLinkUrl: "https://www.olacabs.com",
      rating: 4.7
    },
    {
      id: "app-rapido",
      appName: "Rapido",
      appId: "rapido",
      brandColor: "#F59E0B",
      brandBg: "rgba(245, 158, 11, 0.12)",
      tag: "CHEAPEST & FASTEST",
      tagColor: "#D97706",
      iconType: "bike",
      category: "Rapido Auto / Bike Taxi",
      description: "Beats peak-hour city traffic; ideal for solo travelers with backpack.",
      estimatedDurationMinutes: Math.max(12, baseMinutes - 7),
      durationFormatted: `${Math.max(12, baseMinutes - 7)} min`,
      pickupWaitMinutes: 2,
      pickupWaitFormatted: "2–4 min wait",
      price: rapidoAutoFare,
      priceRange: `₹${rapidoBikeFare} – ₹${rapidoAutoFare}`,
      subOptions: [
        { name: "Rapido Auto", price: rapidoAutoFare, eta: "3 min", luggage: "1 Medium Bag" },
        { name: "Rapido Bike Taxi", price: rapidoBikeFare, eta: "2 min", luggage: "Backpack Only" }
      ],
      features: ["Quickest Arrival", "Beats Traffic Jams", "Helmet Provided", "Budget Saver"],
      deepLinkUrl: "https://www.rapido.bike",
      rating: 4.65
    },
    {
      id: "app-blusmart",
      appName: "BluSmart EV",
      appId: "blusmart",
      brandColor: "#0284C7",
      brandBg: "rgba(2, 132, 199, 0.12)",
      tag: "100% ELECTRIC • 0 CANCELLATIONS",
      tagColor: "#0284C7",
      iconType: "car",
      category: "Premium EV Sedan",
      description: "100% electric fleet with zero cancellation guarantee and immaculate clean cabs.",
      estimatedDurationMinutes: baseMinutes,
      durationFormatted: `${baseMinutes} min`,
      pickupWaitMinutes: 6,
      pickupWaitFormatted: "5–8 min wait",
      price: bluSmartFare,
      priceRange: `₹${bluSmartFare}`,
      subOptions: [
        { name: "BluSmart EV Sedan (No Surge)", price: bluSmartFare, eta: "6 min", luggage: "3 Large Bags" }
      ],
      features: ["0% Driver Cancellations", "Zero Surge Pricing", "Silent Electric Ride", "Clean Sanitized Cabs"],
      deepLinkUrl: "https://blu-smart.com",
      rating: 4.92,
      isEV: true
    },
    {
      id: "app-metro-feeder",
      appName: isMetroCity ? "Metro Rail + Auto" : "City Bus Feeder",
      appId: "metro",
      brandColor: "#7C3AED",
      brandBg: "rgba(124, 58, 237, 0.10)",
      tag: "ECO BUDGET",
      tagColor: "#7C3AED",
      iconType: "train",
      category: isMetroCity ? "Rapid Metro Transit" : "City Public Transport",
      description: isMetroCity
        ? "Traffic-free dedicated rail corridor straight to station/airport concourse."
        : "City government bus route directly connecting central hubs.",
      estimatedDurationMinutes: baseMinutes + 12,
      durationFormatted: `${baseMinutes + 12} min`,
      pickupWaitMinutes: 5,
      pickupWaitFormatted: "5–10 min frequency",
      price: metroFare,
      priceRange: `₹${metroFare}`,
      subOptions: [
        { name: isMetroCity ? "Metro Token / QR Ticket" : "City Bus Ticket", price: metroFare, eta: "5 min", luggage: "Compact Luggage" }
      ],
      features: ["100% Traffic Free", "Lowest Cost Option", "Direct Terminal Gateway"],
      deepLinkUrl: "#",
      rating: 4.5
    }
  ];
};

/**
 * Generate Post-Deboarding Continuation Options for getting from Arrival Hub to Hotel / Tourist Spot
 * @param {string} toDestination Destination city / spot name
 * @param {string} hubType Type of arrival hub ("railway", "airport", "bus")
 */
export const getPostDeboardingOptions = (toDestination = "Goa", hubType = "railway") => {
  const isHillStation = ["kodaikanal", "munnar", "ooty", "manali", "shimla", "ladakh", "leh", "darjeeling", "gangtok", "coorg", "wayanad", "nainital", "mussoorie"].some(
    (h) => toDestination.toLowerCase().includes(h)
  );

  const isBeachOrGoa = toDestination.toLowerCase().includes("goa") || toDestination.toLowerCase().includes("gokarna") || toDestination.toLowerCase().includes("puri") || toDestination.toLowerCase().includes("pondicherry");

  const baseMinutes = isHillStation ? 50 : hubType === "airport" ? 40 : 25;
  const taxiFare = isHillStation ? 650 : hubType === "airport" ? 550 : 320;
  const autoFare = isHillStation ? 280 : 140;
  const sharedJeepFare = isHillStation ? 120 : 60;
  const scooterRentFare = 350;

  const options = [
    {
      id: "post-prepaid-taxi",
      type: "prepaid_taxi",
      name: "Official Prepaid Taxi Counter",
      iconType: "car",
      badge: "GOVT REGULATED • ZERO SURGE",
      badgeColor: "#16A34A",
      description: "Government-authorized fixed fare kiosk located right outside the arrival exit gates.",
      price: taxiFare,
      priceFormatted: `₹${taxiFare}`,
      durationMinutes: baseMinutes,
      durationFormatted: `${baseMinutes} min`,
      waitMinutes: 3,
      howToBoard: "Present booking slip at the dedicated prepaid taxi line outside Exit Gate 2.",
      paymentModes: ["Cash", "UPI at Counter"],
      tips: ["Receipt includes driver & cab details — hand receipt over only after reaching your stay."],
      recommended: true
    },
    {
      id: "post-app-pickup",
      type: "app_cab",
      name: "Uber / Ola Station Pickup Bay",
      iconType: "car",
      badge: "APP PICKUP ZONE",
      badgeColor: "#2563EB",
      description: "App-hailed ride meeting at dedicated App Pickup Lanes with transparent upfront pricing.",
      price: Math.round(taxiFare * 0.95),
      priceFormatted: `₹${Math.round(taxiFare * 0.95)}`,
      durationMinutes: baseMinutes,
      durationFormatted: `${baseMinutes} min`,
      waitMinutes: 6,
      howToBoard: "Follow signs to 'App Cab Pickup Zone (P4 / Bay C)' on arrival.",
      paymentModes: ["UPI", "Cards", "Ola Money / Uber Cash"],
      tips: ["Book when you reach the baggage carousel to synchronize driver arrival."]
    },
    {
      id: "post-local-auto",
      type: "auto",
      name: "Local Auto-Rickshaw / Tuk-Tuk",
      iconType: "auto",
      badge: "QUICK & DIRECT",
      badgeColor: "#F59E0B",
      description: "City auto-rickshaws available right at the platform exit curb for short stays.",
      price: autoFare,
      priceFormatted: `₹${autoFare}`,
      durationMinutes: Math.max(15, baseMinutes - 5),
      durationFormatted: `${Math.max(15, baseMinutes - 5)} min`,
      waitMinutes: 1,
      howToBoard: "Board at the official station auto rank.",
      paymentModes: ["UPI", "Cash"],
      tips: ["Verify fixed union rate board near the station exit before boarding."]
    }
  ];

  // For Hill Stations: Add Shared Jeep / Ghat Sumo
  if (isHillStation) {
    options.push({
      id: "post-shared-jeep",
      type: "shared_jeep",
      name: "Shared Ghat Jeep / Sumo / Traveller",
      iconType: "jeep",
      badge: "HILL ROUTE SPECIALIST",
      badgeColor: "#7C3AED",
      description: "High-clearance 4x4 or Sumo shared shuttle covering mountain curves and view points.",
      price: sharedJeepFare,
      priceFormatted: `₹${sharedJeepFare} / seat`,
      durationMinutes: baseMinutes + 15,
      durationFormatted: `${baseMinutes + 15} min`,
      waitMinutes: 10,
      howToBoard: "Departs from the Mountain Transit Stand outside station every 15 minutes.",
      paymentModes: ["Cash", "UPI"],
      tips: ["Front passenger seat is available for ₹50 extra if prone to motion sickness."]
    });
  }

  // For Beach/Goa/Tourist Hubs: Add Scooter / Bike Rental Option
  if (isBeachOrGoa || isHillStation) {
    options.push({
      id: "post-scooter-rental",
      type: "rental",
      name: "Self-Drive Scooter / Bike Rental Desk",
      iconType: "bike",
      badge: "EXPLORE FREELY",
      badgeColor: "#0EA5E9",
      description: "Rent Activa / Himalayan at the arrival exit for 24h+ local exploration.",
      price: scooterRentFare,
      priceFormatted: `₹${scooterRentFare} / day`,
      durationMinutes: baseMinutes,
      durationFormatted: "24h Flexible",
      waitMinutes: 5,
      howToBoard: "Pick up keys at Royal Brothers / Yatri Bike Desk outside terminal.",
      paymentModes: ["UPI", "Credit/Debit Card (Deposit ₹1,000)"],
      tips: ["Carry original Driving Licence and Aadhaar card for instant verification."]
    });
  }

  // Hotel / Resort Shuttle
  options.push({
    id: "post-hotel-shuttle",
    type: "hotel_shuttle",
    name: "Hotel / Resort Chauffeur Transfer",
    iconType: "shuttle",
    badge: "ZERO WAIT • VIP DOORSTEP",
    badgeColor: "#8B5CF6",
    description: "Personal driver holding name placard at arrivals with direct air-conditioned transfer.",
    price: Math.round(taxiFare * 1.35),
    priceFormatted: `₹${Math.round(taxiFare * 1.35)}`,
    durationMinutes: baseMinutes,
    durationFormatted: `${baseMinutes} min`,
    waitMinutes: 0,
    howToBoard: "Driver meets with your name placard at Exit Gate Pillar #4.",
    paymentModes: ["Bill to Room", "Prepaid UPI"],
    tips: ["Includes complete luggage porter assistance and chilled bottled water."]
  });

  return options;
};

/**
 * Compute total end-to-end doorstep duration
 */
export const calculateDoorstepDuration = (firstMileMins, mainTransitMins, postDeboardMins, bufferMins = 30) => {
  const totalMins = (firstMileMins || 25) + (mainTransitMins || 300) + (postDeboardMins || 25) + bufferMins;
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${hours}h ${mins > 0 ? `${mins}m` : "00m"}`;
};

/**
 * Format currency in Indian Rupees
 */
export const formatINR = (val) => {
  return `₹${Math.round(val || 0).toLocaleString("en-IN")}`;
};
