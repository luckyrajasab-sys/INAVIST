import { FareEstimator } from "./FareEstimator.js";
import { destinationsData } from "../data/destinationsData.js";

export class RouteService {
  /**
   * Approximate road/rail distances between major Indian hubs and destinations
   */
  static getEstimatedDistanceKm(fromCity = "Chennai", toDest = "Kodaikanal") {
    const from = (typeof fromCity === "string" ? fromCity : fromCity?.name || "Chennai").toLowerCase();
    const to = (typeof toDest === "string" ? toDest : toDest?.name || "Kodaikanal").toLowerCase();

    // Specific famous route distances
    if (from.includes("chennai") && to.includes("kodai")) return 525;
    if (from.includes("chennai") && to.includes("ooty")) return 555;
    if (from.includes("chennai") && to.includes("munnar")) return 580;
    if (from.includes("chennai") && to.includes("rameswaram")) return 560;
    if (from.includes("chennai") && to.includes("pondicherry")) return 165;
    if (from.includes("chennai") && to.includes("madurai")) return 460;
    if (from.includes("chennai") && to.includes("bangalore")) return 350;
    if (from.includes("chennai") && to.includes("bengaluru")) return 350;
    if (from.includes("chennai") && to.includes("delhi")) return 2180;
    if (from.includes("chennai") && to.includes("goa")) return 910;

    if (from.includes("bengaluru") || from.includes("bangalore")) {
      if (to.includes("kodai")) return 465;
      if (to.includes("ooty")) return 275;
      if (to.includes("coorg") || to.includes("madikeri")) return 250;
      if (to.includes("munnar")) return 475;
      if (to.includes("hampi")) return 340;
      if (to.includes("gokarna")) return 485;
      if (to.includes("wayanad")) return 280;
      if (to.includes("goa")) return 560;
    }

    if (from.includes("delhi")) {
      if (to.includes("manali")) return 540;
      if (to.includes("shimla")) return 345;
      if (to.includes("rishikesh")) return 240;
      if (to.includes("varanasi")) return 820;
      if (to.includes("jaipur")) return 280;
      if (to.includes("agra")) return 220;
      if (to.includes("leh") || to.includes("ladakh")) return 1020;
      if (to.includes("amritsar")) return 450;
      if (to.includes("dharamshala")) return 475;
      if (to.includes("udaipur")) return 660;
    }

    if (from.includes("mumbai")) {
      if (to.includes("goa")) return 585;
      if (to.includes("pune")) return 150;
      if (to.includes("mahabaleshwar")) return 260;
      if (to.includes("lonavala")) return 85;
      if (to.includes("alibaug")) return 95;
      if (to.includes("shirdi")) return 240;
      if (to.includes("udaipur")) return 750;
    }

    if (from.includes("hyderabad")) {
      if (to.includes("vizag") || to.includes("visakhapatnam")) return 620;
      if (to.includes("tirupati")) return 560;
      if (to.includes("hampi")) return 380;
      if (to.includes("goa")) return 650;
      if (to.includes("araku")) return 680;
    }

    if (from.includes("kolkata")) {
      if (to.includes("darjeeling")) return 615;
      if (to.includes("puri")) return 500;
      if (to.includes("digha")) return 185;
      if (to.includes("sundarbans")) return 110;
      if (to.includes("gangtok")) return 680;
    }

    // Default fallback calculation based on matching state / regional heuristics
    return 480;
  }

