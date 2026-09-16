/**
 * CabProvider Adapter
 * Adapts Private Cab, Outstation Taxi & First/Last Mile providers (Yatri Direct, Prime Sedan, Innova Crysta).
 */
export class CabProvider {
  static getProviderName() {
    return "Outstation Cab & Taxi Network Adapter";
  }

  static async search({ fromCity, toDestination, travelDate, distanceKm, passengers = 1 }) {
    const dist = distanceKm || 380;
    const driveHours = Math.max(3.0, (dist / 58) + 0.5);
    const formatMins = Math.round(driveHours * 60);

    const computeTime = (depStr, durationMins) => {
      const parts = depStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!parts) return "04:30 PM";
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

    const sedanFare = Math.max(1400, Math.round(dist * 13.5 + 400));
    const suvFare = Math.max(2200, Math.round(dist * 18.0 + 600));

    return [
      {
        id: `cab-${fromCity}-${toDestination}-sedan`,
        mode: "cab",
        provider: "YĀTRI Outstation Direct Partner",
        operator: "Prime AC Sedan (Swift Dzire / Etios)",
        routeNumber: "CAB-SDN",
        fromLocation: `${fromCity} (Doorstep Pickup)`,
        toLocation: `${toDestination} (Exact Hotel / Resort Drop)`,
        departureTime: "Flexible / On-Demand",
        arrivalTime: computeTime("06:00 AM", formatMins),
        duration: formatDuration(formatMins),
        durationMinutes: formatMins,
        stops: "Flexible (Sightseeing & Meal Halts Allowed)",
        stopsCount: 2,
        price: sedanFare,
        category: "Prime AC Sedan (4 Seats)",
        vehicleType: "Maruti Dzire / Toyota Etios",
        estimatedDistance: `~${dist} km`,
        classes: [
          { className: "AC Sedan (Up to 4 Passengers)", price: sedanFare, availableSeats: 4, status: "Instant Dispatch" }
        ],
        rating: 4.9,
        reviewsCount: 880,
        availabilityStatus: "Instant Booking • Doorstep Pickup",
        seatAvailability: "4 Passenger Seats",
        amenities: ["Doorstep Pickup", "Zero Walking with Luggage", "AC", "Verified Chauffeur", "Toll & State Tax Included"],
        recommendationTier: "best_value",
        cancellationPolicy: "Free cancellation up to 2 hours before pickup time."
      },
      {
        id: `cab-${fromCity}-${toDestination}-suv`,
        mode: "cab",
        provider: "YĀTRI Outstation Premium",
        operator: "Toyota Innova Crysta / Ertiga SUV",
        routeNumber: "CAB-SUV",
        fromLocation: `${fromCity} (Doorstep Pickup)`,
        toLocation: `${toDestination} (Resort Drop)`,
        departureTime: "Flexible / On-Demand",
        arrivalTime: computeTime("06:00 AM", formatMins),
        duration: formatDuration(formatMins),
        durationMinutes: formatMins,
        stops: "Flexible Custom Itinerary Halts",
        stopsCount: 3,
        price: suvFare,
        category: "Luxury SUV (6-7 Seats)",
        vehicleType: "Toyota Innova Crysta",
        estimatedDistance: `~${dist} km`,
        classes: [
          { className: "Innova Crysta 6-7 Seater", price: suvFare, availableSeats: 6, status: "Instant Dispatch" }
        ],
        rating: 4.95,
        reviewsCount: 1250,
        availabilityStatus: "Instant Booking",
        seatAvailability: "6-7 Passenger Seats",
        amenities: ["Captain Seats", "High Ground Clearance", "Roof Carrier for Baggage", "Live GPS Chauffeur"],
        recommendationTier: "fastest",
        cancellationPolicy: "Free cancellation up to 2 hours before departure."
      }
    ];
  }
}
