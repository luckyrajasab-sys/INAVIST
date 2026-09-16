import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

import { destinationsData } from "../../../frontend/src/data/destinationsData.js";
import { mockTravelCompanions } from "../../../frontend/src/data/companionsData.js";
import { mockTransportRoutes } from "../../../frontend/src/data/transportsData.js";
import { seedHotels, seedGovTourism, seedTravelAlerts } from "../../../frontend/src/data/seedData.js";

import { Destination } from "../models/Destination.js";
import { User } from "../models/User.js";
import { Hotel } from "../models/Hotel.js";
import { Transport } from "../models/Transport.js";
import { Alert } from "../models/Alert.js";
import { CompanionGroup } from "../models/CompanionGroup.js";
import { Review } from "../models/Review.js";
import { GovScheme } from "../models/GovScheme.js";
import { Trip } from "../models/Trip.js";
import { Booking } from "../models/Booking.js";
import { logger } from "../utils/logger.js";
import { connectDB, disconnectDB } from "../config/db.js";

export const seedInitialData = async () => {
  try {
    const destCount = await Destination.countDocuments();
    if (destCount >= 100) {
      logger.info(`Database already seeded with ${destCount} destinations.`);
      return;
    }

    logger.info("⚡ Seeding comprehensive YĀTRI dataset into MongoDB...");

    // 1. Seed Users
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const demoPasswordHash = await bcrypt.hash("demo123", 10);

    const users = await User.create([
      {
        name: "YĀTRI Lead Admin",
        email: "admin@yatri.com",
        passwordHash: adminPasswordHash,
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
        homeCity: "New Delhi, India"
      },
      {
        name: "Arjun Verma",
        email: "arjun@yatri.com",
        passwordHash: demoPasswordHash,
        role: "user",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        isVerified: true,
        verificationType: "Government ID (Aadhaar Verified)",
        homeCity: "New Delhi, India",
        travelStyle: "Spiritual & Mountain Heritage",
        emergencyContacts: [
          { name: "Sunil Verma (Father)", phone: "+91 98111 22334", relation: "Father" },
          { name: "Pooja Verma (Sister)", phone: "+91 98222 33445", relation: "Sister" }
        ],
        travelPreferences: {
          travelStyle: "Spiritual & Mountain Heritage",
          preferredTransport: "Train / Flight",
          budgetLevel: "Moderate",
          dietary: "Vegetarian"
        }
      }
    ]);

    const demoUser = users[1];

    // 2. Seed 165+ Curated Indian Destinations
    const destinationsToInsert = destinationsData.map((d) => ({
      id: d.id,
      name: d.name,
      state: d.state,
      district: d.district,
      region: d.region || "North",
      category: d.category || "nature",
      isHiddenGem: !!d.isHiddenGem,
      rating: d.rating || 4.6,
      reviewsCount: d.reviewsCount || Math.floor(200 + Math.random() * 2000),
      images: d.images || [],
      description: d.description || "",
      detailedDescription: d.detailedDescription || d.description || "",
      coordinates: d.coordinates || { lat: 28.6139, lng: 77.2090 },
      location: {
        type: "Point",
        coordinates: [d.coordinates?.lng || 77.2090, d.coordinates?.lat || 28.6139]
      },
      viewpointStatus: d.viewpointStatus || "OPEN",
      viewpointTimings: d.viewpointTimings || { open: "06:00 AM", close: "06:00 PM" },
      crowdLevel: d.crowdLevel || "Moderate",
      crowdPercentage: d.crowdPercentage || 50,
      estimatedCosts: d.estimatedCosts || { travel: 1500, stay: 2000, food: 600, entry: 50, activities: 400 },
      entryFee: d.entryFee || 0,
      safetyRating: d.safetyRating || 4.7,
      safetyTips: d.safetyTips || ["Carry warm clothing", "Keep emergency numbers handy"],
      emergencyInfo: d.emergencyInfo || { policePhone: "112", medicalPhone: "108", disasterHelp: "1077" },
      foodRecommendations: d.foodRecommendations || [],
      availableTransport: d.availableTransport || [],
      nearbyAttractions: d.nearbyAttractions || [],
      hiddenPlacesNearby: d.hiddenPlacesNearby || [],
      localLanguages: d.localLanguages || ["Hindi", "English"],
      tags: d.tags || [d.category, d.state]
    }));

    await Destination.insertMany(destinationsToInsert);
    logger.info(`✅ Seeded ${destinationsToInsert.length} Indian destinations across all states & UTs.`);

    // 3. Seed Hotels
    const hotelsToInsert = seedHotels.map((h) => ({
      id: h.id,
      name: h.name,
      state: h.state,
      district: h.district,
      city: h.city,
      type: (h.type || "hotel").toLowerCase(),
      rating: h.rating || 4.6,
      reviewsCount: h.reviewsCount || 500,
      pricePerNight: h.basePrice || 2500,
      images: h.images || [],
      address: `${h.area || h.city}, ${h.district}, ${h.state}`,
      amenities: h.amenities || ["Wi-Fi", "Hot Water", "Room Service"],
      roomTypes: (h.rooms || []).map((r) => ({
        type: r.type,
        price: r.price,
        availableRooms: r.available || 5
      }))
    }));
    await Hotel.insertMany(hotelsToInsert);

    // 4. Seed Transport Routes
    const transportToInsert = mockTransportRoutes.map((t) => ({
      mode: t.type || t.mode || "flight",
      operator: t.operator || "Indian Transit Network",
      routeNumber: t.routeNumber || t.id || "IN-EXP-01",
      originCity: t.from || t.originCity || "New Delhi",
      destinationCity: t.to || t.destinationCity || "Mumbai",
      departureTime: t.departure || t.departureTime || "08:00 AM",
      arrivalTime: t.arrival || t.arrivalTime || "11:00 AM",
      duration: t.duration || "3h 00m",
      frequency: t.frequency || "Daily",
      basePrice: t.price || t.basePrice || 2500,
      classes: t.classes || [{ className: t.class || "Standard", price: t.price || 2500, availableSeats: t.availableSeats || 15 }],
      vehicleType: t.vehicleType || t.operator,
      rating: t.rating || 4.7
    }));
    await Transport.insertMany(transportToInsert);

    // 5. Seed Travel Alerts
    const alertsToInsert = seedTravelAlerts.map((a) => ({
      title: a.title || "Travel Notice",
      destinationId: a.destinationId || a.id,
      destinationName: a.destinationName || a.destination || "Pan-India",
      state: a.state || a.destination || "Pan-India",
      district: a.district || "",
      severity: a.severity === "warning" ? "high" : (a.severity || "moderate"),
      alertType: "weather",
      description: a.description || a.message || a.title,
      advice: a.advice || "Check with local authorities before departure.",
      issuedBy: a.issuedBy || "YĀTRI Emergency Dispatch",
      isActive: true
    }));
    await Alert.insertMany(alertsToInsert);

    // 6. Seed Travel Companions / Groups
    const groupsToInsert = mockTravelCompanions.map((c) => ({
      creatorId: demoUser._id,
      creatorName: c.name,
      creatorAvatar: c.avatar,
      title: `${c.destination} Exploration Trip`,
      destination: c.destination,
      travelDates: {
        displayStr: c.travelDates
      },
      travelersNeeded: 3,
      travelersCount: 1,
      budgetPerPerson: 7500,
      interests: c.interests || ["Trekking", "Photography"],
      bio: c.bio,
      description: c.bio,
      requiredVerification: true,
      status: "open",
      members: [
        {
          userId: demoUser._id,
          name: c.name,
          avatar: c.avatar,
          role: "leader"
        }
      ]
    }));
    await CompanionGroup.insertMany(groupsToInsert);

    // 7. Seed Reviews
    await Review.create([
      {
        destinationId: "ladakh-pangong",
        userId: demoUser._id,
        userName: "Arjun Verma",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        rating: 5,
        ratings: { experience: 5, cleanliness: 5, safety: 4.8, accessibility: 4.2, valueForMoney: 4.9 },
        comment: "The color transitions on Pangong Tso at sunrise are completely surreal. Stay overnight in wooden yurts near Spangmik to catch the 6 AM morning mirror reflections!",
        travelTips: "Acclimatize in Leh for at least 48 hours and carry plenty of thermal layers.",
        status: "approved"
      },
      {
        destinationId: "ka-hampi-ruins",
        userId: demoUser._id,
        userName: "Aanya Sharma",
        userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        rating: 4.9,
        ratings: { experience: 5, cleanliness: 4.8, safety: 4.9, accessibility: 4.7, valueForMoney: 5 },
        comment: "Hampi is like stepping into an open-air boulder museum. Matanga Hill sunrise and coracle boating across Tungabhadra river were the highlights.",
        travelTips: "Rent a bicycle or moped to easily explore Vittala Temple and the Lotus Mahal complex.",
        status: "approved"
      }
    ]);

    // 8. Seed Gov Tourism Schemes
    const govSchemesToInsert = seedGovTourism.map((g) => ({
      title: g.title || g.name,
      ministry: g.ministry || "Ministry of Tourism, Govt. of India",
      category: g.category || "Heritage & Pilgrim Tourism",
      description: g.description,
      benefits: g.benefits || [],
      eligibility: g.eligibility || "All Indian & International Tourists",
      officialUrl: g.officialUrl || g.officialLink || "https://tourism.gov.in",
      state: g.state || "National / Pan-India"
    }));
    await GovScheme.insertMany(govSchemesToInsert);

    // 9. Seed Sample Trips & Bookings
    await Trip.create({
      userId: demoUser._id,
      userEmail: demoUser.email,
      title: "Ladakh High Altitude Expedition",
      startCity: "New Delhi",
      destinationId: "ladakh-pangong",
      destinationName: "Pangong Tso & Nubra Valley",
      travellers: 2,
      days: 5,
      totalEstimatedBudget: 38000,
      budgetPerPerson: 19000,
      status: "active",
      itinerary: [
        { day: 1, theme: "Arrival in Leh & Acclimatization", activities: [{ time: "09:30 AM", title: "Flight arrival in Leh", cost: 5500 }, { time: "05:00 PM", title: "Shanti Stupa sunset walk", cost: 100 }], stayCost: 3500 },
        { day: 2, theme: "Leh Palace & Magnetic Hill", activities: [{ time: "10:00 AM", title: "Visit Hall of Fame & Spituk Gompa", cost: 400 }, { time: "02:30 PM", title: "Magnetic Hill & Sangam confluence", cost: 800 }], stayCost: 3500 },
        { day: 3, theme: "Crossing Khardung La to Nubra Valley", activities: [{ time: "07:00 AM", title: "Drive through Khardung La (17,982 ft)", cost: 2500 }, { time: "04:30 PM", title: "Hunder Sand Dunes & Bactrian Camels", cost: 600 }], stayCost: 2800 },
        { day: 4, theme: "Shyok Route to Pangong Tso Lake", activities: [{ time: "08:00 AM", title: "Scenic drive along Shyok River", cost: 2800 }, { time: "05:30 PM", title: "Sunset at Pangong Lake shoreline", cost: 200 }], stayCost: 3000 },
        { day: 5, theme: "Sunrise & Return to Leh via Chang La", activities: [{ time: "06:00 AM", title: "Sunrise photography at Pangong", cost: 0 }, { time: "01:00 PM", title: "Head to Leh Airport", cost: 1500 }], stayCost: 0 }
      ]
    });

    await Booking.create({
      userId: demoUser._id,
      bookingId: "INV-92841",
      pnr: "YTR-748921",
      type: "flight",
      title: "IndiGo Flight DEL -> IXL",
      originCity: "New Delhi",
      destinationCity: "Leh Ladakh",
      travelDate: "2026-09-12",
      passengerCount: 2,
      passengers: [
        { name: "Arjun Verma", age: 28, gender: "Male", idType: "Aadhaar", seatNumber: "12A" },
        { name: "Meera Verma", age: 26, gender: "Female", idType: "Aadhaar", seatNumber: "12B" }
      ],
      pricing: {
        baseFare: 9800,
        taxes: 1198,
        totalAmount: 10998
      },
      amount: 10998,
      paymentDetails: {
        method: "UPI",
        upiId: "arjun@upi",
        transactionId: "UPI/INV/2026/8920194",
        status: "VERIFIED"
      },
      rewardPointsEarned: 1100,
      status: "Confirmed",
      contactEmail: "arjun@yatri.com",
      contactPhone: "+91 98111 22334"
    });

    logger.info("🎉 Database seeding completed successfully!");
  } catch (error) {
    logger.error("Database seeding failed:", error);
  }
};

// If run directly via CLI (npm run seed)
if (process.argv[1]?.endsWith("seed.js")) {
  (async () => {
    await connectDB();
    await seedInitialData();
    await disconnectDB();
    process.exit(0);
  })();
}