  /**
   * Generates Comprehensive Alternatives "Alternative Ways to Reach"
   * e.g. Chennai → Kodaikanal
   * Alt 1: Chennai → Dindigul by Train + Dindigul → Kodaikanal by Bus
   * Alt 2: Chennai → Madurai by Train/Flight + Madurai → Kodaikanal by Cab
   * Alt 3: Chennai → Kodaikanal Direct Luxury Sleeper Bus
   * Alt 4: Chennai → Kodaikanal Self-Drive Highway Roadtrip
   */
  static getAlternativeRoutes({ fromCity = "Chennai", toDestination = "Kodaikanal" }) {
    const from = typeof fromCity === "string" ? fromCity : fromCity?.name || "Chennai";
    const to = typeof toDestination === "string" ? toDestination : toDestination?.name || "Kodaikanal";
    const distanceKm = this.getEstimatedDistanceKm(from, to);

    // KODAIKANAL SPECIALIZED SMART ALTERNATIVES
    if (to.toLowerCase().includes("kodai")) {
      return [
        {
          id: "alt-train-dindigul",
          title: "Train via Dindigul Junction + Connecting Ghat Bus",
          badge: "Best Value",
          badgeColor: "#16A34A",
          recommendationType: "cheapest_comfortable",
          legs: [
            {
              from: `${from} Central/Egmore`,
              to: "Dindigul Junction (DG)",
              mode: "train",
              iconName: "Train",
              duration: "6h 45m",
              cost: 420,
              detail: "Overnight Express (Pandian / Pearl City / Rockfort) in 3AC / SL"
            },
            {
              from: "Dindigul Bus Stand",
              to: "Kodaikanal Bus Stand",
              mode: "bus",
              iconName: "Bus",
              duration: "2h 30m",
              cost: 95,
              detail: "TNSTC Ghat Bus departing every 20 minutes via Batlagundu"
            }
          ],
          totalDuration: "9h 15m",
          totalDurationHours: 9.25,
          totalCost: 515,
          costFormatted: "₹515",
          transfers: 1,
          difficulty: "Easy",
          comfortScore: 8.8,
          highlights: ["Sleep comfortably on overnight train", "Scenic morning mountain ascent by bus", "Zero cab surge pricing"]
        },
        {
          id: "alt-direct-bus",
          title: "Direct AC Sleeper Volvo Bus (Door-to-Door)",
          badge: "Most Convenient",
          badgeColor: "#7C3AED",
          recommendationType: "fastest_direct",
          legs: [
            {
              from: `${from} (CMBT / Boarding Points)`,
              to: "Kodaikanal Lake Road",
              mode: "bus",
              iconName: "Bus",
              duration: "9h 30m",
              cost: 950,
              detail: "Direct Luxury AC Sleeper (KPN / Parveen / IntrCity) — no station changes"
            }
          ],
          totalDuration: "9h 30m",
          totalDurationHours: 9.5,
          totalCost: 950,
          costFormatted: "₹950",
          transfers: 0,
          difficulty: "Very Easy",
          comfortScore: 8.5,
          highlights: ["Zero transfers needed", "Full flat recline sleeper berth", "Board directly near home"]
        },
        {
          id: "alt-train-madurai-cab",
          title: "Superfast Train to Madurai + Scenic Mountain Cab",
          badge: "Fastest & Scenic",
          badgeColor: "#2563EB",
          recommendationType: "fastest",
          legs: [
            {
              from: `${from} Egmore`,
              to: "Madurai Junction (MDU)",
              mode: "train",
              iconName: "Train",
              duration: "5h 50m",
              cost: 1150,
              detail: "Vande Bharat Express (20635) / Tejas Express"
            },
            {
              from: "Madurai Junction",
              to: "Kodaikanal Hotel",
              mode: "cab",
              iconName: "Car",
              duration: "2h 45m",
              cost: 2200,
              detail: "Private Sedan Cab via Vadipatti & Ghats directly to resort"
            }
          ],
          totalDuration: "8h 35m",
          totalDurationHours: 8.6,
          totalCost: 3350,
          costFormatted: "₹3,350",
          transfers: 1,
          difficulty: "Easy",
          comfortScore: 9.6,
          highlights: ["Vande Bharat speed & luxury meals", "Direct hotel doorstep drop in Kodaikanal", "Visit Madurai Meenakshi Temple en route"]
        },
        {
          id: "alt-self-drive",
          title: "Self-Drive Car Roadtrip via NH45 Grand Southern Trunk",
          badge: "Family Freedom",
          badgeColor: "#EA580C",
          recommendationType: "freedom",
          legs: [
            {
              from: `${from} Home`,
              to: "Kodaikanal Hilltop",
              mode: "car",
              iconName: "Car",
              duration: "8h 45m",
              cost: 4600,
              detail: "Via GST Road (NH45) → Trichy → Dindigul → Ghat Road (525 km)"
            }
          ],
          totalDuration: "8h 45m",
          totalDurationHours: 8.75,
          totalCost: 4600,
          costFormatted: "₹4,600 (Fuel + Toll)",
          transfers: 0,
          difficulty: "Moderate (Ghat hairpin bends)",
          comfortScore: 9.0,
          highlights: ["Stop at famous highway dhabas & restaurants", "Own car ready in Kodaikanal for all sightseeing", "Cost split across up to 4 passengers"]
        }
      ];
    }

    // OOTY (NILGIRIS) SPECIALIZED SMART ALTERNATIVES
    if (to.toLowerCase().includes("ooty") || to.toLowerCase().includes("nilgiris")) {
      return [
        {
          id: "alt-toy-train-coonoor",
          title: "Overnight Train to Mettupalayam + UNESCO Nilgiri Toy Train",
          badge: "Heritage Bucketlist",
          badgeColor: "#059669",
          recommendationType: "heritage_scenic",
          legs: [
            {
              from: `${from} Central`,
              to: "Mettupalayam (MTP)",
              mode: "train",
              iconName: "Train",
              duration: "7h 45m",
              cost: 480,
              detail: "Nilgiri Express (12671) in Sleeper / 3AC"
            },
            {
              from: "Mettupalayam Station",
              to: "Udhagamandalam Ooty (UAM)",
              mode: "train",
              iconName: "Train",
              duration: "4h 50m",
              cost: 600,
              detail: "UNESCO Steam Toy Train through 16 tunnels and tea plantations"
            }
          ],
          totalDuration: "12h 35m",
          totalDurationHours: 12.6,
          totalCost: 1080,
          costFormatted: "₹1,080",
          transfers: 1,
          difficulty: "Easy",
          comfortScore: 9.5,
          highlights: ["UNESCO Heritage Steam Engine ride", "Breath-taking Western Ghats cliffs & mist", "Arrives right in Ooty center"]
        },
        {
          id: "alt-coimbatore-bus",
          title: "Train to Coimbatore Junction + Direct AC Ghat Bus / Cab",
          badge: "Fastest Rail Route",
          badgeColor: "#2563EB",
          recommendationType: "fastest",
          legs: [
            {
              from: `${from}`,
              to: "Coimbatore Junction (CBE)",
              mode: "train",
              iconName: "Train",
              duration: "5h 50m",
              cost: 850,
              detail: "Vande Bharat Express / Shatabdi Express"
            },
            {
              from: "Coimbatore Bus Stand",
              to: "Ooty Bus Stand",
              mode: "bus",
              iconName: "Bus",
              duration: "2h 45m",
              cost: 160,
              detail: "Frequent TNSTC AC bus via Mettupalayam & Coonoor"
            }
          ],
          totalDuration: "8h 35m",
          totalDurationHours: 8.6,
          totalCost: 1010,
          costFormatted: "₹1,010",
          transfers: 1,
          difficulty: "Easy",
          comfortScore: 9.0,
          highlights: ["Fastest rail connection", "Multiple bus departures every 15 min", "Great mountain roads"]
        },
        {
          id: "alt-direct-ooty-bus",
          title: "Direct Luxury AC Sleeper Bus",
          badge: "Direct & Easy",
          badgeColor: "#7C3AED",
          recommendationType: "convenient",
          legs: [
            {
              from: `${from}`,
              to: "Ooty Main Bus Stand",
              mode: "bus",
              iconName: "Bus",
              duration: "10h 00m",
              cost: 1050,
              detail: "Direct overnight multi-axle bus"
            }
          ],
          totalDuration: "10h 00m",
          totalDurationHours: 10.0,
          totalCost: 1050,
          costFormatted: "₹1,050",
          transfers: 0,
          difficulty: "Very Easy",
          comfortScore: 8.4,
          highlights: ["Single ticket", "Zero luggage transfers", "Overnight sleep"]
        }
      ];
    }

    // MANALI (HIMACHAL) SPECIALIZED ALTERNATIVES
    if (to.toLowerCase().includes("manali")) {
      return [
        {
          id: "alt-delhi-volvo-manali",
          title: "Direct Multi-Axle Volvo AC Bus (Overnight)",
          badge: "Recommended",
          badgeColor: "#16A34A",
          recommendationType: "best_overall",
          legs: [
            {
              from: "Delhi (Kashmere Gate ISBT / Majnu Ka Tilla)",
              to: "Manali Private Bus Stand",
              mode: "bus",
              iconName: "Bus",
              duration: "12h 30m",
              cost: 1450,
              detail: "HRTC Himsuta / Zingbus AC Multi-Axle semi-sleeper via Chandigarh"
            }
          ],
          totalDuration: "12h 30m",
          totalDurationHours: 12.5,
          totalCost: 1450,
          costFormatted: "₹1,450",
          transfers: 0,
          difficulty: "Easy",
          comfortScore: 8.8,
          highlights: ["Direct overnight travel", "Boarding in evening, arrive for morning tea", "USB charging & blanket"]
        },
        {
          id: "alt-chandigarh-shatabdi-cab",
          title: "Kalka Shatabdi Train to Chandigarh + Scenic Himalayan Cab",
          badge: "Fastest & Comfortable",
          badgeColor: "#2563EB",
          recommendationType: "fastest",
          legs: [
            {
              from: "New Delhi (NDLS)",
              to: "Chandigarh Junction (CDG)",
              mode: "train",
              iconName: "Train",
              duration: "3h 20m",
              cost: 850,
              detail: "Kalka Shatabdi Express (12005) with breakfast served onboard"
            },
            {
              from: "Chandigarh Station",
              to: "Manali Hotel",
              mode: "cab",
              iconName: "Car",
              duration: "7h 00m",
              cost: 3800,
              detail: "Private Sedan cab via Kiratpur-Nerchowk 4-lane expressway & Kullu"
            }
          ],
          totalDuration: "10h 20m",
          totalDurationHours: 10.3,
          totalCost: 4650,
          costFormatted: "₹4,650",
          transfers: 1,
          difficulty: "Easy",
          comfortScore: 9.4,
          highlights: ["High-speed Shatabdi train", "Drive on new Himalayan Expressway", "Doorstep drop at Old Manali hotel"]
        }
      ];
    }

    // GENERAL ADAPTIVE MULTI-HOP ALTERNATIVE ENGINE (For any other pair in India)
    const baseTrainCost = Math.round(distanceKm * 0.95 + 180);
    const baseBusCost = Math.round(distanceKm * 1.35 + 100);
    const directBusDuration = Math.round((distanceKm / 48) + 1.2);
    const railDuration = Math.round((distanceKm / 60) + 1.0);
    const localTransferCost = 220;

    return [
      {
        id: "alt-gen-direct-bus",
        title: `Direct Intercity AC Bus from ${from} to ${to}`,
        badge: "Direct Route",
        badgeColor: "#16A34A",
        recommendationType: "best_overall",
        legs: [
          {
            from: `${from} Main Terminus`,
            to: `${to} Stand`,
            mode: "bus",
            iconName: "Bus",
            duration: `${directBusDuration}h 00m`,
            cost: baseBusCost,
            detail: "Direct state transport / private operator coach"
          }
        ],
        totalDuration: `${directBusDuration}h 00m`,
        totalDurationHours: directBusDuration,
        totalCost: baseBusCost,
        costFormatted: `₹${baseBusCost}`,
        transfers: 0,
        difficulty: "Easy",
        comfortScore: 8.2,
        highlights: ["Single vehicle journey", "No transit changes", "Luggage stays with you"]
      },
      {
        id: "alt-gen-rail-connect",
        title: `Express Train to Nearest Junction + Local Transit to ${to}`,
        badge: "Cheapest & Relaxed",
        badgeColor: "#2563EB",
        recommendationType: "cheapest",
        legs: [
          {
            from: `${from} Railway Station`,
            to: `Nearest Regional Junction for ${to}`,
            mode: "train",
            iconName: "Train",
            duration: `${railDuration}h 00m`,
            cost: baseTrainCost,
            detail: "IRCTC Superfast / Express in 3AC / SL"
          },
          {
            from: "Junction Station Exit",
            to: `${to} Center`,
            mode: "bus",
            iconName: "Bus",
            duration: "1h 30m",
            cost: localTransferCost,
            detail: "Connecting district town bus or shared cab"
          }
        ],
        totalDuration: `${railDuration + 1}h 30m`,
        totalDurationHours: railDuration + 1.5,
        totalCost: baseTrainCost + localTransferCost,
        costFormatted: `₹${baseTrainCost + localTransferCost}`,
        transfers: 1,
        difficulty: "Easy",
        comfortScore: 8.9,
        highlights: ["Sleep on train berths", "Lower total travel cost", "Scenic railway views"]
      },
      {
        id: "alt-gen-self-drive",
        title: `Direct Highway Drive / Private Outstation Cab to ${to}`,
        badge: "Maximum Freedom",
        badgeColor: "#EA580C",
        recommendationType: "fastest",
        legs: [
          {
            from: `${from} Doorstep`,
            to: `${to} Destination`,
            mode: "car",
            iconName: "Car",
            duration: `${Math.round(distanceKm / 65)}h 30m`,
            cost: Math.round(distanceKm * 7.5),
            detail: `National Highway direct drive (~${distanceKm} km)`
          }
        ],
        totalDuration: `${Math.round(distanceKm / 65)}h 30m`,
        totalDurationHours: Math.round(distanceKm / 65) + 0.5,
        totalCost: Math.round(distanceKm * 7.5),
        costFormatted: `₹${Math.round(distanceKm * 7.5).toLocaleString("en-IN")}`,
        transfers: 0,
        difficulty: "Moderate",
        comfortScore: 9.2,
        highlights: ["Start at any time of day or night", "Doorstep pickup and drop", "Split cost across travel group"]
      }
    ];
  }

