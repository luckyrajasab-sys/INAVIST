import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";
import { TravelSyncService } from "../services/TravelSyncService";
import { FirestoreService } from "../services/FirestoreService.js";

const PlannerContext = createContext(null);

const DEFAULT_EMERGENCY_CONTACTS = [
  {
    id: "ec-1",
    name: "Dr. Ramesh Verma",
    relation: "Father / Family",
    phone: "+91 98110 45220",
    isPrimary: true
  },
  {
    id: "ec-2",
    name: "Sneha Verma",
    relation: "Sister / Emergency",
    phone: "+91 98712 33410",
    isPrimary: false
  },
  {
    id: "ec-3",
    name: "National All-India Emergency",
    relation: "Police / Fire / Medical",
    phone: "112",
    isPrimary: false,
    isOfficial: true
  },
  {
    id: "ec-4",
    name: "Ministry of Tourism Helpline",
    relation: "Tourist Police Assistance",
    phone: "1363",
    isPrimary: false,
    isOfficial: true
  }
];

const DEFAULT_VISITED = [
  {
    id: "ladakh-pangong",
    name: "Pangong Tso Lake",
    state: "Ladakh",
    district: "Leh",
    visitDate: "June 2025",
    spending: 14500,
    rating: 5,
    memoryNote: "Unreal turquoise reflection at 6 AM. Stayed in wooden yurt near Spangmik."
  },
  {
    id: "raj-jaipur-amer",
    name: "Amer Fort & Sheesh Mahal",
    state: "Rajasthan",
    district: "Jaipur",
    visitDate: "December 2024",
    spending: 6200,
    rating: 5,
    memoryNote: "Incredible mirror palace craftsmanship and evening lighting."
  },
  {
    id: "kl-munnar-tea",
    name: "Munnar Tea Estates",
    state: "Kerala",
    district: "Idukki",
    visitDate: "January 2026",
    spending: 8900,
    rating: 5,
    memoryNote: "4x4 sunrise jeep drive above clouds at Kolukkumalai."
  },
  {
    id: "wb-darjeeling-toy-train",
    name: "Darjeeling Tiger Hill & Himalayan Railway",
    state: "West Bengal",
    district: "Darjeeling",
    visitDate: "October 2025",
    spending: 7400,
    rating: 4.8,
    memoryNote: "Kanchenjunga golden dawn followed by steam toy train ride over Batasia loop."
  }
];

const DEFAULT_SAVED_TRIPS = [
  {
    id: "trip-sample-1",
    title: "Ladakh High Altitude Odyssey",
    startCity: "New Delhi",
    destinationId: "ladakh-pangong",
    destinationName: "Pangong Tso & Nubra Valley",
    travellers: 2,
    days: 6,
    budgetPerPerson: 22000,
    totalEstimatedBudget: 44000,
    createdAt: "2026-08-10",
    itinerary: [
      { day: 1, title: "Acclimatization in Leh & Shanti Stupa", time: "09:00 AM", cost: 1200 },
      { day: 2, title: "Leh Palace & Magnetic Hill", time: "10:00 AM", cost: 1500 },
      { day: 3, title: "Drive through Khardung La to Nubra Valley", time: "07:00 AM", cost: 4500 },
      { day: 4, title: "Hunder Sand Dunes & Diskit Monastery", time: "08:30 AM", cost: 2200 },
      { day: 5, title: "Shyok River Road to Pangong Tso Lake", time: "07:30 AM", cost: 4800 },
      { day: 6, title: "Sunrise at Pangong & Return to Leh via Chang La", time: "06:00 AM", cost: 3800 }
    ]
  }
];

