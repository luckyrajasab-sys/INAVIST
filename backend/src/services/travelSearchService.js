import { TrainProvider } from "./providers/TrainProvider.js";
import { BusProvider } from "./providers/BusProvider.js";
import { FlightProvider } from "./providers/FlightProvider.js";
import { CabProvider } from "./providers/CabProvider.js";

export class TravelSearchService {
  /**
   * Approximate distances between major hubs & destinations in km
   */
  static estimateDistanceKm(from, to) {
    const f = (from || "").toLowerCase();
    const t = (to || "").toLowerCase();

    if ((f.includes("chennai") && t.includes("kodai")) || (t.includes("chennai") && f.includes("kodai"))) return 525;
    if ((f.includes("chennai") && t.includes("bengaluru")) || (t.includes("chennai") && f.includes("bengaluru"))) return 345;
    if ((f.includes("chennai") && t.includes("goa")) || (t.includes("chennai") && f.includes("goa"))) return 910;
    if ((f.includes("delhi") && t.includes("leh")) || (t.includes("delhi") && f.includes("leh"))) return 980;
    if ((f.includes("delhi") && t.includes("manali")) || (t.includes("delhi") && f.includes("manali"))) return 535;
    if ((f.includes("delhi") && t.includes("varanasi")) || (t.includes("delhi") && f.includes("varanasi"))) return 820;
    if ((f.includes("delhi") && t.includes("goa")) || (t.includes("delhi") && f.includes("goa"))) return 1870;
    if ((f.includes("mumbai") && t.includes("goa")) || (t.includes("mumbai") && f.includes("goa"))) return 590;
    if ((f.includes("bengaluru") && t.includes("munnar")) || (t.includes("bengaluru") && f.includes("munnar"))) return 475;
    if ((f.includes("bengaluru") && t.includes("goa")) || (t.includes("bengaluru") && f.includes("goa"))) return 560;

    return 550; // Default moderate distance
  }

  /**
   * Universal Multi-Transport Search with Provider Normalization & Multi-Modal generation
   */
  static async searchRoutes({
    fromCity = "Chennai",
    toDestination = "Goa",
    travelDate = new Date().toISOString().split("T")[0],
    passengers = 1,
    travelPreference = "all"
  }) {
    const distanceKm = this.estimateDistanceKm(fromCity, toDestination);

    // Parallel fetch from all providers
    const [trains, buses, flights, cabs] = await Promise.all([
      TrainProvider.search({ fromCity, toDestination, travelDate, distanceKm }),
      BusProvider.search({ fromCity, toDestination, travelDate, distanceKm }),
      FlightProvider.search({ fromCity, toDestination, travelDate, distanceKm }),
      CabProvider.search({ fromCity, toDestination, travelDate, distanceKm, passengers })
    ]);

    // Multi-Modal Routes generation (Connected sectors)
    const multiModalRoutes = this.generateMultiModalRoutes({
      fromCity,
      toDestination,
      distanceKm,
      trains,
      flights,
      buses,
      cabs,
      passengers
    });

    // Unified list of all direct & multi-modal options
    const allOptions = [
      ...flights,
      ...trains,
      ...buses,
      ...cabs,
      ...multiModalRoutes
    ];

    // Compute Recommended spotlight option
    const recommended = this.selectRecommendedRoute(allOptions);

    return {
      success: true,
      meta: {
        from: fromCity,
        to: toDestination,
        travelDate,
        passengers,
        distanceKm,
        totalRoutesFound: allOptions.length
      },
      counts: {
        flights: flights.length,
        trains: trains.length,
        buses: buses.length,
        cabs: cabs.length,
        multiModal: multiModalRoutes.length
      },
      recommended,
      sectors: {
        flights,
        trains,
        buses,
        cabs,
        multiModal: multiModalRoutes
      },
      allRoutes: allOptions
    };
  }