  /**
   * Generates Curated Route Packages shown separately:
   * Route 1 — Cheapest: Train + Bus
   * Route 2 — Fastest: Flight + Cab (or Superfast Rail + Cab)
   * Route 3 — Comfortable: Cab + Train (or 2AC + Cab)
   * Route 4 — Direct: Direct Bus
   */
  static getCuratedRoutePackages({ fromCity = "Chennai", toDestination = "Kodaikanal", passengers = 1 }) {
    const from = typeof fromCity === "string" ? fromCity : fromCity?.name || "Chennai";
    const to = typeof toDestination === "string" ? toDestination : toDestination?.name || "Kodaikanal";
    const distanceKm = this.getEstimatedDistanceKm(from, to);

    const firstMileCab = 300;
    const firstMileBus = 40;
    const firstMileAuto = 150;

    const trainSleeper = Math.round(distanceKm * 0.45 + 120);
    const train3AC = Math.round(distanceKm * 1.25 + 280);
    const busCost = Math.round(distanceKm * 1.35 + 120);
    const connectingBus = 95;
    const connectingCab = Math.round(distanceKm > 300 ? 2200 : 900);
    const flightCost = Math.round(2400 + distanceKm * 4.2);

    // Route 1 — Cheapest (Train + Bus)
    const r1FirstMile = firstMileBus;
    const r1Main = trainSleeper;
    const r1LastMile = connectingBus;
    const r1Total = r1FirstMile + (r1Main * passengers) + r1LastMile;

    // Route 2 — Fastest (Flight + Cab / Superfast Train + Cab)
    const hasFlight = distanceKm > 250;
    const r2FirstMile = firstMileCab;
    const r2Main = hasFlight ? flightCost : Math.round(train3AC * 1.4);
    const r2LastMile = connectingCab;
    const r2Total = r2FirstMile + (r2Main * passengers) + r2LastMile;

    // Route 3 — Comfortable (Cab + Train)
    const r3FirstMile = firstMileCab;
    const r3Main = train3AC;
    const r3LastMile = Math.round(connectingCab * 0.7);
    const r3Total = r3FirstMile + (r3Main * passengers) + r3LastMile;

    // Route 4 — Direct (Bus)
    const r4FirstMile = firstMileAuto;
    const r4Main = busCost;
    const r4LastMile = 100;
    const r4Total = r4FirstMile + (r4Main * passengers) + r4LastMile;

    return [
      {
        id: "curated-route-1-cheapest",
        routeNumber: 1,
        title: "Route 1 — Cheapest",
        badge: "Cheapest",
        badgeColor: "#16A34A",
        modesUsed: ["bus", "train", "bus"],
        summary: "City Bus + Express Train + Connecting Ghat Bus",
        firstMile: { name: `City Bus from ${from} Home`, cost: r1FirstMile, duration: "35 min" },
        mainTransit: { name: `Express Train to nearest junction`, cost: r1Main, duration: `${Math.round(distanceKm / 60)}h 30m` },
        lastMile: { name: `Connecting Bus to ${to}`, cost: r1LastMile, duration: "2h 30m" },
        totalDuration: `${Math.round(distanceKm / 60) + 3}h 30m`,
        totalCost: r1Total,
        costFormatted: `₹${r1Total.toLocaleString("en-IN")}`,
        transfers: 1,
        recommendationLabel: "Lowest Cost Option"
      },
      {
        id: "curated-route-2-fastest",
        routeNumber: 2,
        title: "Route 2 — Fastest",
        badge: "Fastest",
        badgeColor: "#EA580C",
        modesUsed: hasFlight ? ["cab", "flight", "cab"] : ["cab", "train", "cab"],
        summary: hasFlight ? "Doorstep Cab + Domestic Flight + Airport Hill Taxi" : "Doorstep Cab + Vande Bharat + Private Taxi",
        firstMile: { name: `App Cab to Departure Hub`, cost: r2FirstMile, duration: "25 min" },
        mainTransit: { name: hasFlight ? `Flight to nearest airport` : `Vande Bharat / Superfast Train`, cost: r2Main, duration: hasFlight ? "1h 15m" : `${Math.round(distanceKm / 75)}h 00m` },
        lastMile: { name: `Private Resort Cab to ${to}`, cost: r2LastMile, duration: "2h 15m" },
        totalDuration: hasFlight ? "4h 00m" : `${Math.round(distanceKm / 75) + 2}h 40m`,
        totalCost: r2Total,
        costFormatted: `₹${r2Total.toLocaleString("en-IN")}`,
        transfers: 1,
        recommendationLabel: "Minimum Travel Time"
      },
      {
        id: "curated-route-3-comfortable",
        routeNumber: 3,
        title: "Route 3 — Most Comfortable",
        badge: "Comfortable",
        badgeColor: "#2563EB",
        modesUsed: ["cab", "train", "cab"],
        summary: "Doorstep Sedan + 3AC/2AC Train Berths + Sightseeing Cab",
        firstMile: { name: `Uber/Ola Sedan to Main Station`, cost: r3FirstMile, duration: "25 min" },
        mainTransit: { name: `Overnight 3AC Train with sleeper berths`, cost: r3Main, duration: `${Math.round(distanceKm / 62)}h 15m` },
        lastMile: { name: `Sedan Taxi to Hotel in ${to}`, cost: r3LastMile, duration: "2h 30m" },
        totalDuration: `${Math.round(distanceKm / 62) + 3}h 00m`,
        totalCost: r3Total,
        costFormatted: `₹${r3Total.toLocaleString("en-IN")}`,
        transfers: 1,
        recommendationLabel: "Balanced Rest & Scenery"
      },
      {
        id: "curated-route-4-direct",
        routeNumber: 4,
        title: "Route 4 — Direct (Zero Transfers)",
        badge: "Direct",
        badgeColor: "#7C3AED",
        modesUsed: ["auto", "bus", "auto"],
        summary: "Local Auto + Direct AC Sleeper Bus + Destination Hotel Drop",
        firstMile: { name: `Auto to Boarding Point`, cost: r4FirstMile, duration: "15 min" },
        mainTransit: { name: `Direct Multi-Axle AC Sleeper Bus`, cost: r4Main, duration: `${Math.round(distanceKm / 48)}h 30m` },
        lastMile: { name: `Town Auto to Hotel`, cost: r4LastMile, duration: "15 min" },
        totalDuration: `${Math.round(distanceKm / 48) + 1}h 00m`,
        totalCost: r4Total,
        costFormatted: `₹${r4Total.toLocaleString("en-IN")}`,
        transfers: 0,
        recommendationLabel: "Single Vehicle Journey"
      }
    ];
  }

