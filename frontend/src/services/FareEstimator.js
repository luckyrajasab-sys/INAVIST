// FareEstimator.js — Intelligent Multi-Tier Travel Cost & Fuel Estimator
// Clearly indicates values as 'Estimated' with clean hooks for live API integration.

export class FareEstimator {
  // Fuel Rates (Avg INR per Liter across Indian Metros & States)
  static PETROL_PRICE_PER_LITRE = 101.5;
  static DIESEL_PRICE_PER_LITRE = 89.0;
  static EV_COST_PER_KM = 1.4;

  // Average Fuel Efficiency
  static BIKE_KM_PER_LITRE = 38.0;
  static CAR_PETROL_KM_PER_LITRE = 14.5;
  static CAR_DIESEL_KM_PER_LITRE = 18.0;

  // Standard First-Mile / City Transport Slabs
  static AUTO_BASE_FARE = 30;
  static AUTO_PER_KM_RATE = 15;

  static BIKE_TAXI_BASE_FARE = 25;
  static BIKE_TAXI_PER_KM_RATE = 8;

  static CAB_MINI_BASE_FARE = 60;
  static CAB_MINI_PER_KM = 14;

  static CAB_SEDAN_BASE_FARE = 80;
  static CAB_SEDAN_PER_KM = 17;

  static CAB_SUV_BASE_FARE = 120;
  static CAB_SUV_PER_KM = 22;

  static CITY_BUS_FLAT_OR_SLAB = (distanceKm) => {
    if (distanceKm <= 5) return 15;
    if (distanceKm <= 15) return 25;
    return 40;
  };

  static METRO_SLAB = (distanceKm) => {
    if (distanceKm <= 5) return 15;
    if (distanceKm <= 12) return 30;
    if (distanceKm <= 25) return 50;
    return 65;
  };