export const PlannerProvider = ({ children }) => {
  const { user } = useAuth();

  // Saved Itineraries
  const [savedTrips, setSavedTrips] = useState(() => {
    const saved = localStorage.getItem("yatra_trips");
    return saved ? JSON.parse(saved) : DEFAULT_SAVED_TRIPS;
  });

  // Visited Destinations for Travel Passport
  const [visitedDestinations, setVisitedDestinations] = useState(() => {
    const saved = localStorage.getItem("yatra_visited");
    return saved ? JSON.parse(saved) : DEFAULT_VISITED;
  });

  // Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    const saved = localStorage.getItem("yatra_emergency_contacts");
    return saved ? JSON.parse(saved) : DEFAULT_EMERGENCY_CONTACTS;
  });

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const saved = localStorage.getItem("yatra_bookmarks");
    return saved ? JSON.parse(saved) : ["ladakh-pangong", "ml-cherrapunji-living-roots", "ap-gandikota-canyon"];
  });

  // Booked Transport Tickets
  const [bookedTickets, setBookedTickets] = useState(() => {
    const saved = localStorage.getItem("yatra_booked_tickets");
    return saved ? JSON.parse(saved) : [];
  });

  // Active Detail Modal Target
  const [activeDestination, setActiveDestination] = useState(null);

  // Active Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("yatra_trips", JSON.stringify(savedTrips));
  }, [savedTrips]);

  useEffect(() => {
    localStorage.setItem("yatra_visited", JSON.stringify(visitedDestinations));
  }, [visitedDestinations]);

  useEffect(() => {
    localStorage.setItem("yatra_emergency_contacts", JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  useEffect(() => {
    localStorage.setItem("yatra_bookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem("yatra_booked_tickets", JSON.stringify(bookedTickets));
  }, [bookedTickets]);

  // Real-time Firestore Cloud Sync for Authenticated User
  useEffect(() => {
    if (!user?.id) return;

    // 1. Subscribe to User Trips in Firestore
    const unsubTrips = FirestoreService.subscribeUserTrips(
      user.id,
      (cloudTrips) => {
        if (cloudTrips && cloudTrips.length > 0) {
          setSavedTrips((prev) => {
            const cloudIds = new Set(cloudTrips.map((t) => t.id));
            const localOnly = prev.filter((t) => !cloudIds.has(t.id));
            const merged = [...cloudTrips, ...localOnly];
            localStorage.setItem("yatra_trips", JSON.stringify(merged));
            return merged;
          });
        }
      },
      (err) => console.warn("Trips sync notice:", err.message)
    );

    // 2. Subscribe to User Favorites in Firestore
    const unsubFavs = FirestoreService.subscribeFavorites(
      user.id,
      (cloudFavs) => {
        if (cloudFavs && cloudFavs.length > 0) {
          const favIds = cloudFavs.map((f) => f.destinationId);
          setBookmarkedIds((prev) => {
            const merged = Array.from(new Set([...favIds, ...prev]));
            localStorage.setItem("yatra_bookmarks", JSON.stringify(merged));
            return merged;
          });
        }
      },
      (err) => console.warn("Favorites sync notice:", err.message)
    );

    // 3. Subscribe to User Bookings in Firestore
    const unsubBookings = FirestoreService.subscribeUserBookings(
      user.id,
      (cloudBookings) => {
        if (cloudBookings && cloudBookings.length > 0) {
          setBookedTickets(cloudBookings);
          try {
            localStorage.setItem("inavist_all_bookings", JSON.stringify(cloudBookings));
          } catch (e) {}
        }
      },
      (err) => console.warn("Bookings sync notice:", err.message)
    );

    // 4. Subscribe to Emergency Contacts
    const unsubContacts = TravelSyncService.subscribeEmergencyContacts(user.id, (cloudContacts) => {
      if (cloudContacts && cloudContacts.length > 0) {
        setEmergencyContacts(cloudContacts);
        localStorage.setItem("yatra_emergency_contacts", JSON.stringify(cloudContacts));
      }
    });

    return () => {
      if (unsubTrips) unsubTrips();
      if (unsubFavs) unsubFavs();
      if (unsubBookings) unsubBookings();
      if (unsubContacts) unsubContacts();
    };
  }, [user?.id]);

  // Synchronize trips and visited places with backend
  useEffect(() => {
    api.trips.getAll().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSavedTrips((prev) => {
          const ids = new Set(res.data.map((t) => t.id || t._id));
          const localOnly = prev.filter((t) => !ids.has(t.id));
          const merged = [...res.data, ...localOnly];
          localStorage.setItem("yatra_trips", JSON.stringify(merged));
          return merged;
        });
      }
    }).catch((err) => {
      console.warn("Could not sync trips from backend:", err);
    });

    api.history.getAll().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setVisitedDestinations((prev) => {
          const ids = new Set(res.data.map((v) => v.destinationId || v.id || v._id));
          const localOnly = prev.filter((v) => !ids.has(v.id));
          const merged = [...res.data, ...localOnly];
          localStorage.setItem("yatra_visited", JSON.stringify(merged));
          return merged;
        });
      }
    }).catch((err) => {
      console.warn("Could not sync visited places from backend:", err);
    });
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleBookmark = async (id, destData = {}) => {
    const exists = bookmarkedIds.includes(id);
    try {
      if (user?.id) {
        if (exists) {
          await FirestoreService.removeFavorite(user.id, id);
        } else {
          await FirestoreService.addFavorite(user.id, id, destData);
        }
      }
      const updated = exists ? bookmarkedIds.filter((item) => item !== id) : [...bookmarkedIds, id];
      setBookmarkedIds(updated);
      localStorage.setItem("yatra_bookmarks", JSON.stringify(updated));
      showToast(exists ? "Removed from favorites" : "Saved to your favorites! 🔖");
      return !exists;
    } catch (err) {
      console.warn("toggleBookmark error:", err);
      showToast(err.message || "Failed to update favorite", "error");
      throw err;
    }
  };

  const toggleVisited = (destination, note = "", spending = 0) => {
    setVisitedDestinations((prev) => {
      const exists = prev.find((v) => v.id === destination.id);
      if (exists) {
        showToast(`Removed ${destination.name} from visited places`);
        return prev.filter((v) => v.id !== destination.id);
      } else {
        const newRecord = {
          id: destination.id,
          name: destination.name,
          state: destination.state,
          district: destination.district,
          visitDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          spending: spending || destination.estimatedCosts.stay + destination.estimatedCosts.food,
          rating: 5,
          memoryNote: note || `Explored ${destination.name} with Yatra 2.0.`
        };
        showToast(`Marked ${destination.name} as Visited! Passport stamped ✈️`);
        return [newRecord, ...prev];
      }
    });
  };

  const isVisited = (id) => {
    return visitedDestinations.some((v) => v.id === id);
  };

  const isBookmarked = (id) => {
    return bookmarkedIds.includes(id);
  };

  const saveTrip = async (trip) => {
    const newTrip = {
      id: trip.id || `trip-${Date.now()}`,
      userId: user?.id,
      createdAt: trip.createdAt || new Date().toISOString().split("T")[0],
      ...trip
    };
    try {
      if (user?.id) {
        await FirestoreService.createTrip(user.id, newTrip);
        TravelSyncService.saveTrip(user.id, newTrip);
      }
      setSavedTrips((prev) => [newTrip, ...prev.filter((t) => t.id !== newTrip.id)]);
      showToast("Trip itinerary saved successfully! 🎒");
      api.trips.create(newTrip).catch(() => {});
      return newTrip;
    } catch (err) {
      console.warn("Could not save trip to cloud:", err);
      showToast(err.message || "Could not save trip to Firestore.", "error");
      throw err;
    }
  };

  const updateTrip = async (tripId, updatedData) => {
    try {
      if (user?.id) {
        await FirestoreService.updateTrip(user.id, tripId, updatedData);
      }
      setSavedTrips((prev) =>
        prev.map((t) => (t.id === tripId ? { ...t, ...updatedData, updatedAt: new Date().toISOString() } : t))
      );
      showToast("Trip itinerary updated! 🎒");
      return true;
    } catch (err) {
      console.warn("Could not update trip:", err);
      showToast(err.message || "Failed to update trip.", "error");
      throw err;
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      if (user?.id) {
        await FirestoreService.deleteTrip(user.id, tripId);
        TravelSyncService.deleteTrip(user.id, tripId);
      }
      setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
      showToast("Trip itinerary removed");
      api.trips.delete(tripId).catch(() => {});
      return true;
    } catch (err) {
      console.warn("Could not delete trip:", err);
      showToast(err.message || "Could not delete trip.", "error");
      throw err;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      if (user?.id) {
        await FirestoreService.cancelBooking(user.id, bookingId);
      }
      setBookedTickets((prev) =>
        prev.map((b) => (b.id === bookingId || b.bookingId === bookingId ? { ...b, status: "cancelled" } : b))
      );
      showToast("Booking cancelled successfully.");
      return true;
    } catch (err) {
      console.warn("cancelBooking error:", err);
      showToast(err.message || "Could not cancel booking.", "error");
      throw err;
    }
  };

  const addEmergencyContact = (contact) => {
    const newContact = {
      id: `ec-${Date.now()}`,
      isPrimary: false,
      ...contact
    };
    setEmergencyContacts((prev) => [...prev, newContact]);
    showToast("Emergency contact added securely!");
    if (user?.id) {
      TravelSyncService.saveEmergencyContact(user.id, newContact);
    }
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));
    showToast("Contact deleted");
    if (user?.id) {
      TravelSyncService.deleteEmergencyContact(user.id, id);
    }
  };

  const setPrimaryContact = (id) => {
    const updated = emergencyContacts.map((c) => ({
      ...c,
      isPrimary: c.id === id
    }));
    setEmergencyContacts(updated);
    showToast("Primary emergency contact updated");
    if (user?.id) {
      updated.forEach((contact) => TravelSyncService.saveEmergencyContact(user.id, contact));
    }
  };

  const bookTransportTicket = async (transport, passengers = 1, travelDate) => {
    const pnr = `YTR-${Math.floor(100000 + Math.random() * 900000)}`;
    const totalAmount = (transport.price || transport.baseFare || 650) * passengers;
    const dateStr = travelDate || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];

    const ticket = {
      id: `tkt-${Date.now()}`,
      pnr,
      transport,
      passengers,
      travelDate: dateStr,
      totalAmount,
      bookedAt: new Date().toLocaleString(),
      status: "Confirmed"
    };

    const bookingPayload = {
      pnr,
      transport,
      type: transport.type || transport.mode || "train",
      title: `${transport.operator || "Transit Network"} (${transport.from || "Origin"} ➔ ${transport.to || "Destination"})`,
      originCity: transport.from || "Origin",
      destinationCity: transport.to || "Destination",
      travelDate: dateStr,
      passengerCount: passengers,
      status: "Confirmed",
      amount: totalAmount,
      pricing: {
        baseFare: Math.round(totalAmount * 0.85),
        taxes: Math.round(totalAmount * 0.15),
        totalAmount
      },
      paymentDetails: {
        method: "UPI (Carrier Direct)",
        transactionId: `UPI/TKT/${Date.now()}`,
        status: "VERIFIED"
      }
    };

    try {
      if (user?.id) {
        await FirestoreService.createBooking(user.id, bookingPayload);
      }
      setBookedTickets((prev) => [ticket, ...prev]);
      showToast(`Booking Confirmed! PNR: ${pnr} 🎟️`);
      return ticket;
    } catch (err) {
      console.warn("Could not save booking to Firestore:", err);
      showToast(err.message || "Failed to create booking in cloud.", "error");
      throw err;
    }
  };


  return (
    <PlannerContext.Provider
      value={{
        savedTrips,
        visitedDestinations,
        emergencyContacts,
        bookmarkedIds,
        bookedTickets,
        activeDestination,
        toast,
        setActiveDestination,
        showToast,
        toggleBookmark,
        toggleVisited,
        isVisited,
        isBookmarked,
        saveTrip,
        updateTrip,
        deleteTrip,
        cancelBooking,
        addEmergencyContact,
        deleteEmergencyContact,
        setPrimaryContact,
        bookTransportTicket
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) throw new Error("usePlanner must be used within a PlannerProvider");
  return context;
};
