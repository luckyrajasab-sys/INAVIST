import { FareEstimator } from "./FareEstimator.js";
import { RouteService } from "./RouteService.js";
import { locationService } from "./LocationService.js";
import { mockTransportRoutes } from "../data/transportsData.js";

export class TransportService {
  /**
   * Get full Smart Journey bundle between any two points in India
   */
  static getSmartJourneyPlan({
    fromLocation = "Chennai",
    toDestination = "Kodaikanal",
    travelDate = new Date().toISOString().split("T")[0],
    passengers = 1,
    preferredMode = "all",
    budget = 5000
  }) {
    const distanceKm = RouteService.getEstimatedDistanceKm(fromLocation, toDestination);

    // 1. First-mile options (Home -> Terminal)
    const firstMileOptions = FareEstimator.estimateFirstMile(10, passengers);

    // 2. Main transit comparison (Origin -> Destination)
    const mainTransport = FareEstimator.estimateMainTransport({
      distanceKm,
      fromName: fromLocation,
      toName: toDestination
    });

    // 3. Alternative routes
    const alternativeRoutes = RouteService.getAlternativeRoutes({
      fromCity: fromLocation,
      toDestination: toDestination
    });

    // 4. Curated Route Packages (Route 1 to Route 4)
    const curatedPackages = RouteService.getCuratedRoutePackages({
      fromCity: fromLocation,
      toDestination: toDestination,
      passengers
    });

    // 5. Local transport at destination
    const localTransport = FareEstimator.estimateLocalTransport(toDestination);

    // 6. Smart recommendation badges
    const rankedRoutes = RouteService.rankRoutes(mainTransport, firstMileOptions);

    // 7. Default selected package calculation
    const defaultFirstMile = firstMileOptions.find((f) => f.id === "fm-cab") || firstMileOptions[0];
    const defaultMain = mainTransport.train || mainTransport.bus || Object.values(mainTransport)[0];
    const defaultLocal = localTransport[0];

    const initialTotalCost = RouteService.calculateTotalTripCost({
      firstMileCost: defaultFirstMile?.estimatedCost || 250,
      mainTransitCost: defaultMain?.priceMin || 650,
      lastMileCost: 200,
      passengers
    });

    return {
      from: fromLocation,
      to: toDestination,
      travelDate,
      passengers,
      distanceKm,
      budget,
      preferredMode,
      firstMileOptions,
      mainTransport,
      alternativeRoutes,
      curatedPackages,
      localTransport,
      rankedRoutes,
      defaultSelection: {
        firstMile: defaultFirstMile,
        mainTransit: defaultMain,
        local: defaultLocal,
        totalCost: initialTotalCost
      }
    };
  }

  /**
   * Sudden Travel / "Need to Travel Now?" Engine
   * Returns instant departure options, closest terminals, quick cabs, and next available transport.
   */
  static getSuddenTravelOptions(currentCity = "Chennai", targetDestination = "Kodaikanal") {
    const from = currentCity || "Chennai";
    const to = targetDestination || "Kodaikanal";
    const terminals = locationService.getNearestTerminals(from);
    const distanceKm = RouteService.getEstimatedDistanceKm(from, to);

    const currentTime = new Date();
    const formatHour = (minsAhead) => {
      const d = new Date(currentTime.getTime() + minsAhead * 60000);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return {
      status: "Active Instant Dispatch",
      fromCity: from,
      destination: to,
      distanceKm,
      urgencyLevel: "Immediate Departure",
      nearbyTerminals: terminals,
      instantOptions: [
        {
          id: "sudden-cab-outstation",
          title: "Instant Outstation Cab (Doorstep Pickup in 10 min)",
          badge: "Leave Right Now",
          badgeColor: "#DC2626",
          iconName: "Car",
          readyInMins: 10,
          departureTime: "Immediate / Now",
          estimatedArrival: formatHour(Math.round((distanceKm / 65) * 60)),
          cost: Math.round(distanceKm * 14 + 300),
          costFormatted: `₹${Math.round(distanceKm * 14 + 300).toLocaleString("en-IN")}`,
          operator: "Yatri Verified Direct Cab Partner",
          features: ["Doorstep pickup within 10 min", "Direct non-stop drive", "Live GPS Tracking"]
        },
        {
          id: "sudden-next-bus",
          title: `Next Direct AC Sleeper Bus from ${terminals.bus[0]?.name || "Bus Terminal"}`,
          badge: "Next Departure in 45 min",
          badgeColor: "#EA580C",
          iconName: "Bus",
          readyInMins: 45,
          departureTime: formatHour(45),
          estimatedArrival: formatHour(Math.round((distanceKm / 48) * 60 + 45)),
          cost: Math.round(distanceKm * 1.6 + 120),
          costFormatted: `₹${Math.round(distanceKm * 1.6 + 120)}`,
          operator: "State RTC / Private Express",
          features: [`Reach ${terminals.bus[0]?.name || "Bus Stand"} in 25 min`, "E-ticket on phone", "Overnight berths"]
        },
        {
          id: "sudden-rail-tatkal",
          title: `Next Superfast Train from ${terminals.railway[0]?.name || "Railway Junction"}`,
          badge: "Tatkal / General Available",
          badgeColor: "#2563EB",
          iconName: "Train",
          readyInMins: 90,
          departureTime: formatHour(90),
          estimatedArrival: formatHour(Math.round((distanceKm / 60) * 60 + 90)),
          cost: Math.round(distanceKm * 0.9 + 150),
          costFormatted: `₹${Math.round(distanceKm * 0.9 + 150)}`,
          operator: "Indian Railways Express",
          features: ["Current reservation / Tatkal quota", "Pantry meals", "Reach station via Metro"]
        },
        {
          id: "sudden-bike-highway",
          title: "Highway Cruiser / Bike Ride (Self-Drive)",
          badge: "Instant Freedom",
          badgeColor: "#16A34A",
          iconName: "Bike",
          readyInMins: 5,
          departureTime: "Immediate Departure",
          estimatedArrival: formatHour(Math.round((distanceKm / 50) * 60)),
          cost: Math.round((distanceKm / 38) * 102),
          costFormatted: `₹${Math.round((distanceKm / 38) * 102)} (Estimated Fuel)`,
          operator: "Personal / Self-Drive Two-Wheeler",
          features: ["Zero wait time", "Scenic highway corridor", "Ghat road adventure"]
        }
      ]
    };
  }
}