  /**
   * Estimate First-Mile options from user start (Home/Hotel) to Transport Terminal (Station/Airport/Bus Stand)
   */
  static estimateFirstMile(distanceKm = 10, passengerCount = 1) {
    const d = Math.max(1, distanceKm);

    // 1. Personal Bike
    const bikeFuelCost = Math.round((d / this.BIKE_KM_PER_LITRE) * this.PETROL_PRICE_PER_LITRE);
    const bikeTimeMins = Math.round(d * 2.2 + 5);

    // 2. Personal Car
    const carFuelCost = Math.round((d / this.CAR_PETROL_KM_PER_LITRE) * this.PETROL_PRICE_PER_LITRE);
    const carTimeMins = Math.round(d * 2.6 + 8);
    const estimatedParking = d > 12 ? 100 : 50; // Terminal parking allowance

    // 3. Auto Rickshaw
    const autoFare = Math.round(this.AUTO_BASE_FARE + (d - 1.5) * this.AUTO_PER_KM_RATE);
    const autoTimeMins = Math.round(d * 2.8 + 6);

    // 4. App Cab (Sedan/Mini)
    const cabMiniFare = Math.round(this.CAB_MINI_BASE_FARE + d * this.CAB_MINI_PER_KM);
    const cabSedanFare = Math.round(this.CAB_SEDAN_BASE_FARE + d * this.CAB_SEDAN_PER_KM);
    const cabTimeMins = Math.round(d * 2.4 + 7);

    // 5. City Bus
    const busFare = this.CITY_BUS_FLAT_OR_SLAB(d) * passengerCount;
    const busTimeMins = Math.round(d * 3.5 + 15);

    // 6. Metro Rail
    const metroFare = this.METRO_SLAB(d) * passengerCount;
    const metroTimeMins = Math.round(d * 1.6 + 10);

    return [
      {
        id: "fm-bike",
        type: "bike",
        name: "Personal Two-Wheeler / Bike",
        category: "Personal Vehicle",
        iconName: "Bike",
        distanceKm: d,
        estimatedTimeMins: bikeTimeMins,
        timeFormatted: `${bikeTimeMins} min`,
        estimatedCost: bikeFuelCost,
        costFormatted: `₹${bikeFuelCost}`,
        fuelEstimate: `₹${bikeFuelCost} petrol`,
        convenience: "High",
        convenienceScore: 8.5,
        availability: "Immediate",
        badge: "Cheapest Solo",
        details: `~${(d / this.BIKE_KM_PER_LITRE).toFixed(1)}L petrol. Station parking ₹20-30/day.`
      },
      {
        id: "fm-auto",
        type: "auto",
        name: "Auto-Rickshaw (Meter/App)",
        category: "Public Ride",
        iconName: "CarFront",
        distanceKm: d,
        estimatedTimeMins: autoTimeMins,
        timeFormatted: `${autoTimeMins} min`,
        estimatedCost: autoFare,
        costFormatted: `₹${autoFare}`,
        convenience: "Medium",
        convenienceScore: 7.2,
        availability: "2-4 min wait",
        badge: null,
        details: "Available at street stand or Ola/Uber/Rapido Auto with upfront fare."
      },
      {
        id: "fm-cab",
        type: "cab",
        name: "App Cab (Ola / Uber Sedan)",
        category: "Doorstep Cab",
        iconName: "Car",
        distanceKm: d,
        estimatedTimeMins: cabTimeMins,
        timeFormatted: `${cabTimeMins} min`,
        estimatedCost: cabSedanFare,
        costFormatted: `₹${cabSedanFare}`,
        convenience: "Very High",
        convenienceScore: 9.6,
        availability: "4-7 min pickup",
        badge: "Recommended",
        details: "Doorstep pickup with boot luggage space for suitcases and family."
      },
      {
        id: "fm-bus",
        type: "bus",
        name: "City Public Bus (MTC / BMTC / DTC)",
        category: "Public Transit",
        iconName: "Bus",
        distanceKm: d,
        estimatedTimeMins: busTimeMins,
        timeFormatted: `${busTimeMins} min`,
        estimatedCost: busFare,
        costFormatted: `₹${busFare}`,
        convenience: "High",
        convenienceScore: 6.8,
        availability: "Every 10-15 min",
        badge: "Cheapest",
        details: `Budget city bus to main station. (₹${this.CITY_BUS_FLAT_OR_SLAB(d)}/person)`
      },
      {
        id: "fm-car",
        type: "car",
        name: "Personal Car (Fuel & Parking)",
        category: "Personal Vehicle",
        iconName: "Car",
        distanceKm: d,
        estimatedTimeMins: carTimeMins,
        timeFormatted: `${carTimeMins} min`,
        estimatedCost: carFuelCost + estimatedParking,
        costFormatted: `₹${carFuelCost + estimatedParking}`,
        fuelEstimate: `₹${carFuelCost} fuel + ₹${estimatedParking} parking`,
        convenience: "High",
        convenienceScore: 8.8,
        availability: "Immediate",
        badge: "Family Drive",
        details: `~${(d / this.CAR_PETROL_KM_PER_LITRE).toFixed(1)}L petrol + terminal parking fee.`
      },
      {
        id: "fm-metro",
        type: "metro",
        name: "Metro / Suburban Rail",
        category: "Rapid Transit",
        iconName: "Train",
        distanceKm: d,
        estimatedTimeMins: metroTimeMins,
        timeFormatted: `${metroTimeMins} min`,
        estimatedCost: metroFare,
        costFormatted: `₹${metroFare}`,
        convenience: "High",
        convenienceScore: 9.0,
        availability: "Every 4-6 min",
        badge: "Fastest in Traffic",
        details: "Zero traffic delays. Direct terminal walkway connectivity at major junctions."
      }
    ];
  }

