import { TransportOptionService } from "./TransportOptionService.js";
import { RouteService } from "./RouteService.js";

const API_BASE = import.meta.env?.VITE_API_URL || "/api";

export class TravelSearchService {
  /**
   * Fetch route search results from backend API with transparent local fallback
   */
  static async searchRoutes({
    fromCity = "Chennai",
    toDestination = "Goa",
    travelDate = new Date().toISOString().split("T")[0],
    passengers = 1,
    travelPreference = "all"
  }) {
    try {
      const response = await fetch(`${API_BASE}/search/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromCity,
          toDestination,
          travelDate,
          passengers,
          travelPreference
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Backend API unreachable for search, utilizing local calculation engine:", err.message);
    }

    // High-fidelity fallback calculation engine
    return this.generateLocalRouteResults({
      fromCity,
      toDestination,
      travelDate,
      passengers,
      travelPreference
    });
  }

  /**
   * Fetch location autocomplete suggestions
   */
  static async getLocationSuggestions(query) {
    if (!query || query.trim().length < 1) return [];

    try {
      const response = await fetch(`${API_BASE}/search/locations?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.length > 0) {
          return json.data;
        }
      }
    } catch (err) {
      // ignore
    }

    return null; // Fallback will use local verified directory
  }

  /**
   * Local route generation fallback
   */
  static generateLocalRouteResults({
    fromCity,
    toDestination,
    travelDate,
    passengers = 1,
    travelPreference
  }) {
    const dist = RouteService.getEstimatedDistanceKm(fromCity, toDestination) || 520;

    const trains = TransportOptionService.getTrainOptions(fromCity, toDestination, dist, {
      nearestRailwayStation: `${toDestination} Junction`,
      directTrainAvailable: true
    });

    const buses = TransportOptionService.getBusOptions(fromCity, toDestination, dist);
    const flights = TransportOptionService.getFlightOptions(fromCity, toDestination, dist, {
      nearestAirport: `${toDestination} Airport`,
      directFlightAvailable: true
    });
    const cabs = TransportOptionService.getCabOptions(fromCity, toDestination, dist, passengers);

    const primaryTrain = trains[0] || trains[1];
    const trainFare = primaryTrain?.price || 650;
    const connectingCabFare = Math.max(350, Math.round(dist * 0.7 + 150));

    const multiModal = [
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
        stops: "1 Transfer (Rail Junction ➔ Cab)",
        stopsCount: 1,
        price: trainFare + connectingCabFare,
        priceFormatted: `₹${(trainFare + connectingCabFare).toLocaleString("en-IN")}`,
        category: "Connected Multi-Hop Journey",
        rating: 4.85,
        reviewsCount: 920,
        availabilityStatus: "Train + Cab Reserved",
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
            category: "3rd AC (3A)"
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
      }
    ];

    const allRoutes = [...flights, ...trains, ...buses, ...cabs, ...multiModal];
    const recommended = allRoutes[0];

    return {
      success: true,
      meta: {
        from: fromCity,
        to: toDestination,
        travelDate,
        passengers,
        distanceKm: dist,
        totalRoutesFound: allRoutes.length
      },
      counts: {
        flights: flights.length,
        trains: trains.length,
        buses: buses.length,
        cabs: cabs.length,
        multiModal: multiModal.length
      },
      recommended,
      sectors: {
        flights,
        trains,
        buses,
        cabs,
        multiModal
      },
      allRoutes
    };
  }
}