  /**
   * Generates intelligent connected multi-modal routes
   * (e.g. Train + Cab, Flight + Cab, Bus + Cab)
   */
  static generateMultiModalRoutes({
    fromCity,
    toDestination,
    distanceKm,
    trains,
    flights,
    buses,
    cabs,
    passengers
  }) {
    const primaryTrain = trains[0] || trains[1];
    const primaryFlight = flights[0];
    const primaryBus = buses[0];

    const trainFare = primaryTrain?.price || 650;
    const connectingCabFare = Math.max(350, Math.round(distanceKm * 0.7 + 150));
    const flightFare = primaryFlight?.price || 3200;
    const airportCabFare = 450;

    const routes = [
      {
        id: `multi-${fromCity}-${toDestination}-train-cab`,
        mode: "multi_modal",
        multiModalType: "Train + Cab",
        title: `${fromCity} → ${toDestination} (Superfast Rail + Doorstep Cab)`,
        operator: "Indian Railways + Yatri Outstation Taxi",
        fromLocation: `${fromCity} Central Station`,
        toLocation: `${toDestination} Hotel / Doorstep`,
        departureTime: primaryTrain?.departureTime || "06:15 AM",
        arrivalTime: "02:15 PM",
        duration: "8h 00m",
        durationMinutes: 480,
        stops: "1 Seamless Transfer (Rail Junction ➔ Cab)",
        stopsCount: 1,
        price: trainFare + connectingCabFare,
        priceFormatted: `₹${(trainFare + connectingCabFare).toLocaleString("en-IN")}`,
        category: "Connected Multi-Hop Journey",
        rating: 4.85,
        reviewsCount: 920,
        availabilityStatus: "Confirmed Train Berth + Cab Reserved",
        seatAvailability: "Combined Instant Booking",
        recommendationTier: "best_value",
        sectors: [
          {
            sectorIndex: 1,
            mode: "train",
            operator: primaryTrain?.operator || "Superfast Express",
            fromLocation: `${fromCity} Central Station`,
            toLocation: `${toDestination} Railway Junction`,
            departureTime: "06:15 AM",
            arrivalTime: "12:45 PM",
            duration: "6h 30m",
            price: trainFare,
            category: "3rd AC (3A) / AC Chair Car"
          },
          {
            sectorIndex: 2,
            mode: "cab",
            operator: "Yatri Verified Cab Partner",
            fromLocation: `${toDestination} Railway Junction Platform Exit`,
            toLocation: `${toDestination} Hotel / Final Destination`,
            departureTime: "01:00 PM (15m Transfer buffer)",
            arrivalTime: "02:15 PM",
            duration: "1h 15m",
            price: connectingCabFare,
            category: "Private AC Sedan"
          }
        ],
        priceBreakdown: {
          sector1Cost: trainFare,
          sector2Cost: connectingCabFare,
          totalCost: trainFare + connectingCabFare,
          convenienceFee: 49,
          totalPayable: trainFare + connectingCabFare + 49
        },
        amenities: ["Zero-Wait Station Pickup", "Driver Tracks Train Live", "Luggage Assistance", "Save 40% vs Direct Flight"],
        cancellationPolicy: "Both sectors synchronized. Free cancellation up to 4 hours before train departure."
      },
      {
        id: `multi-${fromCity}-${toDestination}-flight-cab`,
        mode: "multi_modal",
        multiModalType: "Flight + Cab",
        title: `${fromCity} → ${toDestination} (Express Flight + Airport Cab)`,
        operator: "Domestic Airline + Airport Chauffeur",
        fromLocation: `${fromCity} Airport Hub`,
        toLocation: `${toDestination} Resort / Center`,
        departureTime: primaryFlight?.departureTime || "07:15 AM",
        arrivalTime: "10:45 AM",
        duration: "3h 30m",
        durationMinutes: 210,
        stops: "1 Fast Transfer (Airport ➔ Chauffeur)",
        stopsCount: 1,
        price: flightFare + airportCabFare,
        priceFormatted: `₹${(flightFare + airportCabFare).toLocaleString("en-IN")}`,
        category: "Fastest Express Route",
        rating: 4.9,
        reviewsCount: 1350,
        availabilityStatus: "Flight Seat + Cab Available",
        seatAvailability: "Instant Confirmation",
        recommendationTier: "fastest",
        sectors: [
          {
            sectorIndex: 1,
            mode: "flight",
            operator: primaryFlight?.operator || "IndiGo 6E Express",
            fromLocation: `${fromCity} Airport (DEL/MAA/BLR)`,
            toLocation: `${toDestination} Airport Terminal`,
            departureTime: "07:15 AM",
            arrivalTime: "09:15 AM",
            duration: "2h 00m",
            price: flightFare,
            category: "Economy Class"
          },
          {
            sectorIndex: 2,
            mode: "cab",
            operator: "Airport Direct Chauffeur",
            fromLocation: `${toDestination} Airport Arrival Gate`,
            toLocation: `${toDestination} Hotel / Destination`,
            departureTime: "09:45 AM (30m Baggage buffer)",
            arrivalTime: "10:45 AM",
            duration: "1h 00m",
            price: airportCabFare,
            category: "Prime AC Sedan"
          }
        ],
        priceBreakdown: {
          sector1Cost: flightFare,
          sector2Cost: airportCabFare,
          totalCost: flightFare + airportCabFare,
          convenienceFee: 99,
          totalPayable: flightFare + airportCabFare + 99
        },
        amenities: ["Flight Delay Protection", "Airport Name-board Pickup", "Air Conditioned Comfort", "Superfast Transit"],
        cancellationPolicy: "24h advance cancellation for full refund minus airline fee."
      },
      {
        id: `multi-${fromCity}-${toDestination}-bus-cab`,
        mode: "multi_modal",
        multiModalType: "Bus + Cab",
        title: `${fromCity} → ${toDestination} (Overnight AC Sleeper + Local Cab)`,
        operator: "IntrCity SmartBus + Local Hub Taxi",
        fromLocation: `${fromCity} Bus Terminal`,
        toLocation: `${toDestination} Hill Top / Resort`,
        departureTime: "09:30 PM",
        arrivalTime: "08:15 AM (+1)",
        duration: "10h 45m",
        durationMinutes: 645,
        stops: "1 Morning Transfer (Bus Terminal ➔ Cab)",
        stopsCount: 1,
        price: (primaryBus?.price || 850) + 280,
        priceFormatted: `₹${((primaryBus?.price || 850) + 280).toLocaleString("en-IN")}`,
        category: "Overnight Comfort Route",
        rating: 4.7,
        reviewsCount: 680,
        availabilityStatus: "Sleeper Berth + Local Cab Ready",
        seatAvailability: "18 Berths Available",
        recommendationTier: "cheapest",
        sectors: [
          {
            sectorIndex: 1,
            mode: "bus",
            operator: primaryBus?.operator || "AC Sleeper 2+1",
            fromLocation: `${fromCity} Bus Terminal`,
            toLocation: `${toDestination} Bus Stand`,
            departureTime: "09:30 PM",
            arrivalTime: "07:00 AM (+1)",
            duration: "9h 30m",
            price: primaryBus?.price || 850,
            category: "AC Sleeper Lower Berth"
          },
          {
            sectorIndex: 2,
            mode: "cab",
            operator: "Local Destination Taxi",
            fromLocation: `${toDestination} Bus Stand Arrival`,
            toLocation: `${toDestination} Resort / Hilltop`,
            departureTime: "07:15 AM",
            arrivalTime: "08:15 AM",
            duration: "1h 00m",
            price: 280,
            category: "Hatchback / Sedan"
          }
        ],
        priceBreakdown: {
          sector1Cost: primaryBus?.price || 850,
          sector2Cost: 280,
          totalCost: (primaryBus?.price || 850) + 280,
          convenienceFee: 29,
          totalPayable: (primaryBus?.price || 850) + 280 + 29
        },
        amenities: ["Sleep Overnight En-Route", "Morning Direct Drop", "No Luggage Hassle", "Budget Friendly"],
        cancellationPolicy: "Free cancellation up to 6 hours before bus departure."
      }
    ];

    return routes;
  }

  /**
   * Intelligently select the best Recommended Route balancing:
   * Price + Travel Time + Comfort + Rating
   */
  static selectRecommendedRoute(allOptions = []) {
    if (!allOptions || allOptions.length === 0) return null;

    // Pick top-scoring route balancing duration, price, rating
    let best = allOptions[0];
    let highestScore = -Infinity;

    for (const opt of allOptions) {
      const price = opt.price || 1000;
      const durationHours = (opt.durationMinutes || 300) / 60;
      const rating = opt.rating || 4.5;

      // Higher rating & reasonable price & lower duration gives best score
      // Score = (Rating * 25) - (DurationHours * 2.5) - (Price / 400)
      const score = (rating * 25) - (durationHours * 2.2) - (price / 500);

      if (score > highestScore) {
        highestScore = score;
        best = opt;
      }
    }

    return best;
  }
}