  /**
   * Helper to resolve nearest transit stations, airports, and connection metadata
   */
  static getDestinationTransitInfo(toName = "Kodaikanal") {
    const dest = toName.toLowerCase();
    if (dest.includes("kodai")) {
      return {
        nearestRailwayStation: "Dindigul Junction (DG) / Kodai Road (KQN) - 80 km away",
        trainConnectionInfo: "Board express trains to Dindigul (DG) / Kodai Road, then take direct connecting ghat bus or taxi (2h 30m) via Batlagundu.",
        nearestAirport: "Madurai International Airport (IXM) - 120 km away",
        airportTransferRequirement: "Requires a 3-hour pre-booked outstation taxi or bus transfer from Madurai Airport to Kodaikanal hills.",
        directTrainAvailable: false,
        directFlightAvailable: false
      };
    }
    if (dest.includes("ooty") || dest.includes("nilgiri") || dest.includes("coonoor")) {
      return {
        nearestRailwayStation: "Mettupalayam (MTP) - 52 km / Coimbatore Junction (CBE) - 88 km",
        trainConnectionInfo: "Take express train to Coimbatore/Mettupalayam, then UNESCO Nilgiri Mountain Toy Train or frequent TNSTC AC buses.",
        nearestAirport: "Coimbatore International Airport (CJB) - 95 km away",
        airportTransferRequirement: "Requires ~3h scenic hill taxi transfer via Mettupalayam & Coonoor ghat road.",
        directTrainAvailable: false,
        directFlightAvailable: false
      };
    }
    if (dest.includes("munnar")) {
      return {
        nearestRailwayStation: "Aluva (AWY) - 110 km / Ernakulam Junction (ERS) - 125 km",
        trainConnectionInfo: "Take train to Ernakulam/Aluva, then KSRTC scenic mountain bus or prepaid taxi via Neriamangalam.",
        nearestAirport: "Cochin International Airport (COK) - 105 km away",
        airportTransferRequirement: "Requires ~3.5h prepaid taxi or KSRTC bus from Nedumbassery (Cochin Airport).",
        directTrainAvailable: false,
        directFlightAvailable: false
      };
    }
    if (dest.includes("manali")) {
      return {
        nearestRailwayStation: "Chandigarh Junction (CDG) - 290 km / Kalka (KLK) - 275 km",
        trainConnectionInfo: "Shatabdi/Vande Bharat Express to Chandigarh, then 7h scenic expressway cab or HRTC Volvo bus.",
        nearestAirport: "Kullu-Bhuntar Airport (KUU) - 50 km / Chandigarh Airport (IXC) - 290 km",
        airportTransferRequirement: "Direct flights to Bhuntar (weather permitting) + 1.5h taxi, or Chandigarh Airport + 7h expressway taxi.",
        directTrainAvailable: false,
        directFlightAvailable: false
      };
    }
    if (dest.includes("leh") || dest.includes("ladakh")) {
      return {
        nearestRailwayStation: "Jammu Tawi (JAT) - 700 km / Chandigarh (CDG) - 750 km",
        trainConnectionInfo: "Train up to Jammu/Chandigarh, followed by 2-day high-altitude highway journey via Manali or Srinagar.",
        nearestAirport: "Kushok Bakula Rimpochee Airport, Leh (IXL) - In City",
        airportTransferRequirement: "Direct flight to Leh, with mandatory 48-hour indoor acclimatization before local travel.",
        directTrainAvailable: false,
        directFlightAvailable: true
      };
    }
    if (dest.includes("goa")) {
      return {
        nearestRailwayStation: "Madgaon Junction (MAO) / Thivim (THVM) - In State",
        trainConnectionInfo: "Direct Konkan Railway Superfast Express / Vande Bharat trains connect directly to Madgaon & Thivim.",
        nearestAirport: "Manohar International Airport, Mopa (GOX) / Dabolim Airport (GOI)",
        airportTransferRequirement: "Direct flights available from all Indian metros with airport taxi or Kadamba EV shuttles to beach zones.",
        directTrainAvailable: true,
        directFlightAvailable: true
      };
    }
    if (dest.includes("varanasi")) {
      return {
        nearestRailwayStation: "Varanasi Junction (BSB) / Pt. Deen Dayal Upadhyaya Jn (DDU) - In City",
        trainConnectionInfo: "Direct Vande Bharat & Superfast Express trains connect directly into Varanasi Junction.",
        nearestAirport: "Lal Bahadur Shastri International Airport (VNS) - 24 km away",
        airportTransferRequirement: "Prepaid taxi or auto transfer (45 min) from Babatpur Airport to Ghats/City center.",
        directTrainAvailable: true,
        directFlightAvailable: true
      };
    }
    // Generic fallback
    return {
      nearestRailwayStation: `${toName} Railway Station / Nearest District Junction`,
      trainConnectionInfo: `Superfast & Express trains to ${toName} regional junction with local bus/cab connectivity.`,
      nearestAirport: `Nearest Regional / State Airport for ${toName}`,
      airportTransferRequirement: `Prepaid taxi or airport shuttle transfer to ${toName} center.`,
      directTrainAvailable: true,
      directFlightAvailable: false
    };
  }

