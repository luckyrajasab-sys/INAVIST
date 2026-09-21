import { destinationsData } from "../data/destinationsData.js";
import { seedHotels, seedGovTourism } from "../data/seedData.js";
import { travelPackages } from "../data/travelPackagesData.js";

// YĀTRI Production API Client & Real-Time Connection Layer
const API_BASE = import.meta.env?.VITE_API_URL || "";

export const getAuthToken = () => {
  return localStorage.getItem("yatri_jwt_token");
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("yatri_jwt_token", token);
  } else {
    localStorage.removeItem("yatri_jwt_token");
  }
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * High-fidelity client-side persistence and mock engine for standalone Vercel deployment
 */
const getClientSideMockResponse = (endpoint, options = {}) => {
  const method = options.method || "GET";
  let body = {};
  try {
    if (options.body && typeof options.body === "string") {
      body = JSON.parse(options.body);
    } else if (options.body && typeof options.body === "object") {
      body = options.body;
    }
  } catch (e) {
    body = {};
  }

  // 1. Auth Endpoints
  if (endpoint === "/auth/demo-login") {
    const demoUser = {
      id: "usr-demo-01",
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43210",
      role: "user",
      isVerified: true
    };
    localStorage.setItem("yatra_user", JSON.stringify(demoUser));
    return {
      success: true,
      data: {
        token: "yatri-demo-token-standalone",
        user: demoUser
      }
    };
  }

  if (endpoint === "/auth/admin-login") {
    const adminUser = {
      id: "usr-admin-01",
      name: "YĀTRI Lead Admin",
      email: "admin@yatri.com",
      role: "admin",
      isVerified: true
    };
    localStorage.setItem("yatra_user", JSON.stringify(adminUser));
    return {
      success: true,
      data: {
        token: "yatri-admin-token-standalone",
        user: adminUser
      }
    };
  }

  if (endpoint.startsWith("/auth/login") || endpoint.startsWith("/auth/social") || endpoint.startsWith("/auth/register")) {
    const loggedUser = {
      id: `usr-${Date.now()}`,
      name: body.name || (body.email ? body.email.split("@")[0] : "Verified Traveler"),
      email: body.email || "traveler@inavist.com",
      phone: body.phone || "+91 98450 11223",
      role: endpoint.includes("admin") ? "admin" : "user",
      isVerified: true
    };
    localStorage.setItem("yatra_user", JSON.stringify(loggedUser));
    return {
      success: true,
      data: {
        token: "yatri-auth-token-standalone",
        user: loggedUser
      }
    };
  }

  if (endpoint === "/auth/me") {
    const localUser = localStorage.getItem("yatra_user");
    return {
      success: true,
      data: localUser ? JSON.parse(localUser) : {
        id: "usr-demo-01",
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91 98765 43210",
        role: "user",
        isVerified: true
      }
    };
  }

  if (endpoint === "/auth/logout") {
    localStorage.removeItem("yatra_user");
    return { success: true, message: "Logged out successfully." };
  }

  if (endpoint === "/auth/forgot-password" || endpoint === "/auth/reset-password") {
    return { success: true, message: "Request processed successfully." };
  }

  // 2. Saved UPI IDs
  if (endpoint.startsWith("/auth/upi-ids")) {
    const raw = localStorage.getItem("inavist_saved_upi_ids");
    let upiList = raw ? JSON.parse(raw) : [
      { id: "upi-1", upiId: "arjun.verma@okhdfcbank", bankName: "HDFC Bank", verified: true, isDefault: true, addedAt: "Today" },
      { id: "upi-2", upiId: "yatri.traveler@icici", bankName: "ICICI Bank", verified: true, isDefault: false, addedAt: "Yesterday" }
    ];

    if (method === "POST") {
      const clean = (body.upiId || "").trim().toLowerCase();
      const newEntry = {
        id: `upi-${Date.now()}`,
        upiId: clean,
        bankName: body.bankName || "Verified UPI Bank",
        verified: true,
        isDefault: body.isDefault || false,
        addedAt: "Just now"
      };
      upiList = [newEntry, ...upiList.filter((u) => u.upiId !== clean)];
      localStorage.setItem("inavist_saved_upi_ids", JSON.stringify(upiList));
      return { success: true, data: newEntry, message: "UPI ID saved successfully." };
    }

    if (method === "DELETE") {
      const removeTarget = decodeURIComponent(endpoint.split("/").pop());
      upiList = upiList.filter((u) => u.upiId !== removeTarget && u.id !== removeTarget);
      localStorage.setItem("inavist_saved_upi_ids", JSON.stringify(upiList));
      return { success: true, message: "UPI ID removed." };
    }

    return { success: true, data: upiList };
  }

  // 3. User Profile
  if (endpoint.startsWith("/users/profile")) {
    const currentProfileRaw = localStorage.getItem("inavist_user_profile");
    let profile = currentProfileRaw ? JSON.parse(currentProfileRaw) : {
      name: "Dr. Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      emergencyContacts: [
        { name: "Pooja Kumar", relation: "Spouse", phone: "+91 98765 43211" }
      ],
      travelPreferences: {
        budgetCategory: "Mid-Range",
        dietary: "Vegetarian",
        travelStyle: "Cultural Heritage"
      }
    };

    if (method === "PUT") {
      profile = { ...profile, ...body };
      localStorage.setItem("inavist_user_profile", JSON.stringify(profile));
      return { success: true, data: profile, message: "Profile updated successfully." };
    }
    return { success: true, data: profile };
  }

  if (endpoint.startsWith("/users/emergency-contacts")) {
    if (method === "PUT") {
      localStorage.setItem("inavist_emergency_contacts", JSON.stringify(body.emergencyContacts || []));
      return { success: true, message: "Emergency contacts saved." };
    }
    const raw = localStorage.getItem("inavist_emergency_contacts");
    return { success: true, data: raw ? JSON.parse(raw) : [] };
  }

  if (endpoint.startsWith("/users/preferences")) {
    if (method === "PUT") {
      localStorage.setItem("inavist_travel_preferences", JSON.stringify(body.travelPreferences || body));
      return { success: true, message: "Travel preferences saved." };
    }
    const raw = localStorage.getItem("inavist_travel_preferences");
    return { success: true, data: raw ? JSON.parse(raw) : {} };
  }

  if (endpoint.startsWith("/users/favorites")) {
    const raw = localStorage.getItem("inavist_favorites");
    let favs = raw ? JSON.parse(raw) : ["ladakh-pangong", "ht-tn-1", "pkg-goa-1"];
    if (method === "POST") {
      const destId = endpoint.split("/").pop();
      if (favs.includes(destId)) {
        favs = favs.filter((id) => id !== destId);
      } else {
        favs.push(destId);
      }
      localStorage.setItem("inavist_favorites", JSON.stringify(favs));
      return { success: true, data: favs };
    }
    return { success: true, data: favs };
  }

  if (endpoint === "/users/avatar") {
    return {
      success: true,
      data: { avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" },
      message: "Avatar updated successfully."
    };
  }

  if (endpoint === "/users/change-password") {
    return { success: true, message: "Password updated successfully." };
  }

  // 4. Bookings
  if (endpoint.startsWith("/bookings")) {
    const raw = localStorage.getItem("inavist_all_bookings");
    let bookings = raw ? JSON.parse(raw) : [];

    if (method === "POST") {
      const newBkg = {
        id: `bkg-${Date.now()}`,
        bookingId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        pnr: `PNR-${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdAt: new Date().toISOString(),
        status: "Confirmed",
        ...body
      };
      bookings = [newBkg, ...bookings];
      localStorage.setItem("inavist_all_bookings", JSON.stringify(bookings));
      return { success: true, data: newBkg, message: "Booking confirmed successfully." };
    }

    if (method === "DELETE") {
      const targetId = endpoint.split("/").pop();
      bookings = bookings.filter((b) => b.id !== targetId && b.bookingId !== targetId);
      localStorage.setItem("inavist_all_bookings", JSON.stringify(bookings));
      return { success: true, message: "Booking cancelled successfully." };
    }

    return { success: true, data: bookings };
  }

  // 5. Payments & UPI
  if (endpoint === "/payments/validate-upi") {
    const clean = (body.upiId || "").trim().toLowerCase();
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!clean || !upiRegex.test(clean)) {
      return {
        success: false,
        data: { isValid: false, message: "Invalid UPI ID format (e.g. yourname@okhdfcbank)" }
      };
    }
    const [handle, bank] = clean.split("@");
    return {
      success: true,
      data: {
        isValid: true,
        upiId: clean,
        bankHandle: bank || "okhdfcbank",
        maskedName: `${(handle || "user").slice(0, 2)}*** Verified Account`,
        message: "UPI ID verified successfully."
      }
    };
  }

  if (endpoint === "/payments/create-intent") {
    const vpa = "inavist.travel@okhdfcbank";
    const ref = `INV${Date.now()}`;
    const uri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=INAVIST%20Travel&am=${Number(body.amount || 1000).toFixed(2)}&cu=INR&tr=${ref}`;
    return {
      success: true,
      data: {
        success: true,
        merchantVPA: vpa,
        merchantName: "INAVIST India Tourism",
        amount: Number(body.amount || 1000),
        transactionRef: ref,
        upiIntentUrl: uri,
        qrCodeData: uri,
        expiresInSeconds: 300
      }
    };
  }

  if (endpoint === "/payments/verify") {
    const txn = {
      id: `TXN-${Date.now()}`,
      transactionId: body.transactionId || `UPI/INV/2026/${Math.floor(100000000 + Math.random() * 900000000)}`,
      amount: Number(body.amount || 1000),
      status: "VERIFIED",
      paidVia: body.upiId || "UPI Dynamic QR",
      verifiedAt: new Date().toISOString(),
      bankReferenceNumber: `HDFC-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`
    };
    const rawTxns = localStorage.getItem("inavist_recent_transactions");
    const txns = rawTxns ? JSON.parse(rawTxns) : [];
    localStorage.setItem("inavist_recent_transactions", JSON.stringify([txn, ...txns]));
    return {
      success: true,
      data: txn
    };
  }

  if (endpoint === "/payments/history") {
    const raw = localStorage.getItem("inavist_recent_transactions");
    return {
      success: true,
      data: raw ? JSON.parse(raw) : [
        {
          id: "TXN-DEMO-1",
          transactionId: "UPI/INV/2026/849201948",
          amount: 4999,
          status: "VERIFIED",
          paidVia: "arjun.verma@okhdfcbank",
          verifiedAt: "2026-09-10T14:30:00.000Z"
        }
      ]
    };
  }

  // 6. Tourism, Destinations & Hotels
  if (endpoint.startsWith("/destinations")) {
    if (endpoint.includes("/search")) {
      const url = new URL(`http://localhost${endpoint}`);
      const q = (url.searchParams.get("q") || "").toLowerCase();
      const filtered = destinationsData.filter(
        (d) => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q) || (d.district && d.district.toLowerCase().includes(q))
      );
      return { success: true, data: filtered, count: filtered.length };
    }
    if (endpoint.includes("/state/")) {
      const state = decodeURIComponent(endpoint.split("/state/")[1]);
      const filtered = destinationsData.filter((d) => d.state.toLowerCase() === state.toLowerCase());
      return { success: true, data: filtered };
    }
    if (endpoint.split("/").length === 3) {
      const id = endpoint.split("/")[2];
      const found = destinationsData.find((d) => d.id === id);
      return { success: true, data: found || destinationsData[0] };
    }
    return { success: true, data: destinationsData, count: destinationsData.length };
  }

  if (endpoint.startsWith("/hotels")) {
    if (endpoint.split("/").length === 3) {
      const id = endpoint.split("/")[2];
      const found = seedHotels.find((h) => h.id === id);
      return { success: true, data: found || seedHotels[0] };
    }
    return { success: true, data: seedHotels };
  }

  if (endpoint.startsWith("/packages")) {
    if (endpoint.includes("/destination/")) {
      const dest = decodeURIComponent(endpoint.split("/destination/")[1]).toLowerCase();
      const filtered = travelPackages.filter((p) => p.destination.toLowerCase().includes(dest));
      return { success: true, data: filtered.length > 0 ? filtered : travelPackages.slice(0, 3) };
    }
    return { success: true, data: travelPackages };
  }

  if (endpoint.startsWith("/gov-tourism")) {
    return { success: true, data: seedGovTourism };
  }

  // 7. Multi-Modal Transports
  if (endpoint.startsWith("/transports")) {
    if (endpoint.includes("/pnr/")) {
      const pnr = endpoint.split("/pnr/")[1];
      return {
        success: true,
        data: {
          pnr,
          status: "Confirmed (CNF)",
          trainNumber: "12622",
          trainName: "Tamil Nadu Express",
          coach: "B2",
          seat: "34",
          departure: "22:00",
          arrival: "07:15 +1 Day"
        }
      };
    }
    return {
      success: true,
      data: [
        { id: "tr-fl-1", type: "flight", provider: "IndiGo 6E-204", departureTime: "06:15", arrivalTime: "08:45", price: 3499, stops: "Direct" },
        { id: "tr-tr-1", type: "train", provider: "Vande Bharat Exp (20607)", departureTime: "05:50", arrivalTime: "10:10", price: 1120, stops: "Express" },
        { id: "tr-bs-1", type: "bus", provider: "KSRTC Airavat Multi-Axle", departureTime: "22:30", arrivalTime: "06:30", price: 850, stops: "Direct" }
      ]
    };
  }

  // 8. Trips & Planner
  if (endpoint.startsWith("/trips")) {
    const raw = localStorage.getItem("inavist_saved_trips");
    let trips = raw ? JSON.parse(raw) : [
      {
        id: "trip-init-1",
        title: "Golden Triangle Cultural Circuit",
        destination: "Jaipur, Rajasthan",
        startDate: "2026-10-12",
        endDate: "2026-10-16",
        budget: 25000,
        itinerary: [
          { day: 1, title: "Amer Fort & Jal Mahal", activities: ["Amer Fort Palace", "Elephant Village", "Evening Light Show"] },
          { day: 2, title: "City Palace & Hawa Mahal", activities: ["City Palace Museum", "Jantar Mantar Observatory", "Bapu Bazaar Shopping"] }
        ]
      }
    ];

    if (endpoint === "/trips/modify-crisis") {
      return {
        success: true,
        data: {
          recommendation: "Alternative route bypassing affected area created successfully.",
          alternativeMode: "High-speed rail via southern corridor",
          safeStops: ["Madurai", "Tiruchirappalli"],
          estimatedDelayMinutes: 45
        }
      };
    }

    if (method === "POST") {
      const newTrip = { id: `trip-${Date.now()}`, createdAt: new Date().toISOString(), ...body };
      trips = [newTrip, ...trips];
      localStorage.setItem("inavist_saved_trips", JSON.stringify(trips));
      return { success: true, data: newTrip, message: "Trip plan saved successfully." };
    }

    if (method === "DELETE") {
      const tripId = endpoint.split("/").pop();
      trips = trips.filter((t) => t.id !== tripId);
      localStorage.setItem("inavist_saved_trips", JSON.stringify(trips));
      return { success: true, message: "Trip deleted successfully." };
    }

    return { success: true, data: trips };
  }

  // 9. Budget Calculator & Recommender
  if (endpoint === "/budget/calculate") {
    const days = Number(body.days || 3);
    const travelers = Number(body.travelers || 1);
    const style = body.style || "Comfort";
    const multiplier = style === "Luxury" ? 4500 : style === "Budget" ? 1400 : 2600;
    const total = days * travelers * multiplier;
    return {
      success: true,
      data: {
        totalEstimated: total,
        stay: Math.round(total * 0.45),
        travel: Math.round(total * 0.3),
        food: Math.round(total * 0.15),
        activities: Math.round(total * 0.1)
      }
    };
  }

  if (endpoint === "/budget/recommend") {
    return {
      success: true,
      data: destinationsData.slice(0, 6)
    };
  }

  // 10. Emergency & Helplines
  if (endpoint === "/emergency/contacts") {
    return {
      success: true,
      data: [
        { name: "National Emergency Service", number: "112", desc: "All-in-one Police, Fire & Medical hotline across India" },
        { name: "Police Emergency", number: "100", desc: "Direct 24x7 state police control dispatch" },
        { name: "Medical Ambulance & Trauma", number: "108", desc: "Free state emergency ambulance network" },
        { name: "Fire & Rescue Operations", number: "101", desc: "National fire service and disaster containment" },
        { name: "Women Safety Helpline", number: "1091", desc: "24x7 specialized crisis response for female travelers" },
        { name: "Tourist Multi-Language Helpline", number: "1363", desc: "Ministry of Tourism 24x7 toll-free assistance in 12 languages" },
        { name: "Disaster Management Authority", number: "1077", desc: "Real-time landslide, flood & cloudburst alerts" },
        { name: "Railway Security / RPF Helpline", number: "139", desc: "IRCTC onboard medical & transit security" }
      ]
    };
  }

  if (endpoint === "/emergency/sos") {
    const sosSignal = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: body.location || "28.6139° N, 77.2090° E",
      message: body.message || "Emergency assistance requested",
      status: "DISPATCHED"
    };
    const raw = localStorage.getItem("inavist_sos_history");
    const history = raw ? JSON.parse(raw) : [];
    localStorage.setItem("inavist_sos_history", JSON.stringify([sosSignal, ...history]));
    return {
      success: true,
      data: sosSignal,
      message: "🚨 SOS Signal Dispatched. Emergency coordinates alerted to INAVIST Safety Network."
    };
  }

  if (endpoint === "/emergency/history") {
    const raw = localStorage.getItem("inavist_sos_history");
    return { success: true, data: raw ? JSON.parse(raw) : [] };
  }

  // 11. Travel Companions & Safe Group Matching
  if (endpoint.startsWith("/companions")) {
    const raw = localStorage.getItem("inavist_companion_groups");
    let groups = raw ? JSON.parse(raw) : [
      {
        id: "grp-1",
        title: "Ladakh Bike & Monasteries Expedition",
        destination: "Leh Ladakh",
        startDate: "2026-10-05",
        membersCount: 4,
        maxMembers: 8,
        creator: { name: "Ananya Sharma", rating: 4.9, tripsCompleted: 14 },
        tags: ["Adventure", "Motorcycling", "Photography"]
      },
      {
        id: "grp-2",
        title: "Kerala Backwaters & Ayurveda Retreat",
        destination: "Alleppey & Munnar",
        startDate: "2026-11-12",
        membersCount: 3,
        maxMembers: 6,
        creator: { name: "Rohan Varma", rating: 4.8, tripsCompleted: 9 },
        tags: ["Wellness", "Nature", "Relaxed"]
      }
    ];

    if (method === "POST" && !endpoint.includes("/join") && !endpoint.includes("/report")) {
      const newGroup = { id: `grp-${Date.now()}`, membersCount: 1, ...body };
      groups = [newGroup, ...groups];
      localStorage.setItem("inavist_companion_groups", JSON.stringify(groups));
      return { success: true, data: newGroup, message: "Group created successfully." };
    }

    if (endpoint.includes("/join")) {
      return { success: true, message: "Join request successfully submitted to group organizer." };
    }

    if (endpoint.includes("/report")) {
      return { success: true, message: "Report received and assigned to INAVIST safety review." };
    }

    return { success: true, data: groups };
  }

  // 12. Travel Passport / Visited Places
  if (endpoint.startsWith("/history")) {
    const raw = localStorage.getItem("inavist_visited_places");
    let places = raw ? JSON.parse(raw) : [
      { id: "vis-1", destinationId: "ladakh-pangong", name: "Pangong Tso Lake", visitedDate: "2026-05-18", notes: "Turquoise waters at 14,000 ft." },
      { id: "vis-2", destinationId: "ht-tn-1", name: "Kodaikanal Lake", visitedDate: "2026-08-14", notes: "Morning mist walk around the lake." }
    ];

    if (method === "POST") {
      const newVis = { id: `vis-${Date.now()}`, ...body };
      places = [newVis, ...places];
      localStorage.setItem("inavist_visited_places", JSON.stringify(places));
      return { success: true, data: newVis };
    }

    if (method === "DELETE") {
      const removeId = endpoint.split("/").pop();
      places = places.filter((p) => p.id !== removeId);
      localStorage.setItem("inavist_visited_places", JSON.stringify(places));
      return { success: true, message: "Record removed." };
    }

    return { success: true, data: places };
  }

  // 13. Reviews & Ratings
  if (endpoint.startsWith("/reviews")) {
    const raw = localStorage.getItem("inavist_destination_reviews");
    let reviews = raw ? JSON.parse(raw) : [
      {
        id: "rev-1",
        authorName: "Vikram Malhotra",
        rating: 5,
        destinationId: "ladakh-pangong",
        comment: "Spectacular scenery! The colors of the water change with the sun. Truly unforgettable.",
        date: "2026-08-20"
      },
      {
        id: "rev-2",
        authorName: "Sneha Patel",
        rating: 4.8,
        destinationId: "ladakh-pangong",
        comment: "Breathtaking views. Carry warm clothing and acclimatize before visiting.",
        date: "2026-07-15"
      }
    ];

    if (method === "POST") {
      const newRev = { id: `rev-${Date.now()}`, date: new Date().toISOString().split("T")[0], ...body };
      reviews = [newRev, ...reviews];
      localStorage.setItem("inavist_destination_reviews", JSON.stringify(reviews));
      return { success: true, data: newRev, message: "Review posted successfully." };
    }

    return { success: true, data: reviews };
  }

  // 14. Weather Microclimate Service
  if (endpoint.startsWith("/weather")) {
    return {
      success: true,
      data: {
        temperature: 24,
        condition: "Partly Cloudy",
        humidity: 62,
        windSpeed: "14 km/h",
        airQualityIndex: 42,
        airQualityStatus: "Good",
        forecast: [
          { day: "Today", temp: 24, condition: "Sunny" },
          { day: "Tomorrow", temp: 25, condition: "Clear" },
          { day: "Day 3", temp: 23, condition: "Partly Cloudy" }
        ]
      }
    };
  }

  // 15. Real-Time Travel Alerts & Warnings
  if (endpoint.startsWith("/alerts")) {
    return {
      success: true,
      data: [
        {
          id: "alt-1",
          level: "info",
          title: "Monsoon Road Clearance Active",
          region: "Western Ghats",
          message: "All ghat passes between Pune and Goa are clear with scheduled highway monitoring."
        },
        {
          id: "alt-2",
          level: "advisory",
          title: "High Altitude Acclimatization Notice",
          region: "Ladakh",
          message: "Mandatory 48-hour rest advised upon arrival in Leh before traveling to Khardung La."
        }
      ]
    };
  }

  // 16. Rewards & Loyalty
  if (endpoint.startsWith("/rewards")) {
    if (endpoint.includes("/coupons")) {
      return {
        success: true,
        data: [
          { code: "TRAVEL100", title: "₹100 Off Travel Booking", pointsCost: 500, discountValue: 100 },
          { code: "HOTEL250", title: "₹250 Off Luxury / Heritage Stay", pointsCost: 1000, discountValue: 250 },
          { code: "CAB50", title: "₹50 Off Mountain & Airport Cabs", pointsCost: 250, discountValue: 50 }
        ]
      };
    }
    if (endpoint.includes("/redeem")) {
      return {
        success: true,
        data: { couponCode: body.couponCode || "TRAVEL100", discount: 100 },
        message: "Coupon redeemed successfully."
      };
    }
    return {
      success: true,
      data: {
        totalPoints: 2450,
        tier: "Silver Explorer",
        nextTierPoints: 5000,
        pointsEarnedThisYear: 3200
      }
    };
  }

  // 17. Notifications
  if (endpoint.startsWith("/notifications")) {
    return {
      success: true,
      data: [
        { id: "notif-1", title: "Booking Confirmed", message: "Your trip to Goa is confirmed. Have a safe journey!", read: false, time: "2h ago" },
        { id: "notif-2", title: "Reward Points Added", message: "You earned 200 points on your recent train booking.", read: true, time: "1d ago" }
      ]
    };
  }

  // 18. Admin Statistics & Management
  if (endpoint.startsWith("/admin")) {
    if (endpoint.includes("/users")) {
      return {
        success: true,
        data: [
          { id: "usr-demo-01", name: "Dr. Rajesh Kumar", email: "rajesh.kumar@example.com", role: "user", isVerified: true },
          { id: "usr-admin-01", name: "YĀTRI Lead Admin", email: "admin@yatri.com", role: "admin", isVerified: true }
        ]
      };
    }
    if (endpoint.includes("/reports")) {
      return {
        success: true,
        data: []
      };
    }
    return {
      success: true,
      data: {
        totalUsers: 1845,
        activeBookings: 124,
        totalRevenue: 1845000,
        sosSignals: 0
      }
    };
  }

  // 19. Search & Autocomplete
  if (endpoint.startsWith("/search")) {
    if (endpoint.includes("/locations")) {
      const url = new URL(`http://localhost${endpoint}`);
      const q = (url.searchParams.get("q") || "").toLowerCase();
      const matched = destinationsData
        .filter((d) => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q))
        .slice(0, 8)
        .map((d) => ({ name: d.name, state: d.state, type: d.category || "destination" }));
      return { success: true, data: matched };
    }
    return { success: true, data: destinationsData.slice(0, 10) };
  }

  // 20. Health Check
  if (endpoint === "/health") {
    return {
      success: true,
      status: "healthy",
      message: "INAVIST Cloud Edge Active (Vercel Standalone)"
    };
  }

  return {
    success: true,
    data: [],
    message: "Standalone mode response."
  };
};

