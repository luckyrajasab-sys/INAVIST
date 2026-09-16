import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

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

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? "Removed from bookmarks" : "Saved to your bookmarks! 🔖");
      return updated;
    });
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

  const saveTrip = (trip) => {
    const newTrip = {
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      ...trip
    };
    setSavedTrips((prev) => [newTrip, ...prev]);
    showToast("Trip itinerary saved successfully! 🎒");
    api.trips.create(newTrip).catch((err) => {
      console.warn("Could not save trip to backend:", err);
    });
    return newTrip;
  };

  const deleteTrip = (tripId) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== tripId));
    showToast("Trip itinerary removed");
    api.trips.delete(tripId).catch((err) => {
      console.warn("Could not delete trip on backend:", err);
    });
  };

  const addEmergencyContact = (contact) => {
    const newContact = {
      id: `ec-${Date.now()}`,
      isPrimary: false,
      ...contact
    };
    setEmergencyContacts((prev) => [...prev, newContact]);
    showToast("Emergency contact added securely!");
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));
    showToast("Contact deleted");
  };

  const setPrimaryContact = (id) => {
    setEmergencyContacts((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === id
      }))
    );
    showToast("Primary emergency contact updated");
  };

  const bookTransportTicket = (transport, passengers = 1, travelDate) => {
    const pnr = `YTR-${Math.floor(100000 + Math.random() * 900000)}`;
    const ticket = {
      id: `tkt-${Date.now()}`,
      pnr,
      transport,
      passengers,
      travelDate: travelDate || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
      totalAmount: transport.price * passengers,
      bookedAt: new Date().toLocaleString(),
      status: "Confirmed (Simulated Ticket)"
    };
    setBookedTickets((prev) => [ticket, ...prev]);
    showToast(`Booking Confirmed! PNR: ${pnr} 🎟️`);
    return ticket;
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
        deleteTrip,
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