  /**
   * Estimate Main Inter-city Travel Cost & Duration by mode for a given road/rail distance
   * Produces 6 distinct, uncombined comparison cards: Bus, Train, Flight, Cab, Car, Bike
   */
  static estimateMainTransport({ distanceKm = 480, fromName = "Chennai", toName = "Kodaikanal" }) {
    const d = Math.max(20, distanceKm);
    const transitInfo = this.getDestinationTransitInfo(toName);

    // 1. Bus Calculations
    const busDurationHours = (d / 48) + 1.0;
    const busDurationFormatted = `${Math.floor(busDurationHours)}h ${Math.round((busDurationHours % 1) * 60)}m`;
    const busSeaterPrice = Math.round(d * 1.1 + 80);
    const busSleeperPrice = Math.round(d * 1.75 + 150);
    const busVolvoPrice = Math.round(d * 2.2 + 200);

    // 2. Train Calculations
    const trainDurationHours = (d / 62) + 0.75;
    const trainDurationFormatted = `${Math.floor(trainDurationHours)}h ${Math.round((trainDurationHours % 1) * 60)}m`;
    const trainSleeperPrice = Math.round(d * 0.45 + 120);
    const train3ACPrice = Math.round(d * 1.25 + 280);
    const train2ACPrice = Math.round(d * 1.85 + 450);
    const trainVandeBharatPrice = Math.round(d * 2.1 + 350);

    // 3. Flight Calculations
    const hasAirportNearby = d > 200;
    const flightDurationHours = 1.2;
    const flightTransferHours = 2.2;
    const flightTotalDurationHours = flightDurationHours + flightTransferHours;
    const flightDurationFormatted = `${Math.floor(flightTotalDurationHours)}h ${Math.round((flightTotalDurationHours % 1) * 60)}m (~1h 15m flight + airport transfer)`;
    const flightEstimatedPrice = Math.round(2400 + d * 4.2);

    // 4. Cab Calculations (Outstation Taxi)
    const cabDrivingHours = (d / 65) + 0.5;
    const cabDurationFormatted = `${Math.floor(cabDrivingHours)}h ${Math.round((cabDrivingHours % 1) * 60)}m`;
    const cabSedanFare = Math.round(d * 13.5 + 400);
    const cabSUVFare = Math.round(d * 17.5 + 600);

    // 5. Car Calculations (Self-Drive Personal Car)
    const carDrivingHours = (d / 65) + 0.5;
    const carDurationFormatted = `${Math.floor(carDrivingHours)}h ${Math.round((carDrivingHours % 1) * 60)}m`;
    const carFuelCost = Math.round((d / this.CAR_PETROL_KM_PER_LITRE) * this.PETROL_PRICE_PER_LITRE);
    const carTollCost = Math.round(d * 1.35);
    const carTotalEst = carFuelCost + carTollCost;

    // 6. Bike Calculations (Personal / Two-Wheeler)
    const bikeRidingHours = (d / 50) + 1.2;
    const bikeDurationFormatted = `${Math.floor(bikeRidingHours)}h ${Math.round((bikeRidingHours % 1) * 60)}m`;
    const bikeFuelCost = Math.round((d / this.BIKE_KM_PER_LITRE) * this.PETROL_PRICE_PER_LITRE);

    return {
      // MODE 1: BUS
      bus: {
        mode: "bus",
        title: "Interstate & Luxury Bus",
        iconName: "Bus",
        distanceKm: d,
        durationFormatted: busDurationFormatted,
        durationHours: busDurationHours,
        priceMin: busSeaterPrice,
        priceMax: busVolvoPrice,
        priceFormatted: `₹${busSeaterPrice} – ₹${busVolvoPrice}`,
        ticketPriceEstimate: `₹${busSleeperPrice} (AC Sleeper)`,
        departureArrivalInfo: `Frequent departures from ${fromName} (05:00 AM – 11:30 PM). Overnight services arrive at ${toName} next morning around 06:30 AM – 08:30 AM.`,
        departureFrequency: "Every 30–60 mins (Day & Overnight Sleeper)",
        classOptions: [
          { name: "Non-AC Seater", price: busSeaterPrice },
          { name: "AC Semi-Sleeper", price: Math.round((busSeaterPrice + busSleeperPrice) / 2) },
          { name: "AC Sleeper (2+1)", price: busSleeperPrice },
          { name: "Multi-Axle Volvo / Scania", price: busVolvoPrice }
        ],
        changesRequired: 0,
        transfers: 0,
        directRoute: true,
        comfortRating: "High",
        comfortScore: 8.4,
        badge: d < 600 ? "Popular Overnight" : null,
        description: `Direct sleeper & semi-sleeper buses departing from multiple city pickup points in ${fromName} directly to ${toName}.`
      },

      // MODE 2: TRAIN
      train: {
        mode: "train",
        title: "Indian Railways (IRCTC / Vande Bharat)",
        iconName: "Train",
        distanceKm: d,
        durationFormatted: trainDurationFormatted,
        durationHours: trainDurationHours,
        priceMin: trainSleeperPrice,
        priceMax: train2ACPrice,
        priceFormatted: `₹${trainSleeperPrice} – ₹${train2ACPrice}`,
        ticketPriceEstimate: `₹${train3ACPrice} (3rd AC)`,
        nearestStation: transitInfo.nearestRailwayStation,
        connectionInfo: transitInfo.trainConnectionInfo,
        departureArrivalInfo: "Regular daily superfast trains (Morning express & evening overnight sleepers).",
        departureFrequency: "4–8 Daily Express Services",
        classOptions: [
          { name: "Sleeper Class (SL)", price: trainSleeperPrice },
          { name: "3rd AC (3A)", price: train3ACPrice },
          { name: "2nd AC (2A)", price: train2ACPrice },
          { name: "Vande Bharat / Executive", price: trainVandeBharatPrice }
        ],
        changesRequired: transitInfo.directTrainAvailable ? 0 : 1,
        transfers: transitInfo.directTrainAvailable ? 0 : 1,
        directRoute: transitInfo.directTrainAvailable,
        comfortRating: "Very High",
        comfortScore: 9.2,
        badge: "Best Value & Comfort",
        description: `Comfortable reserved berths, onboard meals, scenic rail corridors, and high passenger safety.`
      },

      // MODE 3: FLIGHT
      flight: hasAirportNearby ? {
        mode: "flight",
        title: "Domestic Flight + Transfer",
        iconName: "Plane",
        distanceKm: d,
        durationFormatted: flightDurationFormatted,
        durationHours: flightTotalDurationHours,
        flightDuration: "1h 15m (Air time)",
        priceMin: flightEstimatedPrice,
        priceMax: Math.round(flightEstimatedPrice * 1.45),
        priceFormatted: `₹${flightEstimatedPrice.toLocaleString("en-IN")}+`,
        ticketPriceEstimate: `₹${flightEstimatedPrice.toLocaleString("en-IN")} (Economy)`,
        nearestAirport: transitInfo.nearestAirport,
        airportTransferRequirement: transitInfo.airportTransferRequirement,
        departureArrivalInfo: "Multiple daily morning and evening connections across airlines (IndiGo, Air India).",
        departureFrequency: "Daily flights to nearest airport hub",
        classOptions: [
          { name: "Economy Saver", price: flightEstimatedPrice },
          { name: "Flexi Economy", price: Math.round(flightEstimatedPrice * 1.25) }
        ],
        changesRequired: 1,
        transfers: 1,
        directRoute: transitInfo.directFlightAvailable,
        comfortRating: "Fastest Long-Distance",
        comfortScore: 9.0,
        badge: d > 550 ? "Fastest" : "Premium Option",
        description: `High-speed flight to the nearest airport, followed by doorstep connecting cab transfer to ${toName}.`
      } : null,

      // MODE 4: CAB (Outstation Taxi)
      cab: {
        mode: "cab",
        title: "Outstation Cab / Private Taxi",
        iconName: "Car",
        distanceKm: d,
        durationFormatted: cabDurationFormatted,
        durationHours: cabDrivingHours,
        priceMin: cabSedanFare,
        priceMax: cabSUVFare,
        priceFormatted: `₹${cabSedanFare.toLocaleString("en-IN")} (Sedan) / ₹${cabSUVFare.toLocaleString("en-IN")} (SUV)`,
        ticketPriceEstimate: `₹${cabSedanFare.toLocaleString("en-IN")}`,
        fareBreakdown: {
          sedan: cabSedanFare,
          suv: cabSUVFare,
          ratePerKm: "₹13.50 – ₹17.50 / km",
          driverAllowance: "Included"
        },
        departureArrivalInfo: "Instant or scheduled doorstep pickup anytime 24/7.",
        departureFrequency: "Immediate / Anytime on-demand",
        changesRequired: 0,
        transfers: 0,
        directRoute: true,
        comfortRating: "Maximum Doorstep Convenience",
        comfortScore: 9.5,
        badge: "Door-to-Door Ease",
        description: `Direct chauffeur-driven sedan or SUV from your home doorstep directly to your destination hotel without any luggage transfers.`
      },

      // MODE 5: CAR (Personal Vehicle Self-Drive)
      car: {
        mode: "car",
        title: "Personal Car (Self-Drive)",
        iconName: "Car",
        distanceKm: d,
        durationFormatted: carDurationFormatted,
        durationHours: carDrivingHours,
        priceMin: carTotalEst,
        priceMax: Math.round(carTotalEst * 1.15),
        priceFormatted: `₹${carTotalEst.toLocaleString("en-IN")} (Fuel + Toll)`,
        ticketPriceEstimate: `₹${carTotalEst.toLocaleString("en-IN")} est. total`,
        fuelCostEstimate: carFuelCost,
        tollEstimate: carTollCost,
        breakdown: {
          fuel: carFuelCost,
          toll: carTollCost,
          totalSelfDrive: carTotalEst,
          fuelLiters: Math.round(d / this.CAR_PETROL_KM_PER_LITRE)
        },
        departureArrivalInfo: "Start whenever you choose; take scenic highway breaks at dhabas.",
        departureFrequency: "Flexible / Rider's Schedule",
        changesRequired: 0,
        transfers: 0,
        directRoute: true,
        comfortRating: "High Freedom & Family Friendly",
        comfortScore: 9.1,
        badge: "Family & Scenic",
        description: `Complete freedom of schedule. NH/State highway roadtrip (~${d} km) with car ready for sightseeing upon arrival.`
      },

      // MODE 6: BIKE (Two-Wheeler / Cruiser Ride)
      bike: {
        mode: "bike",
        title: "Two-Wheeler / Motorcycle Ride",
        iconName: "Bike",
        distanceKm: d,
        durationFormatted: bikeDurationFormatted,
        durationHours: bikeRidingHours,
        priceMin: bikeFuelCost,
        priceMax: Math.round(bikeFuelCost * 1.15),
        priceFormatted: `₹${bikeFuelCost} (Estimated Fuel)`,
        ticketPriceEstimate: `₹${bikeFuelCost}`,
        fuelCostEstimate: bikeFuelCost,
        tollEstimate: 0, // Two-wheelers exempt on most Indian NH tolls
        breakdown: {
          fuel: bikeFuelCost,
          fuelLiters: Number((d / this.BIKE_KM_PER_LITRE).toFixed(1)),
          toll: 0
        },
        departureArrivalInfo: "Best to start at early sunrise (05:30 AM) to beat city traffic and enjoy cool highway air.",
        departureFrequency: "Flexible / Rider's Choice",
        changesRequired: 0,
        transfers: 0,
        directRoute: true,
        comfortRating: "Adventure Roadtrip",
        comfortScore: 7.8,
        badge: "Solo Adventure",
        description: `Thrill of the open highway, ghat hairpin bends, mountain breeze, and lowest fuel cost across all personal modes.`
      }
    };
  }

