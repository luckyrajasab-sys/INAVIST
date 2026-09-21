import { destinationsData } from "./destinationsData.js";
import { mockTransportRoutes } from "./transportsData.js";
import { seedHotels, seedGovTourism, seedTravelAlerts } from "./seedData.js";

// In-Memory Database Store with Pre-Seeded Production Records
class Database {
  constructor() {
    this.destinations = [...destinationsData];
    this.hotels = [...seedHotels];
    this.transports = [...mockTransportRoutes];
    this.govTourism = [...seedGovTourism];
    this.alerts = [...seedTravelAlerts];

    // Seeded Users
    this.users = [
      {
        id: "usr-admin-01",
        name: "YĀTRI Lead Admin",
        email: "admin@yatri.com",
        passwordHash: "$2a$08$K1.eBwXN82Y.Z9d93HlZveaH9xI6n82v3lP4M6zO5k3fL1Q4a9w7u",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
        homeCity: "New Delhi, India",
        createdAt: "2024-01-01"
      },
      {
        id: "usr-demo-01",
        name: "Arjun Verma",
        email: "arjun@yatri.com",
        passwordHash: "$2a$08$U2.fCxYO93Z.A0e04ImAwfbI0yJ7o93w4mQ5N7aP6l4gM2R5b0x8v",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
        verificationType: "Government ID Verified (Simulated)",
        homeCity: "New Delhi, India",
        createdAt: "2024-03-15"
      }
    ];


    // Seeded Reviews
    this.reviews = [
      {
        id: "rev-1",
        destinationId: "ladakh-pangong",
        userId: "usr-demo-01",
        userName: "Arjun Verma",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        rating: 5.0,
        ratings: {
          experience: 5,
          cleanliness: 5,
          safety: 4.8,
          accessibility: 4.2,
          valueForMoney: 4.9
        },
        comment: "The color transitions on Pangong Tso at sunrise are completely surreal. Definitely stay overnight in wooden yurts near Spangmik to catch the 6 AM morning mirror reflections!",
        travelTips: "Acclimatize in Leh for at least 48 hours and carry plenty of thermal layers as night temps drop below freezing.",
        createdAt: "2026-07-12",
        status: "approved"
      },
      {
        id: "rev-2",
        destinationId: "ka-hampi-ruins",
        userId: "usr-demo-01",
        userName: "Aanya Sharma",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        ratings: {
          experience: 5,
          cleanliness: 4.8,
          safety: 4.9,
          accessibility: 4.7,
          valueForMoney: 5
        },
        comment: "Hampi is like stepping into an open-air boulder museum. Matanga Hill sunrise and coracle boating across Tungabhadra river were the highlights.",
        travelTips: "Rent a bicycle or moped to easily explore Vittala Temple and the Lotus Mahal complex.",
        createdAt: "2026-06-20",
        status: "approved"
      }
    ];

    // Seeded Trips
    this.trips = [
      {
        id: "trip-sample-1",
        userId: "usr-demo-01",
        title: "Ladakh High Altitude Expedition",
        startCity: "New Delhi",
        destinationId: "ladakh-pangong",
        destinationName: "Pangong Tso & Nubra Valley",
        travellers: 2,
        days: 5,
        totalEstimatedBudget: 38000,
        budgetPerPerson: 19000,
        status: "active",
        createdAt: "2026-08-15",
        itinerary: [
          { day: 1, theme: "Arrival in Leh & Acclimatization", activities: [{ time: "09:30 AM", title: "Flight arrival in Leh", cost: 5500 }, { time: "05:00 PM", title: "Shanti Stupa sunset walk", cost: 100 }], stayCost: 3500 },
          { day: 2, theme: "Leh Palace & Magnetic Hill", activities: [{ time: "10:00 AM", title: "Visit Hall of Fame & Spituk Gompa", cost: 400 }, { time: "02:30 PM", title: "Magnetic Hill & Sangam confluence", cost: 800 }], stayCost: 3500 },
          { day: 3, theme: "Crossing Khardung La to Nubra Valley", activities: [{ time: "07:00 AM", title: "Drive through Khardung La (17,982 ft)", cost: 2500 }, { time: "04:30 PM", title: "Hunder Sand Dunes & Bactrian Camels", cost: 600 }], stayCost: 2800 },
          { day: 4, theme: "Shyok Route to Pangong Tso Lake", activities: [{ time: "08:00 AM", title: "Scenic drive along Shyok River", cost: 2800 }, { time: "05:30 PM", title: "Sunset at Pangong Lake shoreline", cost: 200 }], stayCost: 3000 },
          { day: 5, theme: "Sunrise & Return to Leh via Chang La", activities: [{ time: "06:00 AM", title: "Sunrise photography at Pangong", cost: 0 }, { time: "01:00 PM", title: "Head to Leh Airport", cost: 1500 }], stayCost: 0 }
        ]
      }
    ];

    // Seeded Bookings
    this.bookings = [
      {
        id: "bk-1",
        pnr: "YTR-748921",
        userId: "usr-demo-01",
        type: "flight",
        title: "IndiGo Flight DEL -> IXL",
        details: "Delhi (DEL) to Leh Ladakh (IXL)",
        travelDate: "2026-09-12",
        passengers: 2,
        amount: 10998,
        status: "Confirmed",
        bookedAt: "2026-08-20 14:32"
      }
    ];
  }
}

export const db = new Database();