  /**
   * Sort transport options by criteria:
   * 'cheapest' | 'fastest' | 'most_comfortable' | 'recommended' | 'fewest_transfers'
   */
  static sortTransportOptions(optionsList = [], sortBy = "recommended") {
    const list = [...optionsList];
    switch (sortBy) {
      case "cheapest":
        return list.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
      case "fastest":
        return list.sort((a, b) => (a.durationHours || 0) - (b.durationHours || 0));
      case "most_comfortable":
        return list.sort((a, b) => (b.comfortScore || 0) - (a.comfortScore || 0));
      case "fewest_transfers":
        return list.sort((a, b) => (a.transfers || 0) - (b.transfers || 0));
      case "recommended":
      default: {
        const order = { train: 1, bus: 2, car: 3, cab: 4, flight: 5, bike: 6 };
        return list.sort((a, b) => (order[a.mode] || 9) - (order[b.mode] || 9));
      }
    }
  }

  /**
   * Smart Ranking Engine: Rank transport choices across 4 key badges
   */
  static rankRoutes(mainOptions, firstMileOptions) {
    if (!mainOptions) return {};

    const available = Object.values(mainOptions).filter(Boolean);
    if (!available.length) return {};

    // 1. Cheapest
    const cheapest = [...available].sort((a, b) => a.priceMin - b.priceMin)[0];

    // 2. Fastest
    const fastest = [...available].sort((a, b) => a.durationHours - b.durationHours)[0];

    // 3. Most Comfortable
    const mostComfortable = mainOptions.train || mainOptions.cab || mainOptions.car || available[0];

    // 4. Best Overall (Score based on balance of cost, time, and convenience)
    const bestOverall = mainOptions.train || mainOptions.bus || available[0];

    return {
      bestOverall,
      cheapest,
      fastest,
      mostComfortable
    };
  }

  /**
   * Calculate Complete Door-to-Door Journey Cost
   * First Mile + Main Transit + Last Mile
   */
  static calculateTotalTripCost({
    firstMileCost = 300,
    mainTransitCost = 850,
    lastMileCost = 200,
    passengers = 1
  }) {
    const total = (firstMileCost + (mainTransitCost * passengers) + lastMileCost);
    return {
      firstMileCost,
      mainTransitCost: mainTransitCost * passengers,
      lastMileCost,
      passengers,
      total,
      totalFormatted: `₹${total.toLocaleString("en-IN")}`
    };
  }
}

