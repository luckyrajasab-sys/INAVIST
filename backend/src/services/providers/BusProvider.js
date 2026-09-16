/**
 * BusProvider Adapter
 * Adapts Bus search requests across State RTCs and private luxury operators (Zingbus, IntrCity, KSRTC, SETC, Orange).
 */
export class BusProvider {
  static getProviderName() {
    return "Intercity Bus GDS Adapter";
  }

  static async search({ fromCity, toDestination, travelDate, distanceKm }) {
    const dist = distanceKm || 450;
    const fastHours = Math.max(4.0, (dist / 56) + 0.5);
    const overnightHours = Math.max(5.5, (dist / 48) + 1.0);
    const dayHours = Math.max(6.0, (dist / 44) + 1.2);

    const formatMins = (h) => Math.round(h * 60);

    const computeTime = (depStr, durationMins) => {
      const parts = depStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!parts) return "07:00 AM";
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
    };

    const formatDuration = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m > 0 ? `${m}m` : "00m"}`;
    };

    const budgetFare = Math.max(340, Math.round(dist * 0.95 + 80));
    const semiSleeperFare = Math.max(580, Math.round(dist * 1.45 + 160));
    const luxurySleeperFare = Math.max(880, Math.round(dist * 2.15 + 240));

    return [
      {
        id: `bus-${fromCity}-${toDestination}-sleeper`,
        mode: "bus",
        provider: "IntrCity SmartBus / Zingbus",
        operator: "IntrCity AC Multi-Axle Sleeper (2+1)",
        routeNumber: "IC-8842",
        fromLocation: `${fromCity} Main Bus Terminal (CMBT / ISBT)`,
        toLocation: `${toDestination} Central Bus Stand`,
        departureTime: "09:30 PM",
        arrivalTime: computeTime("09:30 PM", formatMins(overnightHours)),
        duration: formatDuration(formatMins(overnightHours)),
        durationMinutes: formatMins(overnightHours),
        stops: "3 Highway Rest Halts",
        stopsCount: 3,
        price: luxurySleeperFare,
        category: "AC Sleeper 2+1",
        busType: "Volvo Multi-Axle AC Sleeper",
        classes: [
          { className: "Lower Sleeper Berth", price: luxurySleeperFare, availableSeats: 8, status: "Available" },
          { className: "Upper Sleeper Berth", price: Math.round(luxurySleeperFare * 0.92), availableSeats: 12, status: "Available" }
        ],
        boardingPoint: `${fromCity} Terminal Gate 4 (Live GPS Point)`,
        droppingPoint: `${toDestination} Town Circle Bus Stand`,
        rating: 4.8,
        reviewsCount: 1650,
        availabilityStatus: "20 Seats Available",
        seatAvailability: "20 Sleeper Berths",
        amenities: ["Individual USB Charging", "AC Climate Control", "Blanket & Pillow", "Live Bus Tracking", "Water Bottle"],
        recommendationTier: "best_value",
        cancellationPolicy: "Full refund 12 hours before departure. 50% refund up to 4 hours."
      },
      {
        id: `bus-${fromCity}-${toDestination}-express`,
        mode: "bus",
        provider: "State RTC Volvo",
        operator: "KSRTC / SETC Airavat Club Class AC",
        routeNumber: "KA-EXP-104",
        fromLocation: `${fromCity} Central Bus Station`,
        toLocation: `${toDestination} Depot Stand`,
        departureTime: "06:15 AM",
        arrivalTime: computeTime("06:15 AM", formatMins(fastHours)),
        duration: formatDuration(formatMins(fastHours)),
        durationMinutes: formatMins(fastHours),
        stops: "2 Quick Highway Breakfast Halts",
        stopsCount: 2,
        price: semiSleeperFare,
        category: "AC Semi-Sleeper",
        busType: "Scania / Volvo AC Semi-Sleeper",
        classes: [
          { className: "AC Semi-Sleeper Recliner", price: semiSleeperFare, availableSeats: 24, status: "Available" }
        ],
        boardingPoint: `${fromCity} Platform 12`,
        droppingPoint: `${toDestination} Central Stand`,
        rating: 4.6,
        reviewsCount: 1120,
        availabilityStatus: "24 Seats Available",
        seatAvailability: "24 Push-back Seats",
        amenities: ["Deep Reclining Seats", "AC", "Emergency Exit Hammer", "Punctual Morning Run"],
        recommendationTier: "fastest",
        cancellationPolicy: "Government RTC Standard cancellation policy."
      },
      {
        id: `bus-${fromCity}-${toDestination}-budget`,
        mode: "bus",
        provider: "Express Intercity",
        operator: "Direct Deluxe Non-AC Highway Express",
        routeNumber: "EX-5501",
        fromLocation: `${fromCity} Bypass Bus Stop`,
        toLocation: `${toDestination} Town Stand`,
        departureTime: "07:00 AM",
        arrivalTime: computeTime("07:00 AM", formatMins(dayHours)),
        duration: formatDuration(formatMins(dayHours)),
        durationMinutes: formatMins(dayHours),
        stops: "6 Local Town Stops",
        stopsCount: 6,
        price: budgetFare,
        category: "Deluxe Non-AC (2+2)",
        busType: "Deluxe High-Back Non-AC",
        classes: [
          { className: "Standard Window / Aisle", price: budgetFare, availableSeats: 32, status: "Available" }
        ],
        boardingPoint: `${fromCity} Bypass Counter`,
        droppingPoint: `${toDestination} Main Gate`,
        rating: 4.2,
        reviewsCount: 640,
        availabilityStatus: "32 Seats Available",
        seatAvailability: "32 Window/Aisle Seats",
        amenities: ["Ultra Budget", "Panoramic Windows", "Frequent Halts", "Luggage Roof Carrier"],
        recommendationTier: "cheapest",
        cancellationPolicy: "Easy 1-click cancellation up to 6 hours before."
      }
    ];
  }
}
