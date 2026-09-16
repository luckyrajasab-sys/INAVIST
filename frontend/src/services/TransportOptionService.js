// TransportOptionService.js — Multi-Tier 4-Option Transport Engine for INAVIST
// Generates 4 meaningfully distinct options (Cheapest, Fastest, Best Value, Premium) per transport mode.
// API-Ready architecture with explicit "Estimated Fare" and "Sample Transport Data" labelling.

import { RouteService } from "./RouteService.js";
import { FareEstimator } from "./FareEstimator.js";

export class TransportOptionService {
  /**
   * Helper to format hour & minutes from a start time and duration minutes
   */
  static computeArrivalTime(depTimeStr = "06:30 AM", durationMins = 360) {
    const parts = depTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!parts) return "02:00 PM";
    let hour = parseInt(parts[1], 10);
    const min = parseInt(parts[2], 10);
    const meridiem = parts[3].toUpperCase();

    if (meridiem === "PM" && hour < 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    const totalMinutes = (hour * 60 + min + durationMins) % (24 * 60);
    let arrHour = Math.floor(totalMinutes / 60);
    const arrMin = totalMinutes % 60;
    const arrMeridiem = arrHour >= 12 ? "PM" : "AM";
    if (arrHour > 12) arrHour -= 12;
    if (arrHour === 0) arrHour = 12;

    const pad = (n) => (n < 10 ? `0${n}` : n);
    return `${pad(arrHour)}:${pad(arrMin)} ${arrMeridiem}`;
  }

