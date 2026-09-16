/**
 * FlightProvider Adapter
 * Adapts Flight search requests across domestic carriers (IndiGo, Air India, Vistara, Akasa Air).
 */
export class FlightProvider {
  static getProviderName() {
    return "Domestic Airline GDS Adapter";
  }

  static async search({ fromCity, toDestination, travelDate, distanceKm }) {
    const dist = distanceKm || 600;
    // Flight duration calculation: 45 min take-off/landing + air cruise
    const airMins = Math.max(65, Math.round((dist / 550) * 60 + 35));

    const computeTime = (depStr, durationMins) => {
      const parts = depStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!parts) return "08:30 AM";
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

    const baseFlightFare = Math.max(3100, Math.round(dist * 3.8 + 1200));
    const premiumFlightFare = Math.round(baseFlightFare * 1.5);

    return [
      {
        id: `flight-${fromCity}-${toDestination}-indigo`,
        mode: "flight",
        provider: "IndiGo Airlines",
        operator: "IndiGo 6E-2415",
        routeNumber: "6E-2415",
        fromLocation: `${fromCity} International Airport (Airport Hub)`,
        toLocation: `${toDestination} Airport / Nearest Airport`,
        departureTime: "07:15 AM",
        arrivalTime: computeTime("07:15 AM", airMins),
        duration: formatDuration(airMins),
        durationMinutes: airMins,
        stops: "Non-stop",
        stopsCount: 0,
        price: baseFlightFare,
        category: "Economy (Saver)",
        classes: [
          { className: "Economy Saver", price: baseFlightFare, availableSeats: 9, status: "Available" },
          { className: "Economy Flexi Plus", price: Math.round(baseFlightFare * 1.18), availableSeats: 16, status: "Available" }
        ],
        baggageInfo: "7 kg Cabin • 15 kg Check-in Included",
        rating: 4.8,
        reviewsCount: 3200,
        availabilityStatus: "9 Seats Left at this price",
        seatAvailability: "9 Seats Available",
        amenities: ["Web Check-in Free", "Snack Options", "Quickest Transit Across India", "7kg + 15kg Baggage"],
        recommendationTier: "fastest",
        cancellationPolicy: "Airline cancellation fee applies. Rescheduling available up to 2h before departure."
      },
      {
        id: `flight-${fromCity}-${toDestination}-airindia`,
        mode: "flight",
        provider: "Air India",
        operator: "Air India AI-512",
        routeNumber: "AI-512",
        fromLocation: `${fromCity} International Airport`,
        toLocation: `${toDestination} Airport`,
        departureTime: "11:45 AM",
        arrivalTime: computeTime("11:45 AM", airMins),
        duration: formatDuration(airMins),
        durationMinutes: airMins,
        stops: "Non-stop",
        stopsCount: 0,
        price: Math.round(baseFlightFare * 1.12),
        category: "Full Service Economy",
        classes: [
          { className: "Standard Economy (Meal Included)", price: Math.round(baseFlightFare * 1.12), availableSeats: 14, status: "Available" },
          { className: "Business Class", price: premiumFlightFare, availableSeats: 4, status: "Available" }
        ],
        baggageInfo: "7 kg Cabin • 25 kg Check-in + Hot Meal",
        rating: 4.7,
        reviewsCount: 1840,
        availabilityStatus: "14 Seats Available",
        seatAvailability: "14 Seats Available",
        amenities: ["Complimentary Hot Meal", "25 kg Baggage Allowance", "Priority Boarding", "In-flight Audio"],
        recommendationTier: "best_value",
        cancellationPolicy: "25kg baggage included. Standard Air India cancellation terms."
      }
    ];
  }
}