  /**
   * Estimate Last-Mile / Local transport upon arriving at Destination
   */
  static estimateLocalTransport(destinationName = "Kodaikanal") {
    const dest = destinationName.toLowerCase();
    const isHillStation = dest.includes("kodai") || dest.includes("ooty") || dest.includes("munnar") || dest.includes("manali") || dest.includes("shimla") || dest.includes("leh");

    return [
      {
        id: "loc-auto",
        name: "Local Auto-Rickshaw",
        iconName: "CarFront",
        fareRange: isHillStation ? "₹60 – ₹180" : "₹40 – ₹120",
        pricingType: "Per Trip / Meter",
        availability: "Outside Station/Bus Stand 24/7",
        bestFor: "Short town rides, market visits, hotel drop"
      },
      {
        id: "loc-scooter-rental",
        name: "Rental Scooter / Activa",
        iconName: "Bike",
        fareRange: isHillStation ? "₹400 – ₹600 / day" : "₹300 – ₹450 / day",
        pricingType: "24-Hour Rental (Fuel extra)",
        availability: "Rental shops near town center",
        bestFor: "Couples & solo travellers visiting viewpoints freely"
      },
      {
        id: "loc-tourist-cab",
        name: "Local Sightseeing Cab (Sedan/SUV)",
        iconName: "Car",
        fareRange: isHillStation ? "₹1,800 – ₹3,200 / day" : "₹1,500 – ₹2,500 / day",
        pricingType: "Full Day Sightseeing (8h / 80km)",
        availability: "Hotel desk or Taxi Union Stand",
        bestFor: "Families & groups covering all distant tourist spots comfortably"
      },
      {
        id: "loc-town-bus",
        name: "Town Government Bus",
        iconName: "Bus",
        fareRange: "₹10 – ₹35 / trip",
        pricingType: "Per Ticket",
        availability: "Main Bus Terminal every 20-30 min",
        bestFor: "Ultra-budget travellers going to key landmark gates"
      }
    ];
  }
}