  /**
   * Format duration in hours & mins string
   */
  static formatDuration(totalMins) {
    const hours = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);
    return `${hours}h ${mins > 0 ? `${mins}m` : "00m"}`;
  }

  /**
   * Generate 4 Best Options for a specific Transport Mode
   * Modes supported: 'train', 'bus', 'flight', 'cab', 'car', 'bike'
   */
  static getModeOptions({
    mode = "train",
    fromCity = "Chennai",
    toDestination = "Kodaikanal",
    distanceKm = 525,
    passengers = 1,
    travelDate = new Date().toISOString().split("T")[0]
  }) {
    const d = distanceKm || RouteService.getEstimatedDistanceKm(fromCity, toDestination);
    const transitInfo = FareEstimator.getDestinationTransitInfo(toDestination);

    switch (mode) {
      case "train":
        return this.getTrainOptions(fromCity, toDestination, d, transitInfo);
      case "bus":
        return this.getBusOptions(fromCity, toDestination, d);
      case "flight":
        return this.getFlightOptions(fromCity, toDestination, d, transitInfo);
      case "cab":
        return this.getCabOptions(fromCity, toDestination, d, passengers);
      case "car":
        return this.getCarOptions(fromCity, toDestination, d);
      case "bike":
        return this.getBikeOptions(fromCity, toDestination, d);
      default:
        return this.getTrainOptions(fromCity, toDestination, d, transitInfo);
    }
  }

  /**
   * 1. TRAIN OPTIONS (4 Curated Options)
   * - 01 Best Value (Balanced price & time)
   * - 02 Fastest (Shortest travel time / Superfast)
   * - 03 Cheapest (Lowest-cost Sleeper/Express)
   * - 04 Premium (Vande Bharat / 1st AC / Executive)
   */
  static getTrainOptions(from, to, distanceKm, transitInfo) {
    const isKodai = to.toLowerCase().includes("kodai");
    const arrStation = transitInfo.nearestRailwayStation.split("-")[0].trim() || `${to} Junction`;
    const depStation = `${from} Central / Egmore`;

    // Durations
    const fastHours = Math.max(3.5, (distanceKm / 78) + 0.5);
    const bestValueHours = Math.max(4.5, (distanceKm / 68) + 0.8);
    const cheapHours = Math.max(5.5, (distanceKm / 54) + 1.2);

    const fastMins = Math.round(fastHours * 60);
    const bestValueMins = Math.round(bestValueHours * 60);
    const cheapMins = Math.round(cheapHours * 60);

    // Base fare calculations
    const slPrice = Math.max(180, Math.round(distanceKm * 0.55 + 90));
    const ac3Price = Math.max(450, Math.round(distanceKm * 1.15 + 240));
    const ac2Price = Math.max(700, Math.round(distanceKm * 1.65 + 380));
    const premiumPrice = Math.max(1100, Math.round(distanceKm * 2.10 + 480));

    return [
      {
        id: "train-opt-01",
        mode: "train",
        tier: "BEST VALUE",
        tierType: "best_value",
        tierColor: "#16A34A",
        name: isKodai ? "12635 Vaigai Superfast Express" : `${from} Intercity Superfast Exp`,
        operator: "Indian Railways (Southern / Northern Superfast)",
        fromLocation: depStation,
        toLocation: arrStation,
        departureTime: "06:30 AM",
        arrivalTime: this.computeArrivalTime("06:30 AM", bestValueMins),
        duration: this.formatDuration(bestValueMins),
        durationMinutes: bestValueMins,
        stops: "6 Intermediate Stations",
        stopsCount: 6,
        price: ac3Price,
        priceFormatted: `₹${ac3Price.toLocaleString("en-IN")}`,
        category: "3rd AC (3A) / AC Chair Car",
        availableClasses: [
          { name: "3rd AC (3A)", price: ac3Price },
          { name: "2nd AC (2A)", price: ac2Price },
          { name: "Sleeper (SL)", price: slPrice }
        ],
        direct: transitInfo.directTrainAvailable,
        directText: transitInfo.directTrainAvailable
          ? "Direct Superfast Train"
          : `Direct train to ${arrStation} + connecting 2h ghat bus to ${to}`,
        availabilityStatus: "RAC / Confirmed Berths Available",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.7,
        ratingCount: 1420,
        amenities: ["Onboard Pantry Car", "Clean Berths", "Charging Sockets", "Side Reading Lamp"],
        recommendationReason: "Optimal daytime timing with reliable schedule and air-conditioned comfort."
      },
      {
        id: "train-opt-02",
        mode: "train",
        tier: "FASTEST",
        tierType: "fastest",
        tierColor: "#EA580C",
        name: isKodai ? "20601 Vande Bharat Express" : `${from} Tejas / Vande Bharat Exp`,
        operator: "Indian Railways High-Speed Network",
        fromLocation: depStation,
        toLocation: arrStation,
        departureTime: "08:10 AM",
        arrivalTime: this.computeArrivalTime("08:10 AM", fastMins),
        duration: this.formatDuration(fastMins),
        durationMinutes: fastMins,
        stops: "3 Stopages Only (Express Corridor)",
        stopsCount: 3,
        price: Math.round(ac3Price * 1.35),
        priceFormatted: `₹${Math.round(ac3Price * 1.35).toLocaleString("en-IN")}`,
        category: "AC Chair Car (CC) / Superfast",
        availableClasses: [
          { name: "AC Chair Car (CC)", price: Math.round(ac3Price * 1.35) },
          { name: "Executive Chair Car (EC)", price: premiumPrice }
        ],
        direct: transitInfo.directTrainAvailable,
        directText: transitInfo.directTrainAvailable
          ? "Non-Stop Express Run"
          : `Fastest connection to ${arrStation} + priority taxi connect`,
        availabilityStatus: "Available • Current Reservation",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.9,
        ratingCount: 2180,
        amenities: ["130 km/h High Speed", "Bio-Vacuum Toilets", "Gourmet Meal Included", "CCTV Surveillance"],
        recommendationReason: "Shortest transit duration on this rail corridor with minimum intermediate stops."
      },
      {
        id: "train-opt-03",
        mode: "train",
        tier: "CHEAPEST",
        tierType: "cheapest",
        tierColor: "#2563EB",
        name: isKodai ? "12637 Pandian / Rockfort Express" : `${from} Mail Express`,
        operator: "Indian Railways Regular Express",
        fromLocation: depStation,
        toLocation: arrStation,
        departureTime: "05:30 AM",
        arrivalTime: this.computeArrivalTime("05:30 AM", cheapMins),
        duration: this.formatDuration(cheapMins),
        durationMinutes: cheapMins,
        stops: "11 Intermediate Stations",
        stopsCount: 11,
        price: slPrice,
        priceFormatted: `₹${slPrice.toLocaleString("en-IN")}`,
        category: "Sleeper Class (SL) / 2S",
        availableClasses: [
          { name: "Second Seating (2S)", price: Math.round(slPrice * 0.65) },
          { name: "Sleeper Class (SL)", price: slPrice }
        ],
        direct: transitInfo.directTrainAvailable,
        directText: transitInfo.directTrainAvailable
          ? "Direct Regular Train"
          : `Train to ${arrStation} + regular state bus connection`,
        availabilityStatus: "Available • Open General & Tatkal",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.2,
        ratingCount: 960,
        amenities: ["Budget Friendly", "Wide Windows", "Local Vendor Snacks", "Luggage Under Berths"],
        recommendationReason: "Most budget-friendly rail option for solo travellers and cost-conscious backpackers."
      },
      {
        id: "train-opt-04",
        mode: "train",
        tier: "PREMIUM",
        tierType: "premium",
        tierColor: "#7C3AED",
        name: isKodai ? "20601 Vande Bharat Executive / 1st AC Royal" : `${from} Premium Tejas Executive`,
        operator: "Indian Railways Premium Express",
        fromLocation: depStation,
        toLocation: arrStation,
        departureTime: "08:10 AM",
        arrivalTime: this.computeArrivalTime("08:10 AM", fastMins),
        duration: this.formatDuration(fastMins),
        durationMinutes: fastMins,
        stops: "3 Stopages Only",
        stopsCount: 3,
        price: premiumPrice,
        priceFormatted: `₹${premiumPrice.toLocaleString("en-IN")}`,
        category: "Executive Class (EC) / 1st AC Coupe",
        availableClasses: [
          { name: "Executive Class (EC)", price: premiumPrice },
          { name: "1st AC (1A) Private Coupe", price: Math.round(premiumPrice * 1.25) }
        ],
        direct: transitInfo.directTrainAvailable,
        directText: transitInfo.directTrainAvailable
          ? "Direct VIP Service"
          : `Executive Express to ${arrStation} + pre-booked luxury cab`,
        availabilityStatus: "Confirmed Berths • Priority Quota",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.9,
        ratingCount: 840,
        amenities: ["180° Rotating Seats", "Complimentary 3-Course Dining", "Personal Reading Lights", "Priority Attendant"],
        recommendationReason: "Maximum comfort with roomy executive seating, quiet coaches, and premium dining service."
      }
    ];
  }

  /**
   * 2. BUS OPTIONS (4 Curated Options)
   */
  static getBusOptions(from, to, distanceKm) {
    const fastHours = Math.max(4.0, (distanceKm / 58) + 0.5);
    const bestValueHours = Math.max(5.0, (distanceKm / 50) + 0.8);
    const cheapHours = Math.max(6.0, (distanceKm / 42) + 1.2);

    const fastMins = Math.round(fastHours * 60);
    const bestValueMins = Math.round(bestValueHours * 60);
    const cheapMins = Math.round(cheapHours * 60);

    const cheapFare = Math.max(220, Math.round(distanceKm * 0.95 + 80));
    const bestValueFare = Math.max(480, Math.round(distanceKm * 1.45 + 160));
    const fastFare = Math.max(650, Math.round(distanceKm * 1.85 + 220));
    const premiumFare = Math.max(950, Math.round(distanceKm * 2.35 + 350));

    return [
      {
        id: "bus-opt-01",
        mode: "bus",
        tier: "BEST VALUE",
        tierType: "best_value",
        tierColor: "#16A34A",
        name: "IntrCity SmartBus AC Multi-Axle Semi-Sleeper",
        operator: "IntrCity SmartBus / SRS Travels",
        fromLocation: `${from} CMBT / Central Bus Hub`,
        toLocation: `${to} Central Bus Stand`,
        departureTime: "09:30 PM",
        arrivalTime: this.computeArrivalTime("09:30 PM", bestValueMins),
        duration: this.formatDuration(bestValueMins),
        durationMinutes: bestValueMins,
        stops: "3 Highway Rest Stops (Food Plaza)",
        stopsCount: 3,
        price: bestValueFare,
        priceFormatted: `₹${bestValueFare.toLocaleString("en-IN")}`,
        category: "AC Semi-Sleeper (2+2)",
        availableClasses: [
          { name: "AC Semi-Sleeper", price: bestValueFare },
          { name: "AC Sleeper Lower Berth", price: Math.round(bestValueFare * 1.2) }
        ],
        direct: true,
        directText: "Direct Doorstep Bus Service (0 Bus Transfers)",
        availabilityStatus: "14 Berths Available",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.7,
        ratingCount: 1650,
        amenities: ["AC Climate Control", "Individual USB Ports", "Water Bottle Provided", "Live Bus GPS Tracking"],
        recommendationReason: "Overnight timing arriving fresh next morning with high punctuality."
      },
      {
        id: "bus-opt-02",
        mode: "bus",
        tier: "FASTEST",
        tierType: "fastest",
        tierColor: "#EA580C",
        name: "Zingbus Electric / Express Highway Non-Stop",
        operator: "Zingbus Superfast Highway Express",
        fromLocation: `${from} Koyambedu / Outer Ring Road Hub`,
        toLocation: `${to} Main Hill Terminal`,
        departureTime: "10:15 PM",
        arrivalTime: this.computeArrivalTime("10:15 PM", fastMins),
        duration: this.formatDuration(fastMins),
        durationMinutes: fastMins,
        stops: "1 FastTag Highway Fuel Stop",
        stopsCount: 1,
        price: fastFare,
        priceFormatted: `₹${fastFare.toLocaleString("en-IN")}`,
        category: "Express AC Multi-Axle Sleeper",
        availableClasses: [
          { name: "AC Sleeper Single Berth", price: fastFare }
        ],
        direct: true,
        directText: "Express Direct Non-Stop Corridor",
        availabilityStatus: "8 Berths Available",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.8,
        ratingCount: 1120,
        amenities: ["Express Highway Bypass", "Clean Blankets", "Verified Drivers", "SOS Button"],
        recommendationReason: "Shortest highway transit time with single brief rest stop."
      },
      {
        id: "bus-opt-03",
        mode: "bus",
        tier: "CHEAPEST",
        tierType: "cheapest",
        tierColor: "#2563EB",
        name: "State RTC Super Deluxe Express",
        operator: "State Road Transport Corp (SETC / KSRTC / HRTC)",
        fromLocation: `${from} Mofussil Bus Stand`,
        toLocation: `${to} RTC Bus Stand`,
        departureTime: "07:00 PM",
        arrivalTime: this.computeArrivalTime("07:00 PM", cheapMins),
        duration: this.formatDuration(cheapMins),
        durationMinutes: cheapMins,
        stops: "6 En-Route Town Stops",
        stopsCount: 6,
        price: cheapFare,
        priceFormatted: `₹${cheapFare.toLocaleString("en-IN")}`,
        category: "Non-AC Ultra Deluxe 2+2",
        availableClasses: [
          { name: "Non-AC Ultra Deluxe", price: cheapFare }
        ],
        direct: true,
        directText: "Direct RTC Public Route",
        availabilityStatus: "Open Booking Available",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.2,
        ratingCount: 890,
        amenities: ["State Govt Fare", "Spacious Legroom", "Wide Windows", "Direct Hill Route"],
        recommendationReason: "Lowest cost per seat with regular departures from all major government stands."
      },
      {
        id: "bus-opt-04",
        mode: "bus",
        tier: "PREMIUM",
        tierType: "premium",
        tierColor: "#7C3AED",
        name: "NueGo / Volvo 9600 Multi-Axle Luxury Sleeper",
        operator: "Kallada / NueGo / SRS Royal Class",
        fromLocation: `${from} Premium City Lounge Pickup`,
        toLocation: `${to} Hill Top Bus Station`,
        departureTime: "09:45 PM",
        arrivalTime: this.computeArrivalTime("09:45 PM", fastMins),
        duration: this.formatDuration(fastMins),
        durationMinutes: fastMins,
        stops: "2 Premium Food Court Halts",
        stopsCount: 2,
        price: premiumFare,
        priceFormatted: `₹${premiumFare.toLocaleString("en-IN")}`,
        category: "Luxury Volvo 9600 AC Sleeper",
        availableClasses: [
          { name: "Luxury Individual Cabin", price: premiumFare },
          { name: "Double Berths (Couples)", price: Math.round(premiumFare * 1.8) }
        ],
        direct: true,
        directText: "Direct Luxury Cabin Service",
        availabilityStatus: "Filling Fast • 5 Left",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.9,
        ratingCount: 1940,
        amenities: ["Individual TV Screens", "Orthopedic Berths", "Complimentary Snacks & Water", "Pillow & Fleece Quilt"],
        recommendationReason: "State-of-the-art luxury sleeper coach with whisper-quiet air suspension."
      }
    ];
  }

  /**
   * 3. FLIGHT OPTIONS (4 Curated Options)
   */
  static getFlightOptions(from, to, distanceKm, transitInfo) {
    const airMinutes = Math.max(55, Math.round(distanceKm * 0.12 + 40));
    const transferMinutes = 135; // 2h 15m airport connection / check-in
    const totalFlightMinutes = airMinutes + transferMinutes;

    const baseAirFare = Math.max(2800, Math.round(distanceKm * 3.8 + 1400));
    const arrAirport = transitInfo.nearestAirport.split("-")[0].trim() || `${to} Airport`;

    return [
      {
        id: "flight-opt-01",
        mode: "flight",
        tier: "BEST VALUE",
        tierType: "best_value",
        tierColor: "#16A34A",
        name: "IndiGo 6E-6721 Non-Stop + Connecting Shuttle",
        operator: "IndiGo Airlines",
        fromLocation: `${from} Airport (Terminal 1)`,
        toLocation: arrAirport,
        departureTime: "07:30 AM",
        arrivalTime: this.computeArrivalTime("07:30 AM", totalFlightMinutes),
        duration: `${this.formatDuration(totalFlightMinutes)} (${this.formatDuration(airMinutes)} Air + Transfer)`,
        durationMinutes: totalFlightMinutes,
        stops: "Non-stop Flight + 1 Road Transfer",
        stopsCount: 1,
        price: baseAirFare,
        priceFormatted: `₹${baseAirFare.toLocaleString("en-IN")}`,
        category: "Economy Saver (Standard)",
        availableClasses: [
          { name: "Economy Saver", price: baseAirFare },
          { name: "Flexi Plus", price: Math.round(baseAirFare * 1.22) }
        ],
        direct: transitInfo.directFlightAvailable,
        directText: transitInfo.directFlightAvailable
          ? "Direct Non-Stop Flight"
          : `Flight to ${arrAirport} + 2h connecting airport taxi to ${to}`,
        availabilityStatus: "9 Seats Left at this Fare",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.8,
        ratingCount: 3200,
        baggageInfo: "7 kg Cabin Baggage + 15 kg Check-in Included",
        amenities: ["Web Check-In", "On-time Guarantee", "Standard Seat Selection", "Beverage on purchase"],
        recommendationReason: "Best combination of early departure, high airline punctuality, and included baggage."
      },
      {
        id: "flight-opt-02",
        mode: "flight",
        tier: "FASTEST",
        tierType: "fastest",
        tierColor: "#EA580C",
        name: "Air India Express IX-512 Superfast Morning Connect",
        operator: "Air India Express",
        fromLocation: `${from} Airport (Terminal 2)`,
        toLocation: arrAirport,
        departureTime: "06:10 AM",
        arrivalTime: this.computeArrivalTime("06:10 AM", totalFlightMinutes - 15),
        duration: `${this.formatDuration(totalFlightMinutes - 15)} (${this.formatDuration(airMinutes - 10)} Air + Transfer)`,
        durationMinutes: totalFlightMinutes - 15,
        stops: "Direct Non-Stop Air Run",
        stopsCount: 0,
        price: Math.round(baseAirFare * 1.18),
        priceFormatted: `₹${Math.round(baseAirFare * 1.18).toLocaleString("en-IN")}`,
        category: "Express Jet Corridor",
        availableClasses: [
          { name: "Express Saver", price: Math.round(baseAirFare * 1.18) }
        ],
        direct: transitInfo.directFlightAvailable,
        directText: transitInfo.directFlightAvailable
          ? "Direct Jet Route"
          : `Direct Morning Flight to ${arrAirport} + FastTrack Cab`,
        availabilityStatus: "Available • 6 Seats",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.7,
        ratingCount: 1840,
        baggageInfo: "7 kg Cabin + 15 kg Check-in Included",
        amenities: ["Fast Track Security Entry", "Direct Airport Runway Access", "Hot Meal Pre-order"],
        recommendationReason: "Earliest touch-down at nearest airport with minimal runway holding time."
      },
      {
        id: "flight-opt-03",
        mode: "flight",
        tier: "CHEAPEST",
        tierType: "cheapest",
        tierColor: "#2563EB",
        name: "SpiceJet / Akasa Air Early Bird Special",
        operator: "Akasa Air / SpiceJet",
        fromLocation: `${from} Airport (Terminal 1)`,
        toLocation: arrAirport,
        departureTime: "05:40 AM",
        arrivalTime: this.computeArrivalTime("05:40 AM", totalFlightMinutes + 20),
        duration: `${this.formatDuration(totalFlightMinutes + 20)} (${this.formatDuration(airMinutes + 10)} Air + Transfer)`,
        durationMinutes: totalFlightMinutes + 20,
        stops: "Non-stop + 1 Airport Shuttle",
        stopsCount: 1,
        price: Math.round(baseAirFare * 0.82),
        priceFormatted: `₹${Math.round(baseAirFare * 0.82).toLocaleString("en-IN")}`,
        category: "Super Saver Economy",
        availableClasses: [
          { name: "Super Saver (Cabin Bag Only)", price: Math.round(baseAirFare * 0.82) },
          { name: "Standard Check-in", price: Math.round(baseAirFare * 0.95) }
        ],
        direct: transitInfo.directFlightAvailable,
        directText: "Early Bird Saver Flight",
        availabilityStatus: "Available",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.3,
        ratingCount: 1420,
        baggageInfo: "7 kg Cabin Baggage (Check-in available at ₹450 add-on)",
        amenities: ["Lowest Flight Cost", "USB Power at Seat", "Free Water"],
        recommendationReason: "Unbeatable flight base fare for light travellers carrying cabin backpacks."
      },
      {
        id: "flight-opt-04",
        mode: "flight",
        tier: "PREMIUM",
        tierType: "premium",
        tierColor: "#7C3AED",
        name: "Vistara / Air India Prime Class + Private Chauffeur",
        operator: "Vistara Prime / Air India Full Service",
        fromLocation: `${from} Airport (VIP Lounge Access)`,
        toLocation: arrAirport,
        departureTime: "09:00 AM",
        arrivalTime: this.computeArrivalTime("09:00 AM", totalFlightMinutes),
        duration: `${this.formatDuration(totalFlightMinutes)} (Full Service + VIP Cab)`,
        durationMinutes: totalFlightMinutes,
        stops: "Non-Stop + Doorstep Dedicated Luxury Cab",
        stopsCount: 1,
        price: Math.round(baseAirFare * 1.85),
        priceFormatted: `₹${Math.round(baseAirFare * 1.85).toLocaleString("en-IN")}`,
        category: "Premium Economy / Business Class",
        availableClasses: [
          { name: "Premium Economy", price: Math.round(baseAirFare * 1.85) },
          { name: "Business Class", price: Math.round(baseAirFare * 2.6) }
        ],
        direct: transitInfo.directFlightAvailable,
        directText: "Direct Full Service + Dedicated Hill Taxi",
        availabilityStatus: "Available (Priority Berths)",
        statusNote: "Sample Transport Data • Estimated Fare",
        rating: 4.9,
        ratingCount: 980,
        baggageInfo: "10 kg Cabin + 25 kg Check-in + Priority Baggage Delivery",
        amenities: ["Airport Lounge Access", "Complimentary Gourmet Multi-Course Meal", "Extra Legroom (34-inch)", "Priority Boarding"],
        recommendationReason: "Comprehensive executive luxury with fine dining and door-to-door luggage handling."
      }
    ];
  }

  /**
   * 4. CAB OPTIONS (4 Curated Options)
   */
  static getCabOptions(from, to, distanceKm, passengers) {
    const driveHours = (distanceKm / 65) + 0.5;
    const fastDriveHours = (distanceKm / 72) + 0.3;
    const economyDriveHours = (distanceKm / 60) + 0.8;

    const driveMins = Math.round(driveHours * 60);
    const fastDriveMins = Math.round(fastDriveHours * 60);
    const economyDriveMins = Math.round(economyDriveHours * 60);

    const miniFare = Math.round(distanceKm * 11.5 + 350);
    const sedanFare = Math.round(distanceKm * 14.0 + 450);
    const fastSedanFare = Math.round(distanceKm * 15.5 + 500);
    const suvFare = Math.round(distanceKm * 19.0 + 750);

    return [
      {
        id: "cab-opt-01",
        mode: "cab",
        tier: "BEST VALUE",
        tierType: "best_value",
        tierColor: "#16A34A",
        name: "Sedan (Maruti Dzire / Toyota Etios / Aura)",
        operator: "Yatri Verified / Ola Outstation Prime Sedan",
        fromLocation: `Doorstep Pickup anywhere in ${from}`,
        toLocation: `Hotel / Resort Drop in ${to}`,
        departureTime: "Immediate / Scheduled Anytime",
        arrivalTime: this.computeArrivalTime("06:00 AM", driveMins),
        duration: this.formatDuration(driveMins),
        durationMinutes: driveMins,
        stops: "Driver Meal Rest Stop (Flexible)",
        stopsCount: 1,
        price: sedanFare,
        priceFormatted: `₹${sedanFare.toLocaleString("en-IN")}`,
        category: "4-Seater AC Sedan (2 Big + 2 Small Bags)",
        availableClasses: [
          { name: "AC Sedan (Dzire)", price: sedanFare }
        ],
        direct: true,
        directText: "Direct Door-to-Door Outstation Ride",
        availabilityStatus: "Instant 5-10 min Pickup",
        statusNote: "Sample Transport Data • Estimated Fare",
        eta: "5–10 mins to pickup",
        distance: `~${distanceKm} km`,
        rating: 4.8,
        ratingCount: 2450,
        amenities: ["Air Conditioned", "Trunk Boot for 3 Bags", "Highway Trained Driver", "Driver Allowance Included"],
        recommendationReason: "Most preferred choice for couples & small families wanting doorstep comfort."
      },
      {
        id: "cab-opt-02",
        mode: "cab",
        tier: "FASTEST",
        tierType: "fastest",
        tierColor: "#EA580C",
        name: "Prime FastTrack Sedan (Expressway Corridor Driver)",
        operator: "Yatri Express / Highway Special",
        fromLocation: `Doorstep Express Pickup, ${from}`,
        toLocation: `Direct Destination Gate, ${to}`,
        departureTime: "Immediate / On-Demand",
        arrivalTime: this.computeArrivalTime("06:00 AM", fastDriveMins),
        duration: this.formatDuration(fastDriveMins),
        durationMinutes: fastDriveMins,
        stops: "Zero Traffic Bottlenecks (FastTag Automated)",
        stopsCount: 0,
        price: fastSedanFare,
        priceFormatted: `₹${fastSedanFare.toLocaleString("en-IN")}`,
        category: "Priority Express Sedan (Fast Corridor)",
        availableClasses: [
          { name: "FastTrack Sedan", price: fastSedanFare }
        ],
        direct: true,
        directText: "Non-Stop Expressway Corridor",
        availabilityStatus: "Immediate Dispatch Ready",
        statusNote: "Sample Transport Data • Estimated Fare",
        eta: "3–7 mins to pickup",
        distance: `~${distanceKm} km`,
        rating: 4.9,
        ratingCount: 1560,
        amenities: ["FastTag Automated Toll Lanes", "Dedicated Senior Chauffeur", "Water & Phone Chargers", "GPS Emergency Tracking"],
        recommendationReason: "Shortest road driving time with optimized bypass routing and priority lanes."
      },
      {
        id: "cab-opt-03",
        mode: "cab",
        tier: "CHEAPEST",
        tierType: "cheapest",
        tierColor: "#2563EB",
        name: "Economy Mini (WagonR / Tata Tiago / Celerio)",
        operator: "Yatri Budget Outstation Mini",
        fromLocation: `Pickup Point / Home, ${from}`,
        toLocation: `Main Center, ${to}`,
        departureTime: "Immediate / Anytime",
        arrivalTime: this.computeArrivalTime("06:00 AM", economyDriveMins),
        duration: this.formatDuration(economyDriveMins),
        durationMinutes: economyDriveMins,
        stops: "Highway Rest Stops",
        stopsCount: 2,
        price: miniFare,
        priceFormatted: `₹${miniFare.toLocaleString("en-IN")}`,
        category: "3-4 Seater Hatchback (1 Big Bag)",
        availableClasses: [
          { name: "Mini Hatchback", price: miniFare }
        ],
        direct: true,
        directText: "Direct Economy Cab",
        availabilityStatus: "Available Nearby",
        statusNote: "Sample Transport Data • Estimated Fare",
        eta: "8–12 mins to pickup",
        distance: `~${distanceKm} km`,
        rating: 4.4,
        ratingCount: 1100,
        amenities: ["AC Hatchback", "Affordable Per-Km Fare", "Zero Cancellation Guarantee"],
        recommendationReason: "Lowest cost private cab option for solo travellers and compact luggage."
      },
      {
        id: "cab-opt-04",
        mode: "cab",
        tier: "PREMIUM",
        tierType: "premium",
        tierColor: "#7C3AED",
        name: "Luxury SUV (Toyota Innova Crysta / Ertiga ZXi)",
        operator: "Yatri Prime Luxury Outstation Fleet",
        fromLocation: `Doorstep Pickup with Baggage Assist, ${from}`,
        toLocation: `Hotel Doorstep Check-in, ${to}`,
        departureTime: "Scheduled / Immediate",
        arrivalTime: this.computeArrivalTime("06:00 AM", driveMins),
        duration: this.formatDuration(driveMins),
        durationMinutes: driveMins,
        stops: "Scenic Break / Premium Rest Plaza",
        stopsCount: 1,
        price: suvFare,
        priceFormatted: `₹${suvFare.toLocaleString("en-IN")}`,
        category: "6-7 Seater Luxury MUV / SUV (Captain Seats)",
        availableClasses: [
          { name: "Innova Crysta 6-Seater", price: suvFare },
          { name: "Urbania / Fortuner Premium", price: Math.round(suvFare * 1.45) }
        ],
        direct: true,
        directText: "Direct VIP Family SUV",
        availabilityStatus: "Available • Top-Rated Fleet",
        statusNote: "Sample Transport Data • Estimated Fare",
        eta: "10–15 mins to pickup",
        distance: `~${distanceKm} km`,
        rating: 4.95,
        ratingCount: 3100,
        amenities: ["Plush Reclining Captain Seats", "Roof Luggage Carrier", "Rear AC Vents", "High Ghat Ground Clearance"],
        recommendationReason: "Ultimate luxury and safety for family vacations with maximum luggage capacity."
      }
    ];
  }

  /**
   * 5. CAR OPTIONS (4 Curated Self-Drive Route Options)
   */
  static getCarOptions(from, to, distanceKm) {
    const carKmpl = 14.5;
    const fuelPrice = 101.5;

    // Route 1: NH Expressway (Best Value)
    const d1 = distanceKm;
    const f1 = Math.round((d1 / carKmpl) * fuelPrice);
    const t1 = Math.round(d1 * 1.35);
    const tot1 = f1 + t1;
    const mins1 = Math.round(((d1 / 65) + 0.5) * 60);

    // Route 2: Fast Speedway Corridor
    const d2 = Math.round(distanceKm * 1.04);
    const f2 = Math.round((d2 / (carKmpl - 0.5)) * fuelPrice);
    const t2 = Math.round(d2 * 1.65);
    const tot2 = f2 + t2;
    const mins2 = Math.round(((d2 / 74) + 0.3) * 60);

    // Route 3: State Highway / Country Road (Cheapest Toll)
    const d3 = Math.round(distanceKm * 0.96);
    const f3 = Math.round((d3 / (carKmpl + 0.5)) * fuelPrice);
    const t3 = Math.round(d3 * 0.35);
    const tot3 = f3 + t3;
    const mins3 = Math.round(((d3 / 52) + 1.0) * 60);

    // Route 4: Scenic Ghat Viewpoint Corridor (Premium)
    const d4 = Math.round(distanceKm * 1.06);
    const f4 = Math.round((d4 / 13.0) * fuelPrice);
    const t4 = Math.round(d4 * 1.40);
    const tot4 = f4 + t4;
    const mins4 = Math.round(((d4 / 58) + 1.2) * 60);

    return [
      {
        id: "car-opt-01",
        mode: "car",
        tier: "BEST VALUE",
        tierType: "best_value",
        tierColor: "#16A34A",
        name: "Primary National Highway (4-Lane NH Expressway)",
        operator: "Personal Car Self-Drive (NH Corridor)",
        fromLocation: `${from} Home Driveway`,
        toLocation: `${to} Hotel Parking`,
        departureTime: "Flexible (Suggested 06:00 AM)",
        arrivalTime: this.computeArrivalTime("06:00 AM", mins1),
        duration: this.formatDuration(mins1),
        durationMinutes: mins1,
        stops: "3 Recommended Highway Food Plazas",
        stopsCount: 3,
        price: tot1,
        priceFormatted: `₹${tot1.toLocaleString("en-IN")}`,
        category: "Self-Drive Car (Petrol/Diesel/EV)",
        fuelCost: f1,
        tollCost: t1,
        fuelLiters: Math.round(d1 / carKmpl),
        distance: `~${d1} km`,
        direct: true,
        directText: "Direct Self-Drive NH Route",
        availabilityStatus: "Instant Departure • User Controlled",
        statusNote: "Sample Transport Data • Estimated Fuel & Toll",
        rating: 4.8,
        ratingCount: 1400,
        amenities: ["Smooth 4-Lane Tarmac", "Frequent Petrol Pumps & EV Chargers", "Dhabas & Rest Plazas", "FastTag Enabled"],
        recommendationReason: "Best balance between smooth driving surface, safety, and moderate toll charges."
      },
      {
        id: "car-opt-02",
        mode: "car",
        tier: "FASTEST",
        tierType: "fastest",
        tierColor: "#EA580C",
        name: "Access-Controlled High-Speed Toll Corridor",
        operator: "Personal Car Self-Drive (Expressway Special)",
        fromLocation: `${from} Outer Ring Road Expressway`,
        toLocation: `${to} Main Hill Access Road`,
        departureTime: "Flexible (Suggested 05:30 AM)",
        arrivalTime: this.computeArrivalTime("05:30 AM", mins2),
        duration: this.formatDuration(mins2),
        durationMinutes: mins2,
        stops: "1 Fast Express Fuel Stop",
        stopsCount: 1,
        price: tot2,
        priceFormatted: `₹${tot2.toLocaleString("en-IN")}`,
        category: "Express High-Speed Route",
        fuelCost: f2,
        tollCost: t2,
        fuelLiters: Math.round(d2 / (carKmpl - 0.5)),
        distance: `~${d2} km`,
        direct: true,
        directText: "Direct High-Speed Corridor",
        availabilityStatus: "Instant Departure",
        statusNote: "Sample Transport Data • Estimated Fuel & Toll",
        rating: 4.9,
        ratingCount: 960,
        amenities: ["100-120 km/h Speed Limit", "Zero City Congestion", "Modern Rest Plazas", "High Speed Toll Gates"],
        recommendationReason: "Shortest driving time with wide multi-lane access control and bypasses."
      },
      {
        id: "car-opt-03",
        mode: "car",
        tier: "CHEAPEST",
        tierType: "cheapest",
        tierColor: "#2563EB",
        name: "State Highway & Country Route (Low Toll Road)",
        operator: "Personal Car Self-Drive (State Highway)",
        fromLocation: `${from} City Exit`,
        toLocation: `${to} Gateway`,
        departureTime: "Flexible (Suggested 06:30 AM)",
        arrivalTime: this.computeArrivalTime("06:30 AM", mins3),
        duration: this.formatDuration(mins3),
        durationMinutes: mins3,
        stops: "Local Town Crossings & Tea Stalls",
        stopsCount: 5,
        price: tot3,
        priceFormatted: `₹${tot3.toLocaleString("en-IN")}`,
        category: "Economy Route (Minimal Tolls)",
        fuelCost: f3,
        tollCost: t3,
        fuelLiters: Math.round(d3 / (carKmpl + 0.5)),
        distance: `~${d3} km`,
        direct: true,
        directText: "Direct State Roadway",
        availabilityStatus: "Instant Departure",
        statusNote: "Sample Transport Data • Estimated Fuel & Toll",
        rating: 4.3,
        ratingCount: 680,
        amenities: ["Save ₹500+ on Highway Tolls", "Authentic Village Scenery", "Fresh Local Produce Stalls"],
        recommendationReason: "Lowest total expense by avoiding expensive toll plazas while exploring countryside."
      },
      {
        id: "car-opt-04",
        mode: "car",
        tier: "PREMIUM",
        tierType: "premium",
        tierColor: "#7C3AED",
        name: "Scenic Ghat & Mountain Viewpoint Corridor",
        operator: "Personal Car Roadtrip Experience",
        fromLocation: `${from} Home`,
        toLocation: `${to} Resort Viewpoint`,
        departureTime: "Flexible (Suggested 06:00 AM Sunrise)",
        arrivalTime: this.computeArrivalTime("06:00 AM", mins4),
        duration: this.formatDuration(mins4),
        durationMinutes: mins4,
        stops: "4 Scenic Viewpoints & Coffee Estates",
        stopsCount: 4,
        price: tot4,
        priceFormatted: `₹${tot4.toLocaleString("en-IN")}`,
        category: "Scenic Leisure Roadtrip",
        fuelCost: f4,
        tollCost: t4,
        fuelLiters: Math.round(d4 / 13.0),
        distance: `~${d4} km`,
        direct: true,
        directText: "Scenic Roadtrip with Viewpoints",
        availabilityStatus: "Instant Departure",
        statusNote: "Sample Transport Data • Estimated Fuel & Toll",
        rating: 4.95,
        ratingCount: 1850,
        amenities: ["Breathtaking Valley Views", "Hairpin Bend Photography Halts", "Famous Hill Dhabas", "Pleasant Weather Drives"],
        recommendationReason: "Unforgettable roadtrip experience with lush forests, waterfalls, and panoramic halts."
      }
    ];
  }

  /**
   * 6. BIKE OPTIONS (4 Curated Motorcycle / Cruiser Riding Strategies)
   */
  static getBikeOptions(from, to, distanceKm) {
    const bikeKmpl = 38.0;
    const fuelPrice = 101.5;

    const baseFuel = Math.round((distanceKm / bikeKmpl) * fuelPrice);
    const ecoFuel = Math.round((distanceKm / 46.0) * fuelPrice);
    const adventureFuel = Math.round(((distanceKm * 1.06) / 33.0) * fuelPrice);

    const baseMins = Math.round(((distanceKm / 52) + 1.2) * 60);
    const fastMins = Math.round(((distanceKm / 60) + 0.8) * 60);
    const ecoMins = Math.round(((distanceKm / 46) + 1.5) * 60);
    const advMins = Math.round(((distanceKm / 48) + 2.0) * 60);

    return [
      {
        id: "bike-opt-01",
        mode: "bike",
        tier: "BEST VALUE",
        tierType: "best_value",
        tierColor: "#16A34A",
        name: "Standard National Highway Cruiser Route",
        operator: "Cruiser Motorcycle (Royal Enfield / Dominar / Classic)",
        fromLocation: `${from} Start Point`,
        toLocation: `${to} Town Square`,
        departureTime: "06:00 AM (Cool Morning Start)",
        arrivalTime: this.computeArrivalTime("06:00 AM", baseMins),
        duration: this.formatDuration(baseMins),
        durationMinutes: baseMins,
        stops: "3 Fuel & Hydration Halts (Every 150 km)",
        stopsCount: 3,
        price: baseFuel,
        priceFormatted: `₹${baseFuel.toLocaleString("en-IN")} (Estimated Fuel)`,
        category: "Highway Cruiser Ride (Tolls ₹0 Exempt)",
        fuelCost: baseFuel,
        tollCost: 0,
        fuelLiters: Number((distanceKm / bikeKmpl).toFixed(1)),
        distance: `~${distanceKm} km`,
        suggestedRoute: "NH 4-Lane Corridor via Main Highway Bypass",
        direct: true,
        directText: "Direct Motorcycle Route (NH Tolls Free for 2W)",
        availabilityStatus: "Instant Departure • Rider's Schedule",
        statusNote: "Sample Transport Data • Estimated Fuel Cost",
        rating: 4.8,
        ratingCount: 1220,
        amenities: ["Zero Highway Toll Fees", "Clean Fuel Stations", "Spacious Highway Shoulders", "Biker Cafes En-Route"],
        recommendationReason: "Balanced cruising speed, steady fuel efficiency, and safe highway corridors."
      },
      {
        id: "bike-opt-02",
        mode: "bike",
        tier: "FASTEST",
        tierType: "fastest",
        tierColor: "#EA580C",
        name: "Early Bird Sunrise Express Run",
        operator: "Performance Motorcycle / Sports Tourer",
        fromLocation: `${from} City Outskirts`,
        toLocation: `${to} Entry Gate`,
        departureTime: "05:00 AM (Dawn Beat-the-Traffic Run)",
        arrivalTime: this.computeArrivalTime("05:00 AM", fastMins),
        duration: this.formatDuration(fastMins),
        durationMinutes: fastMins,
        stops: "1 Quick Refuel & Espresso Halt",
        stopsCount: 1,
        price: Math.round(baseFuel * 1.08),
        priceFormatted: `₹${Math.round(baseFuel * 1.08).toLocaleString("en-IN")} (Estimated Fuel)`,
        category: "Express Tourer Ride",
        fuelCost: Math.round(baseFuel * 1.08),
        tollCost: 0,
        fuelLiters: Number(((distanceKm * 1.02) / 36.0).toFixed(1)),
        distance: `~${distanceKm} km`,
        suggestedRoute: "Expressway Flyovers & Bypass Corridors",
        direct: true,
        directText: "Non-Stop Early Morning Run",
        availabilityStatus: "Instant Departure",
        statusNote: "Sample Transport Data • Estimated Fuel Cost",
        rating: 4.9,
        ratingCount: 880,
        amenities: ["Zero Traffic Congestion at Dawn", "Cool Engine Temperatures", "Empty Highway Stretches"],
        recommendationReason: "Beat all city signals and highway congestion by starting at the crack of dawn."
      },
      {
        id: "bike-opt-03",
        mode: "bike",
        tier: "CHEAPEST",
        tierType: "cheapest",
        tierColor: "#2563EB",
        name: "Steady Throttle Economy Commuter Run",
        operator: "Economy Bike / 125-150cc Commuter",
        fromLocation: `${from}`,
        toLocation: `${to}`,
        departureTime: "06:30 AM",
        arrivalTime: this.computeArrivalTime("06:30 AM", ecoMins),
        duration: this.formatDuration(ecoMins),
        durationMinutes: ecoMins,
        stops: "4 Leisure Tea Stalls",
        stopsCount: 4,
        price: ecoFuel,
        priceFormatted: `₹${ecoFuel.toLocaleString("en-IN")} (Estimated Fuel)`,
        category: "Ultra-High Mileage Run (45+ km/L)",
        fuelCost: ecoFuel,
        tollCost: 0,
        fuelLiters: Number((distanceKm / 46.0).toFixed(1)),
        distance: `~${distanceKm} km`,
        suggestedRoute: "National & State Highway Mixed Route",
        direct: true,
        directText: "Ultra Budget Solo Travel",
        availabilityStatus: "Instant Departure",
        statusNote: "Sample Transport Data • Estimated Fuel Cost",
        rating: 4.4,
        ratingCount: 750,
        amenities: ["Lowest Possible Travel Expense Across All Modes", "45-50 km/L High Mileage", "Free Tolls"],
        recommendationReason: "Unbeatable lowest travel expenditure for solo explorers."
      },
      {
        id: "bike-opt-04",
        mode: "bike",
        tier: "PREMIUM",
        tierType: "premium",
        tierColor: "#7C3AED",
        name: "Scenic Ghat & Hairpin Adventure Corridor",
        operator: "Adventure Tourer / Himalayan / BMW GS / ADV",
        fromLocation: `${from} Start`,
        toLocation: `${to} Mountain Viewpoint`,
        departureTime: "05:30 AM",
        arrivalTime: this.computeArrivalTime("05:30 AM", advMins),
        duration: this.formatDuration(advMins),
        durationMinutes: advMins,
        stops: "5 Hairpin Photography & Waterfall Stops",
        stopsCount: 5,
        price: adventureFuel,
        priceFormatted: `₹${adventureFuel.toLocaleString("en-IN")} (Estimated Fuel)`,
        category: "Adventure Off-Road & Ghat Tour",
        fuelCost: adventureFuel,
        tollCost: 0,
        fuelLiters: Number(((distanceKm * 1.06) / 33.0).toFixed(1)),
        distance: `~${Math.round(distanceKm * 1.06)} km`,
        suggestedRoute: "Forest Ghat Road & Hairpin Bend Mountain Corridor",
        direct: true,
        directText: "Scenic Adventure Roadtrip",
        availabilityStatus: "Instant Departure",
        statusNote: "Sample Transport Data • Estimated Fuel Cost",
        rating: 4.95,
        ratingCount: 1650,
        amenities: ["Breathtaking Hairpin Turns", "Mountain Mist & Waterfall Stops", "Biker Community Hubs"],
        recommendationReason: "The pinnacle motorcycling experience with hairpin bends, tea estates, and cool mountain breezes."
      }
    ];
  }

  /**
   * Sort a list of transport options based on user selected criteria
   * Criteria: 'best_overall' | 'price_low_high' | 'price_high_low' | 'fastest' | 'best_rated'
   */
  static sortOptions(options = [], sortBy = "best_overall") {
    const list = [...options];

    switch (sortBy) {
      case "price_low_high":
        return list.sort((a, b) => (a.price || 0) - (b.price || 0));

      case "price_high_low":
        return list.sort((a, b) => (b.price || 0) - (a.price || 0));

      case "fastest":
        return list.sort((a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0));

      case "best_rated":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

      case "best_overall":
      default: {
        // Preferred order: BEST VALUE -> FASTEST -> CHEAPEST -> PREMIUM
        const order = { best_value: 1, fastest: 2, cheapest: 3, premium: 4 };
        return list.sort((a, b) => (order[a.tierType] || 99) - (order[b.tierType] || 99));
      }
    }
  }
}