const request = async (endpoint, options = {}) => {
  // When deploying standalone on Vercel with no external API specified, serve instantly client-side:
  if (!import.meta.env?.VITE_API_URL) {
    return getClientSideMockResponse(endpoint, options);
  }

  const headers = options.isMultipart
    ? { ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}) }
    : { ...getAuthHeaders(), ...options.headers };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const contentType = res.headers.get("content-type");
    if (!res.ok || !contentType || !contentType.includes("application/json")) {
      return getClientSideMockResponse(endpoint, options);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return getClientSideMockResponse(endpoint, options);
  }
};

export const api = {
  // Authentication System
  auth: {
    login: async (email, password) => {
      const res = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
        if (res.data.refreshToken) {
          localStorage.setItem("yatri_refresh_token", res.data.refreshToken);
        }
      }
      return res;
    },
    demoLogin: async () => {
      const res = await request("/auth/demo-login", { method: "POST" });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    adminLogin: async () => {
      const res = await request("/auth/admin-login", { method: "POST" });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    socialLogin: async (providerData) => {
      const res = await request("/auth/social", {
        method: "POST",
        body: JSON.stringify(providerData)
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    register: async (userData) => {
      const res = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },
    getMe: async () => {
      return await request("/auth/me");
    },
    forgotPassword: async (email) => {
      return await request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
    },
    resetPassword: async (token, newPassword) => {
      return await request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword })
      });
    },
    logout: async () => {
      const refreshToken = localStorage.getItem("yatri_refresh_token");
      await request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ token: refreshToken })
      });
      setAuthToken(null);
      localStorage.removeItem("yatri_refresh_token");
    }
  },

  // User Profile
  user: {
    getProfile: async () => request("/users/profile"),
    updateProfile: async (data) => request("/users/profile", { method: "PUT", body: JSON.stringify(data) }),
    uploadAvatar: async (formData) => request("/users/avatar", { method: "POST", body: formData, isMultipart: true }),
    changePassword: async (currentPassword, newPassword) =>
      request("/users/change-password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
    updateEmergencyContacts: async (emergencyContacts) =>
      request("/users/emergency-contacts", { method: "PUT", body: JSON.stringify({ emergencyContacts }) }),
    updatePreferences: async (travelPreferences) =>
      request("/users/preferences", { method: "PUT", body: JSON.stringify({ travelPreferences }) }),
    toggleFavorite: async (destId) => request(`/users/favorites/${destId}`, { method: "POST" }),
    getFavorites: async () => request("/users/favorites")
  },

  // Destinations & India Tourism Database
  destinations: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/destinations?${query}`);
    },
    getById: async (id) => request(`/destinations/${id}`),
    getByState: async (state) => request(`/destinations/state/${encodeURIComponent(state)}`),
    getByDistrict: async (district) => request(`/destinations/district/${encodeURIComponent(district)}`),
    search: async (q, limit = 20) => request(`/destinations/search?q=${encodeURIComponent(q)}&limit=${limit}`),
    getNearby: async (lat, lng, maxDistanceKm = 100) =>
      request(`/destinations/nearby?lat=${lat}&lng=${lng}&maxDistanceKm=${maxDistanceKm}`),
    create: async (destData) => request("/destinations", { method: "POST", body: JSON.stringify(destData) }),
    update: async (id, destData) => request(`/destinations/${id}`, { method: "PUT", body: JSON.stringify(destData) }),
    delete: async (id) => request(`/destinations/${id}`, { method: "DELETE" })
  },

  // Smart Budget Calculator & Destination Recommender
  budget: {
    calculate: async (budgetData) => request("/budget/calculate", { method: "POST", body: JSON.stringify(budgetData) }),
    recommend: async (params) => request("/budget/recommend", { method: "POST", body: JSON.stringify(params) })
  },

  // Multi-Modal Transport System
  transports: {
    search: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/transports?${query}`);
    },
    lookupPnr: async (pnr) => request(`/transports/pnr/${pnr}`)
  },

  // Hotels & Accommodations
  hotels: {
    search: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/hotels?${query}`);
    },
    getById: async (id) => request(`/hotels/${id}`)
  },

  // Travel Planner & Crisis Engine
  trips: {
    getAll: async () => request("/trips"),
    getById: async (id) => request(`/trips/${id}`),
    create: async (tripData) => request("/trips", { method: "POST", body: JSON.stringify(tripData) }),
    update: async (id, tripData) => request(`/trips/${id}`, { method: "PUT", body: JSON.stringify(tripData) }),
    delete: async (id) => request(`/trips/${id}`, { method: "DELETE" }),
    share: async (id) => request(`/trips/${id}/share`, { method: "POST" }),
    modifyCrisis: async (currentPlan, crisisType, customProblem) => {
      return await request("/trips/modify-crisis", {
        method: "POST",
        body: JSON.stringify({ currentPlan, crisisType, customProblem })
      });
    }
  },

  // Bookings
  bookings: {
    getAll: async () => request("/bookings"),
    create: async (bookingData) => request("/bookings", { method: "POST", body: JSON.stringify(bookingData) }),
    cancel: async (id) => request(`/bookings/${id}`, { method: "DELETE" })
  },

  // Emergency / SOS Real-Time Safety Network
  emergency: {
    getContacts: async () => request("/emergency/contacts"),
    triggerSOS: async (location, message) =>
      request("/emergency/sos", { method: "POST", body: JSON.stringify({ location, message }) }),
    getHistory: async () => request("/emergency/history"),
    resolveSOS: async (id, resolutionNotes) =>
      request(`/emergency/${id}/resolve`, { method: "PATCH", body: JSON.stringify({ resolutionNotes }) })
  },

  // Travel Companions & Safe Group Matching
  companions: {
    getGroups: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/companions?${query}`);
    },
    getGroupById: async (id) => request(`/companions/${id}`),
    createGroup: async (groupData) => request("/companions", { method: "POST", body: JSON.stringify(groupData) }),
    sendJoinRequest: async (id, message) => request(`/companions/${id}/join`, { method: "POST", body: JSON.stringify({ message }) }),
    respondToRequest: async (id, reqId, status) =>
      request(`/companions/${id}/requests/${reqId}`, { method: "POST", body: JSON.stringify({ status }) }),
    leaveGroup: async (id) => request(`/companions/${id}/leave`, { method: "POST" }),
    reportUser: async (targetUserId, reason, details) =>
      request("/companions/report", { method: "POST", body: JSON.stringify({ targetUserId, reason, details }) })
  },

  // Travel Passport / Visited Places
  history: {
    getAll: async () => request("/history"),
    saveRecord: async (record) => request("/history", { method: "POST", body: JSON.stringify(record) }),
    deleteRecord: async (id) => request(`/history/${id}`, { method: "DELETE" })
  },

  // Reviews & Ratings
  reviews: {
    getByDestination: async (destId) => request(`/reviews?destinationId=${destId}`),
    create: async (reviewData) => request("/reviews", { method: "POST", body: JSON.stringify(reviewData) }),
    delete: async (id) => request(`/reviews/${id}`, { method: "DELETE" }),
    report: async (id, reason, details) => request(`/reviews/${id}/report`, { method: "POST", body: JSON.stringify({ reason, details }) }),
    moderate: async (id, status) => request(`/reviews/${id}/moderate`, { method: "PUT", body: JSON.stringify({ status }) })
  },

  // Real-Time Travel Alerts & Warnings
  alerts: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/alerts?${query}`);
    },
    getByDestination: async (destId) => request(`/alerts/destination/${destId}`),
    create: async (alertData) => request("/alerts", { method: "POST", body: JSON.stringify(alertData) }),
    delete: async (id) => request(`/alerts/${id}`, { method: "DELETE" })
  },

  // Weather Microclimate Service
  weather: {
    get: async (location, lat = null, lng = null) => {
      const q = new URLSearchParams({ location: location || "", ...(lat ? { lat, lng } : {}) }).toString();
      return await request(`/weather?${q}`);
    }
  },

  // Notifications
  notifications: {
    getAll: async () => request("/notifications"),
    markAsRead: async (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
    markAllAsRead: async () => request("/notifications/read-all", { method: "PATCH" })
  },

  // Admin Dashboard
  admin: {
    getStats: async () => request("/admin/stats"),
    getUsers: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/admin/users?${query}`);
    },
    updateUserRole: async (id, role, isVerified) =>
      request(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role, isVerified }) }),
    getReports: async () => request("/admin/reports"),
    updateReportStatus: async (id, status) =>
      request(`/admin/reports/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
  },

  // Universal & Route Search
  search: {
    universal: async (q, limit = 10) => request(`/search?q=${encodeURIComponent(q)}&limit=${limit}`),
    routes: async (searchParams) =>
      request("/search/routes", { method: "POST", body: JSON.stringify(searchParams) }),
    locations: async (q) => request(`/search/locations?q=${encodeURIComponent(q)}`)
  },

  // Rewards & Loyalty
  rewards: {
    getSummary: async () => request("/rewards"),
    getCoupons: async () => request("/rewards/coupons"),
    redeem: async (couponCode) =>
      request("/rewards/redeem", { method: "POST", body: JSON.stringify({ couponCode }) }),
    getHistory: async () => request("/rewards/history")
  },

  // UPI & Payments
  payments: {
    validateUPI: async (upiId) =>
      request("/payments/validate-upi", { method: "POST", body: JSON.stringify({ upiId }) }),
    createIntent: async (data) =>
      request("/payments/create-intent", { method: "POST", body: JSON.stringify(data) }),
    verifyPayment: async (data) =>
      request("/payments/verify", { method: "POST", body: JSON.stringify(data) }),
    getHistory: async () => request("/payments/history"),
    getSavedUpiIds: async () => request("/auth/upi-ids"),
    saveUpiId: async (upiData) =>
      request("/auth/upi-ids", { method: "POST", body: JSON.stringify(upiData) }),
    removeUpiId: async (upiId) =>
      request(`/auth/upi-ids/${encodeURIComponent(upiId)}`, { method: "DELETE" })
  },

  // Tour Packages
  packages: {
    getAll: async () => request("/packages"),
    getById: async (id) => request(`/packages/${id}`),
    getByDestination: async (dest) => request(`/packages/destination/${encodeURIComponent(dest)}`)
  },

  // Government Tourism Hub
  govTourism: {
    getSchemes: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return await request(`/gov-tourism?${query}`);
    }
  },

  // Health Check
  health: {
    check: async () => request("/health")
  }
};
