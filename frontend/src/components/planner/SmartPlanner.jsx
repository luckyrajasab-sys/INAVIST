import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  CalendarCheck,
  MapPin,
  Users,
  Clock,
  IndianRupee,
  Bus,
  Car,
  Plus,
  Trash2,
  Share2,
  Printer,
  BookmarkCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass,
  FolderDown,
  HardDriveDownload,
  Utensils,
  Sun,
  ShieldCheck,
  CheckSquare,
  Square,
  Navigation,
  SlidersHorizontal,
  Flame,
  Camera,
  HeartHandshake,
  Layers,
  ArrowRight,
  TrendingUp,
  PieChart,
  Train,
  Plane,
  Building,
  Ticket,
  CheckCircle2,
  Info,
  Bed,
  Hotel
} from "lucide-react";
import { destinationsData } from "../../data/destinationsData";
import { usePlanner } from "../../context/PlannerContext";
import { useAuth } from "../../context/AuthContext";
import { useOfflineVault } from "../../context/OfflineVaultContext";
import { useTheme } from "../../context/ThemeContext";
import { ModifyTripModal } from "./ModifyTripModal";
import { DestinationService } from "../../services/DestinationService";

const TRAVEL_PERSONAS = [
  { id: "adventure", label: "Adventure & Trekking", icon: Flame, desc: "High-adrenaline trails, viewpoints & outdoor action", color: "#EA580C" },
  { id: "heritage", label: "Heritage & Culture", icon: Compass, desc: "Forts, temples, palaces & guided historical walkthroughs", color: "#7C3AED" },
  { id: "nature", label: "Nature & Serenity", icon: Sun, desc: "Waterfalls, tea plantations, lakes & scenic leisure", color: "#16A34A" },
  { id: "foodie", label: "Foodie & Culinary", icon: Utensils, desc: "Authentic local delicacies, street stalls & famous dhabas", color: "#E11D48" },
  { id: "wellness", label: "Spiritual & Wellness", icon: Sparkles, desc: "Yoga, meditation, sacred ghats & peaceful retreats", color: "#0EA5E9" },
  { id: "family", label: "Family & Kids Friendly", icon: Users, desc: "Comfortable pacing, theme parks & safe family dining", color: "#2563EB" },
  { id: "budget", label: "Backpacker / Budget", icon: IndianRupee, desc: "Hostels, public transit & free secret viewpoints", color: "#10B981" }
];

const BUDGET_TIERS = [
  { id: "budget", label: "Budget Explorer", multiplier: 0.7, desc: "Cozy homestays & local transport" },
  { id: "balanced", label: "Balanced Comfort", multiplier: 1.0, desc: "3-Star boutique hotels & private cabs" },
  { id: "luxury", label: "Luxury Heritage", multiplier: 1.85, desc: "5-Star heritage resorts & chauffeur SUV" }
];

export const SmartPlanner = ({ preselectedDestination, onSelectDestination, onOpenVault, onBookCab }) => {
  const { saveTrip, savedTrips, deleteTrip, showToast } = usePlanner();
  const { openDownloadModalForDestination } = useOfflineVault();
  const { isDark } = useTheme();
  const { isAuthenticated, openAuthModal, user } = useAuth();

  // Form State
  const [startCity, setStartCity] = useState("");
  const [selectedDestId, setSelectedDestId] = useState(
    preselectedDestination ? preselectedDestination.id : "tn-kodaikanal"
  );
  const [travellers, setTravellers] = useState(2);
  const [days, setDays] = useState(4);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0]
  );
  const [selectedPersona, setSelectedPersona] = useState("heritage");
  const [budgetTier, setBudgetTier] = useState("balanced");
  const [travelPace, setTravelPace] = useState("Balanced"); // 'Fast-Paced' | 'Balanced' | 'Relaxed'
  const [preferredTransport, setPreferredTransport] = useState("Private Cab / Self-Drive");

  // Group destinations sorted alphabetically by State, then alphabetically by destination name
  const destinationsGroupedByState = React.useMemo(() => {
    const states = Array.from(new Set(destinationsData.map((d) => d.state || "Other"))).sort((a, b) =>
      a.localeCompare(b)
    );
    return states.map((state) => ({
      state,
      destinations: destinationsData
        .filter((d) => (d.state || "Other") === state)
        .sort((a, b) => a.name.localeCompare(b.name))
    }));
  }, []);

  // Generated Plan State & Navigation Tabs
  const [activePlan, setActivePlan] = useState(null);
  const [plannerTab, setPlannerTab] = useState("generator"); // 'generator' | 'saved'
  const [planSubTab, setPlanSubTab] = useState("itinerary"); // 'itinerary' | 'logistics' | 'budget' | 'packing' | 'food'
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [completedPackingItems, setCompletedPackingItems] = useState({});

  const currentDestination =
    destinationsData.find((d) => d.id === selectedDestId) || destinationsData[0];

  // Algorithmic Advance Generator
  const handleGeneratePlan = (e) => {
    e?.preventDefault();

    if (!isAuthenticated) {
      showToast?.("Please Sign In or Create an Account to generate AI itineraries! ✨");
      openAuthModal("signin");
      return;
    }

    const dest = currentDestination;
    const tierMultiplier = BUDGET_TIERS.find((b) => b.id === budgetTier)?.multiplier || 1.0;

    const stayDaily = Math.round((dest.estimatedCosts?.stay || 1800) * tierMultiplier);
    const foodDaily = Math.round((dest.estimatedCosts?.food || 900) * tierMultiplier);
    const entryDaily = Math.round(dest.estimatedCosts?.entry || 350);
    const transportBase = Math.round((dest.estimatedCosts?.travel || 1200) * tierMultiplier);

    const generatedDays = [];

    for (let i = 1; i <= days; i++) {
      const attraction = dest.nearbyAttractions?.[(i - 1) % (dest.nearbyAttractions?.length || 1)] || `${dest.name} Scenic Overlook`;
      const secretSpot = dest.hiddenPlacesNearby?.[(i - 1) % (dest.hiddenPlacesNearby?.length || 1)] || "Valley Viewpoint & Pine Forest Trail";

      const stayData = {
        hotelName: `${dest.name} Heritage Valley Resort & Spa`,
        pricePerNight: stayDaily,
        roomType: "Deluxe Mountain View Suite (AC, Breakfast & WiFi Included)",
        checkIn: "12:00 PM",
        checkOut: "11:00 AM",
        rating: 4.8,
        alternatives: [
          { name: `${dest.name} Pine Tree Eco Homestay`, type: "Budget Heritage Homestay", price: Math.max(750, Math.round(stayDaily * 0.55)), rating: 4.6, tag: "Budget Tier" },
          { name: `Sterling Valley Mist Resort`, type: "Comfort 4-Star Resort", price: stayDaily, rating: 4.8, tag: "Recommended" },
          { name: `Taj / Grand Heritage Palace Villa`, type: "5-Star Luxury Villa", price: Math.round(stayDaily * 2.1), rating: 4.9, tag: "Luxury Comfort" }
        ]
      };

      const transportData = {
        primaryMode: preferredTransport || "Chauffeur Private Cab",
        departureTime: i === 1 ? "06:30 AM" : "09:00 AM",
        arrivalTime: i === 1 ? "12:45 PM" : (i === days ? "07:30 PM" : "05:30 PM"),
        duration: i === 1 || i === days ? "5h 45m (Intercity transit)" : "Local Sightseeing Transit (1h 15m)",
        distance: i === 1 ? "480 km highway transit" : (i === days ? "480 km safe return drive" : "24 km scenic valley road"),
        estimatedFare: transportBase,
        alternatives: [
          { mode: "Vande Bharat / Superfast Express Train", timing: "06:00 AM → 10:45 AM", duration: "4h 45m", cost: Math.round(transportBase * 0.8), tag: "Fastest Transit" },
          { mode: "Luxury AC Sleeper Multi-Axle Bus", timing: "09:30 PM → 06:00 AM (Overnight)", duration: "8h 30m", cost: Math.round(transportBase * 0.5), tag: "Cheapest Option" },
          { mode: "Chauffeur Prime Sedan Outstation Cab", timing: "Flexible Doorstep Pickup", duration: "5h 15m", cost: Math.round(transportBase * 1.5), tag: "Maximum Comfort" }
        ]
      };

      if (i === 1) {
        generatedDays.push({
          day: 1,
          theme: `Arrival in ${dest.district || dest.name} & Local Acclimatization`,
          driveDistance: "12 km total city transit",
          stayDetails: stayData,
          transportDetails: transportData,
          activities: [
            {
              timeSlot: "Morning (09:00 AM - 12:45 PM)",
              title: `Depart from ${startCity || "Origin"} via ${preferredTransport}`,
              note: "Check documents, FastTag pass, and highway route.",
              location: `${startCity || "Origin"} → ${dest.name}`,
              visitingHours: "Departure: 06:30 AM • Arrival: 12:45 PM",
              bestLightWindow: "Daytime highway drive (Smooth 4-lane expressway)",
              entryFee: "Highway Tolls Included",
              recommendedDuration: "5.5 Hours",
              crowdForecast: "Smooth traffic flow",
              cost: transportBase,
              duration: "Transit",
              icon: "Navigation",
              backupAlternative: {
                name: "Vande Bharat Express Train Corridor",
                timings: "Dep: 06:00 AM • Arr: 10:45 AM",
                cost: `₹${Math.round(transportBase * 0.8)} / seat`,
                distance: "Direct railway connection"
              }
            },
            {
              timeSlot: "Afternoon (01:30 PM - 03:30 PM)",
              title: `Check-in at ${stayData.hotelName}`,
              note: `Welcome drink, fresh mountain check-in, and authentic regional lunch with local flavors.`,
              location: `${dest.district || dest.name} Center`,
              visitingHours: "Check-in: 12:00 PM • Room ready upon arrival",
              bestLightWindow: "Midday acclimatization window",
              entryFee: "Included in Stay Voucher",
              recommendedDuration: "2 Hours",
              crowdForecast: "Private Guest Check-in",
              cost: Math.round(foodDaily / 2),
              duration: "1.5 hours",
              icon: "Home",
              backupAlternative: {
                name: stayData.alternatives[0].name,
                timings: "Check-in: 11:30 AM",
                cost: `₹${stayData.alternatives[0].price} / night`,
                distance: "1.2 km away"
              }
            },
            {
              timeSlot: "Evening (04:30 PM - 06:30 PM)",
              title: `Sunset Stroll through ${dest.district || dest.name} Heritage Bazaar`,
              note: `Sample street snacks, homemade chocolates, spices, and artisanal crafts of ${dest.state}.`,
              location: "Heritage Market Corridor",
              visitingHours: "09:00 AM - 09:30 PM (All Days)",
              bestLightWindow: "04:45 PM - 06:15 PM (Golden Hour Stroll)",
              entryFee: "Free Entry (Shopping as per choice)",
              recommendedDuration: "2 Hours",
              crowdForecast: "Moderate Evening Locals & Tourists",
              cost: 300,
              duration: "2 hours",
              icon: "ShoppingBag",
              backupAlternative: {
                name: `${dest.name} Botanical Lake Promenade`,
                timings: "08:00 AM - 07:00 PM",
                cost: "₹30 / person",
                distance: "800 m walking"
              }
            },
            {
              timeSlot: "Night (07:45 PM - 09:30 PM)",
              title: "Welcome Dinner & Traditional Cultural Gathering",
              note: `Relish signature regional cuisines of ${dest.state} around cozy dining.`,
              location: "Specialty Local Restaurant",
              visitingHours: "07:00 PM - 11:00 PM (Dinner Service)",
              bestLightWindow: "Evening Ambient Lighting",
              entryFee: "Dining Bill as per order",
              recommendedDuration: "1.5 Hours",
              crowdForecast: "Prior Table Reservation Recommended",
              cost: Math.round(foodDaily / 2),
              duration: "1.5 hours",
              icon: "Utensils",
              backupAlternative: {
                name: "Hilltop Rooftop Garden Dining",
                timings: "06:30 PM - 10:30 PM",
                cost: `₹${Math.round(foodDaily * 0.6)} / meal`,
                distance: "600 m away"
              }
            }
          ],
          stayCost: stayDaily,
          weatherHint: "Cool evening breeze (18°C–22°C). Light jacket recommended."
        });
      } else if (i === days) {
        generatedDays.push({
          day: i,
          theme: `Sunrise Golden Hour & Safe Return to ${startCity || "Origin"}`,
          driveDistance: "15 km local + return highway drive",
          stayDetails: {
            ...stayData,
            pricePerNight: 0,
            roomType: "Checkout by 11:00 AM (Luggage Cloakroom Available)",
            checkOut: "11:00 AM"
          },
          transportDetails: {
            ...transportData,
            departureTime: "01:00 PM",
            arrivalTime: "07:30 PM",
            duration: "5h 45m (Safe Return Highway Drive)"
          },
          activities: [
            {
              timeSlot: "Early Morning (05:45 AM - 08:00 AM)",
              title: `Sunrise at ${dest.name} Signature Viewpoint`,
              note: dest.viewpointTimings?.bestTime || "Golden hour photography, cloud valley and morning mist.",
              location: `${dest.name} Panoramic Overlook`,
              visitingHours: "05:30 AM - 06:30 PM (All 7 Days)",
              bestLightWindow: "05:45 AM - 07:15 AM (Signature Sunrise Window)",
              entryFee: `₹${entryDaily} / person (Viewpoint entry)`,
              recommendedDuration: "2 Hours",
              crowdForecast: "Low early morning, increases by 08:30 AM",
              cost: entryDaily,
              duration: "2 hours",
              icon: "Sun",
              backupAlternative: {
                name: `${dest.name} Valley Fog View Trail`,
                timings: "Open 24/7",
                cost: "Free Entry",
                distance: "2.1 km away"
              }
            },
            {
              timeSlot: "Morning (09:00 AM - 11:30 AM)",
              title: "Farewell Breakfast & Souvenir Estate Spices Shopping",
              note: `Pick up fresh plantation tea, local honey, essential oils, and handcrafted souvenirs.`,
              location: "Town Center & Tea Estate Outlets",
              visitingHours: "08:30 AM - 08:00 PM",
              bestLightWindow: "Morning Fresh Stock Hours",
              entryFee: "Free Entry",
              recommendedDuration: "2 Hours",
              crowdForecast: "Moderate",
              cost: Math.round(foodDaily / 2),
              duration: "1.5 hours",
              icon: "Coffee",
              backupAlternative: {
                name: "Organic Honey & Spice Demonstration Hub",
                timings: "09:00 AM - 06:00 PM",
                cost: "Free Entry",
                distance: "500 m away"
              }
            },
            {
              timeSlot: "Afternoon (01:00 PM - 07:30 PM)",
              title: `Checkout & Comfortable Return Drive to ${startCity || "Origin"}`,
              note: `Smooth return drive back to ${startCity || "Origin"} with memorable experiences.`,
              location: `Highway Corridor → ${startCity || "Origin"}`,
              visitingHours: "Flexible Departure Window",
              bestLightWindow: "Daylight Highway Drive",
              entryFee: "FastTag & Fuel Covered",
              recommendedDuration: "Return transit",
              crowdForecast: "Normal Highway Traffic",
              cost: transportBase,
              duration: "Return drive",
              icon: "Navigation",
              backupAlternative: {
                name: "Late Evening Superfast Express Train",
                timings: "Dep: 04:30 PM • Arr: 09:45 PM",
                cost: `₹${Math.round(transportBase * 0.85)} / seat`,
                distance: "Direct return express"
              }
            }
          ],
          stayCost: 0,
          weatherHint: "Bright morning sunshine. Keep sunglasses & water handy."
        });
      } else {
        generatedDays.push({
          day: i,
          theme: `Day ${i}: ${selectedPersona === "adventure" ? "High Altitude Trek & Secret Spot" : `Exploring ${attraction}`}`,
          driveDistance: "24 km scenic valley road",
          stayDetails: stayData,
          transportDetails: {
            ...transportData,
            departureTime: "08:30 AM",
            arrivalTime: "05:30 PM",
            duration: "Full Day Local Sightseeing Transit",
            distance: "24 km local scenic route",
            estimatedFare: Math.round(transportBase * 0.6)
          },
          activities: [
            {
              timeSlot: "Morning (08:30 AM - 12:00 PM)",
              title: `Exploration of ${attraction}`,
              note: "Early entry to avoid queues, enjoy fresh mountain mist, and guided audio tour.",
              location: `${attraction}, ${dest.district || dest.name}`,
              visitingHours: "06:30 AM - 05:30 PM (All Days)",
              bestLightWindow: "07:30 AM - 09:30 AM (Best Visibility & Photography)",
              entryFee: `₹${entryDaily + 50} / person (Monument Pass)`,
              recommendedDuration: "3 Hours",
              crowdForecast: "Moderate (Peak at 11:30 AM)",
              cost: entryDaily + 50,
              duration: "3 hours",
              icon: "MapPin",
              backupAlternative: {
                name: `${attraction} Upper Eco Ridge Path`,
                timings: "06:00 AM - 06:00 PM",
                cost: "Free Entry",
                distance: "1.2 km away"
              }
            },
            {
              timeSlot: "Afternoon (01:00 PM - 02:45 PM)",
              title: "Hillside Organic Garden / Forest Cafe Lunch",
              note: "Taste fresh local organic produce and regional specialty curries with estate views.",
              location: "Scenic Valley Cafe",
              visitingHours: "12:00 PM - 04:00 PM (Lunch Buffet & A La Carte)",
              bestLightWindow: "Midday Valley Overlook",
              entryFee: "A La Carte Dining",
              recommendedDuration: "1.5 Hours",
              crowdForecast: "Moderate",
              cost: Math.round(foodDaily / 2),
              duration: "1.5 hours",
              icon: "Utensils",
              backupAlternative: {
                name: "Traditional Thali Heritage Hall",
                timings: "12:30 PM - 03:30 PM",
                cost: `₹${Math.round(foodDaily * 0.45)} / thali`,
                distance: "800 m away"
              }
            },
            {
              timeSlot: "Evening (03:30 PM - 06:00 PM)",
              title: `Offbeat Excursion to ${secretSpot}`,
              note: "Unexplored INAVIST verified hidden gem with peaceful nature view and serene pine canopy.",
              location: secretSpot,
              visitingHours: "06:00 AM - 06:30 PM (Daylight Hours)",
              bestLightWindow: "04:00 PM - 05:45 PM (Sunset Glow)",
              entryFee: "Free Entry / Eco Forest Token (₹20)",
              recommendedDuration: "2.5 Hours",
              crowdForecast: "Very Low (Quiet & Peaceful)",
              cost: 150,
              duration: "2.5 hours",
              icon: "Sparkles",
              backupAlternative: {
                name: `${dest.name} Whispering Pines Nature Trail`,
                timings: "Open till sunset",
                cost: "Free",
                distance: "1.5 km nearby"
              }
            },
            {
              timeSlot: "Night (07:30 PM - 09:30 PM)",
              title: "Campfire Dinner & Stargazing Session",
              note: "Clear mountain sky stargazing, warm dessert, and acoustic local music.",
              location: "Resort Lawn / Stargazing Gazebo",
              visitingHours: "07:30 PM - 10:30 PM",
              bestLightWindow: "Night Stargazing Window (08:30 PM onwards)",
              entryFee: "Complimentary for Resort Guests",
              recommendedDuration: "2 Hours",
              crowdForecast: "Exclusive to in-house guests",
              cost: Math.round(foodDaily / 2),
              duration: "2 hours",
              icon: "Flame",
              backupAlternative: {
                name: "Candlelight Heritage Dining Room",
                timings: "07:30 PM - 10:30 PM",
                cost: `₹${Math.round(foodDaily * 0.55)} / dinner`,
                distance: "On Premises"
              }
            }
          ],
          stayCost: stayDaily,
          weatherHint: "Pleasant afternoon (24°C), mountain fog rolls in by 05:00 PM."
        });
      }
    }

    const totalCostPerPerson = generatedDays.reduce((acc, day) => {
      const actCost = day.activities.reduce((sum, a) => sum + (a.cost || 0), 0);
      return acc + actCost + day.stayCost;
    }, 0);

    const totalEst = totalCostPerPerson * travellers;

    const plan = {
      title: `${days}-Day ${dest.name} Smart Expedition`,
      startCity,
      destinationId: dest.id,
      destinationName: dest.name,
      state: dest.state,
      travellers,
      days,
      startDate,
      persona: selectedPersona,
      budgetTier,
      travelPace,
      preferredTransport,
      totalEstimatedBudget: totalEst,
      budgetPerPerson: Math.round(totalEst / travellers),
      itinerary: generatedDays,
      createdAt: new Date().toLocaleDateString()
    };

    setActivePlan(plan);
    setPlanSubTab("itinerary");

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast?.(`AI Smart Trip Plan generated for ${dest.name}! 🌟`);
  };

  const handleTogglePacking = (item) => {
    setCompletedPackingItems((prev) => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const [isSavingTrip, setIsSavingTrip] = useState(false);

  const handleSaveToTrips = async () => {
    if (!isAuthenticated) {
      showToast?.("Please Sign In or Create an Account to save trips to your Passport! 🏆");
      openAuthModal("signin");
      return;
    }
    if (!activePlan) return;
    setIsSavingTrip(true);
    try {
      await saveTrip(activePlan);
    } catch (err) {
      console.warn("Save trip error:", err);
    } finally {
      setIsSavingTrip(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out my ${activePlan.days}-Day smart trip plan to ${activePlan.destinationName} on INAVIST! Total budget: ₹${activePlan.totalEstimatedBudget}`
      );
      showToast?.("Trip summary copied to clipboard! 📋");
    }
  };

  const packingList = [
    { category: "Essential Documents", items: ["Aadhaar / Passport / ID Card", "Hotel Booking Pass", "Driver's License (if self-drive)", "Medical Insurance Cards"] },
    { category: "Clothing & Footwear", items: ["Trekking / Walking Shoes with Grip", "Warm Fleece / Windcheater Jacket", "Comfortable Cotton T-Shirts", "Extra Pairs of Socks"] },
    { category: "Electronics & Tech", items: ["Phone Charger & 20000mAh Power Bank", "Camera & Extra Memory Card", "Earphones / Headphones", "Offline INAVIST Maps Downloaded"] },
    { category: "Health & Care", items: ["Motion Sickness Tablets (for Ghat roads)", "Sunscreen SPF 50+ & Lip Balm", "Mosquito Repellent", "Basic First Aid & Bandages"] }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "20px 20px 60px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
      {/* Guest Mode Informational Banner */}
      {!isAuthenticated && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            padding: "14px 20px",
            borderRadius: "var(--radius-xl, 16px)",
            background: "linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(37, 99, 235, 0.1) 100%)",
            border: "1.5px solid rgba(234, 88, 12, 0.35)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(234, 88, 12, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#EA580C" }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong style={{ fontSize: "0.90rem", color: "var(--text-primary)", display: "block" }}>
                Preview Mode (Sign In Required to Generate & Save)
              </strong>
              <span style={{ fontSize: "0.80rem", color: "var(--text-secondary)" }}>
                You can customize trip parameters freely. Sign in or create an account to generate AI multi-day plans and save to your Passport.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal("signin")}
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              border: "none",
              background: "var(--brand-primary, #2563EB)",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(37,99,235,0.3)"
            }}
          >
            Sign In / Sign Up
          </button>
        </div>
      )}

      {/* Top Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "30px 28px",
          background: isDark ? "rgba(15, 23, 42, 0.75)" : "#FFFFFF",
          borderRadius: "var(--radius-2xl, 20px)",
          border: "1.5px solid var(--border-subtle, rgba(0,0,0,0.08))",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(37, 99, 235, 0.12)",
                color: "var(--brand-primary, #2563EB)",
                padding: "4px 12px",
                borderRadius: "var(--radius-full, 9999px)",
                fontSize: "0.78rem",
                fontWeight: 800,
                marginBottom: "10px"
              }}
            >
              <Sparkles size={14} />
              <span>AI-Powered Intelligent Trip Architect</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 900, marginBottom: "6px", color: "var(--text-primary)" }}>
              Advance Smart Trip Planner
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: "720px", margin: 0 }}>
              Build personalized day-by-day itineraries tailored to your travel persona, budget tier, and pacing. Includes automated route logistics, weather packing checklists, and direct cab booking.
            </p>
          </div>

          {/* Tab Switcher: Generator vs Saved Trips */}
          <div style={{ display: "flex", gap: "6px", background: isDark ? "rgba(0,0,0,0.3)" : "#F1F5F9", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
            <button
              type="button"
              onClick={() => setPlannerTab("generator")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: plannerTab === "generator" ? "var(--brand-primary, #2563EB)" : "transparent",
                color: plannerTab === "generator" ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: 800,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              Create Itinerary
            </button>
            <button
              type="button"
              onClick={() => setPlannerTab("saved")}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: plannerTab === "saved" ? "var(--brand-primary, #2563EB)" : "transparent",
                color: plannerTab === "saved" ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: 800,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              Saved Trips ({savedTrips.length})
            </button>
          </div>
        </div>

        {/* Generator Form */}
        {plannerTab === "generator" && (
          <form onSubmit={handleGeneratePlan} style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Step 1: Destination & Logistics Inputs */}
            <div
              style={{
                background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid var(--border-subtle)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px"
              }}
            >
              {/* Origin City */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Starting From (City)
                </label>
                <input
                  type="text"
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  placeholder="Enter starting city..."
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.88rem"
                  }}
                />
              </div>

              {/* Destination Selector */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Destination
                </label>
                <select
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.88rem"
                  }}
                >
                  {destinationsGroupedByState.map(({ state, destinations }) => (
                    <optgroup key={state} label={`📍 ${state} (${destinations.length} Destinations)`}>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} {d.district ? `(${d.district})` : ""} — {d.state}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Trip Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.88rem"
                  }}
                />
              </div>

              {/* Trip Duration */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Duration (Days)
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.88rem"
                  }}
                >
                  {[2, 3, 4, 5, 6, 7, 8, 10].map((d) => (
                    <option key={d} value={d}>{d} Days / {d - 1} Nights</option>
                  ))}
                </select>
              </div>

              {/* Travellers */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Travellers Count
                </label>
                <select
                  value={travellers}
                  onChange={(e) => setTravellers(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.88rem"
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Solo Traveller" : num === 2 ? "2 Travellers (Couple/Duo)" : `${num} Travellers (Group)`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: 7 Travel Persona Choices */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Select Your Travel Persona / Style:
                </span>
                <span style={{ fontSize: "0.74rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700 }}>
                  Tailors daily activities & themes
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px" }}>
                {TRAVEL_PERSONAS.map((persona) => {
                  const Icon = persona.icon;
                  const isSelected = selectedPersona === persona.id;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedPersona(persona.id)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: "1.5px solid",
                        borderColor: isSelected ? persona.color : "var(--border-subtle)",
                        background: isSelected
                          ? (isDark ? `${persona.color}22` : `${persona.color}10`)
                          : (isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF"),
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        transition: "all 0.18s ease",
                        transform: isSelected ? "scale(1.02)" : "none"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: `${persona.color}1A`, color: persona.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={16} />
                        </div>
                        <strong style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{persona.label}</strong>
                      </div>
                      <p style={{ fontSize: "0.70rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.3 }}>
                        {persona.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Budget Tier & Travel Pace */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              {/* Budget Tier */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                  Budget Tier
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {BUDGET_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setBudgetTier(tier.id)}
                      style={{
                        padding: "8px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: budgetTier === tier.id ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                        background: budgetTier === tier.id ? (isDark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.1)") : "transparent",
                        color: budgetTier === tier.id ? "var(--brand-primary, #2563EB)" : "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer"
                      }}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Pace */}
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                  Travel Pace
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                  {["Fast-Paced", "Balanced", "Relaxed"].map((pace) => (
                    <button
                      key={pace}
                      type="button"
                      onClick={() => setTravelPace(pace)}
                      style={{
                        padding: "8px",
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: travelPace === pace ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                        background: travelPace === pace ? (isDark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.1)") : "transparent",
                        color: travelPace === pace ? "var(--brand-primary, #2563EB)" : "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer"
                      }}
                    >
                      {pace}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              style={{
                padding: "14px 24px",
                borderRadius: "14px",
                border: "none",
                background: "var(--brand-primary, #2563EB)",
                color: "#FFFFFF",
                fontWeight: 900,
                fontSize: "1.02rem",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(37,99,235,0.4)"
              }}
            >
              <Sparkles size={20} />
              <span>Generate AI Smart Itinerary</span>
            </button>
          </form>
        )}
      </div>

      {/* Generated Itinerary Display */}
      {plannerTab === "generator" && activePlan && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Action Toolbar & Navigation Tabs */}
          <div
            className="glass-card"
            style={{
              padding: "16px 20px",
              borderRadius: "18px",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            {/* View Sub-Tabs */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { id: "itinerary", label: "Day-by-Day Plan", icon: CalendarCheck },
                { id: "budget", label: "Budget Breakdown", icon: PieChart },
                { id: "packing", label: "Weather & Packing", icon: CheckSquare },
                { id: "food", label: "Foodie Guide", icon: Utensils }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = planSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPlanSubTab(tab.id)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: isActive ? "var(--brand-primary, #2563EB)" : "transparent",
                      background: isActive ? "var(--brand-primary, #2563EB)" : "transparent",
                      color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                      fontWeight: isActive ? 800 : 600,
                      fontSize: "0.80rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer"
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Side Quick Action Buttons */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {/* Direct Cab Booking CTA */}
              <button
                type="button"
                onClick={() => onBookCab && onBookCab(activePlan.startCity, activePlan.destinationName)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #16A34A",
                  background: "rgba(22, 163, 74, 0.12)",
                  color: "#16A34A",
                  fontWeight: 800,
                  fontSize: "0.80rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <Car size={14} />
                <span>Book Cab for This Trip</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToTrips}
                disabled={isSavingTrip}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "0.80rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: isSavingTrip ? "not-allowed" : "pointer",
                  opacity: isSavingTrip ? 0.7 : 1
                }}
              >
                <BookmarkCheck size={14} />
                <span>{isSavingTrip ? "Saving to Cloud..." : "Save Trip"}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "0.80rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer"
                }}
              >
                <Printer size={14} /> Print
              </button>

              <button
                type="button"
                onClick={handleShare}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "0.80rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer"
                }}
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>

          {/* SUBTAB 1: Day-by-Day Itinerary */}
          {planSubTab === "itinerary" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {activePlan.itinerary.map((dayItem) => (
                <div
                  key={dayItem.day}
                  className="glass-card"
                  style={{
                    borderRadius: "18px",
                    padding: "24px",
                    border: "1.5px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                  }}
                >
                  {/* Day Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px" }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.76rem", fontWeight: 900, textTransform: "uppercase" }}>
                        <span>DAY {dayItem.day} OF {activePlan.days}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: "2px 0 0" }}>
                        {dayItem.theme}
                      </h3>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        Transit Route: {dayItem.driveDistance}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>
                        Estimated Day Budget
                      </span>
                      <strong style={{ fontSize: "1.15rem", color: "#16A34A", fontWeight: 900 }}>
                        ₹{(dayItem.activities.reduce((s, a) => s + (a.cost || 0), 0) + dayItem.stayCost).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  {/* Weather Advisory */}
                  {dayItem.weatherHint && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", color: "var(--text-secondary)", background: isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9", padding: "6px 12px", borderRadius: "8px" }}>
                      <Sun size={13} style={{ color: "#EA580C" }} />
                      <span>{dayItem.weatherHint}</span>
                    </div>
                  )}

                  {/* 1. Day Activities & Places to Visit List */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        📍 Visiting Places, Timings & Entry Fees ({dayItem.activities.length} Slots)
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
                      {dayItem.activities.map((act, actIdx) => (
                        <div
                          key={actIdx}
                          style={{
                            padding: "16px",
                            borderRadius: "14px",
                            background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                            border: "1px solid var(--border-subtle)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: "10px",
                            boxShadow: "var(--shadow-sm)"
                          }}
                        >
                          <div>
                            {/* Slot header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                              <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase" }}>
                                {act.timeSlot || "Flexible"}
                              </span>
                              <span style={{ fontSize: "0.82rem", fontWeight: 900, color: "#16A34A" }}>
                                ₹{act.cost?.toLocaleString("en-IN") || 0}
                              </span>
                            </div>

                            <strong style={{ fontSize: "0.98rem", color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                              {act.title}
                            </strong>

                            <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: 1.4 }}>
                              {act.note}
                            </p>

                            {/* Visiting Timings & Entry Ticket Grid */}
                            <div style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F1F5F9", padding: "10px 12px", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.74rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-primary)" }}>
                                <Clock size={13} style={{ color: "var(--brand-primary, #2563EB)" }} />
                                <span><strong>Visiting Hours:</strong> {act.visitingHours || "06:30 AM - 05:30 PM"}</span>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                                <Ticket size={13} style={{ color: "#16A34A" }} />
                                <span><strong>Entry / Fee:</strong> {act.entryFee || "Free Entry"}</span>
                              </div>

                              {act.bestLightWindow && (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                                  <Sun size={13} style={{ color: "#EA580C" }} />
                                  <span><strong>Best Window:</strong> {act.bestLightWindow}</span>
                                </div>
                              )}

                              {act.crowdForecast && (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                                  <Users size={13} style={{ color: "#7C3AED" }} />
                                  <span><strong>Crowd:</strong> {act.crowdForecast}</span>
                                </div>
                              )}
                            </div>

                            {/* Alternative Place / Backup Option */}
                            {act.backupAlternative && (
                              <div style={{ marginTop: "8px", padding: "8px 10px", borderRadius: "8px", background: isDark ? "rgba(124, 58, 237, 0.08)" : "rgba(124, 58, 237, 0.05)", border: "1px dashed rgba(124, 58, 237, 0.25)", fontSize: "0.72rem" }}>
                                <div style={{ fontWeight: 800, color: "#7C3AED", marginBottom: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <Sparkles size={11} />
                                  <span>Alternative Nearby Spot (If Crowded):</span>
                                </div>
                                <span style={{ color: "var(--text-primary)" }}>
                                  <strong>{act.backupAlternative.name}</strong> • {act.backupAlternative.timings} ({act.backupAlternative.cost})
                                </span>
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "8px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            <span>📍 {act.location || "Local Spot"}</span>
                            <span>⏱ {act.recommendedDuration || act.duration || "1.5 - 2 hrs"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Daily Transport Operations & Alternatives Panel */}
                  {dayItem.transportDetails && (
                    <div
                      style={{
                        padding: "16px 20px",
                        borderRadius: "14px",
                        background: isDark ? "rgba(15, 23, 42, 0.7)" : "#F0FDF4",
                        border: "1.5px solid rgba(22, 163, 74, 0.25)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(22, 163, 74, 0.15)", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Navigation size={16} />
                          </div>
                          <div>
                            <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)", display: "block" }}>
                              Transport Operations: {dayItem.transportDetails.primaryMode}
                            </strong>
                            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                              {dayItem.transportDetails.distance} • Timing: {dayItem.transportDetails.departureTime} $\rightarrow$ {dayItem.transportDetails.arrivalTime} ({dayItem.transportDetails.duration})
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "0.70rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Transit Fare</span>
                          <strong style={{ fontSize: "0.95rem", color: "#16A34A" }}>
                            ₹{dayItem.transportDetails.estimatedFare?.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </div>

                      {/* Alternative Transports Comparison Strip */}
                      <div>
                        <span style={{ fontSize: "0.70rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                          Alternative Transport Options for this Route:
                        </span>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
                          {dayItem.transportDetails.alternatives?.map((alt, altIdx) => (
                            <div
                              key={altIdx}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "10px",
                                background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF",
                                border: "1px solid var(--border-subtle)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "0.74rem"
                              }}
                            >
                              <div>
                                <strong style={{ color: "var(--text-primary)", display: "block" }}>{alt.mode}</strong>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>{alt.timing} ({alt.duration})</span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontWeight: 800, color: "var(--brand-primary, #2563EB)", display: "block" }}>₹{alt.cost?.toLocaleString("en-IN")}</span>
                                <span style={{ fontSize: "0.64rem", color: "#16A34A", fontWeight: 700 }}>{alt.tag}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Daily Stay & Boutique Accommodation Operations */}
                  {dayItem.stayDetails && dayItem.stayCost > 0 && (
                    <div
                      style={{
                        padding: "16px 20px",
                        borderRadius: "14px",
                        background: isDark ? "rgba(15, 23, 42, 0.7)" : "#EFF6FF",
                        border: "1.5px solid rgba(37, 99, 235, 0.25)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(37, 99, 235, 0.15)", color: "var(--brand-primary, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Hotel size={16} />
                          </div>
                          <div>
                            <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)", display: "block" }}>
                              Stay Operation: {dayItem.stayDetails.hotelName} ({dayItem.stayDetails.rating}★)
                            </strong>
                            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                              {dayItem.stayDetails.roomType} • Check-in: {dayItem.stayDetails.checkIn} | Check-out: {dayItem.stayDetails.checkOut}
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "0.70rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Per Night Rate</span>
                          <strong style={{ fontSize: "0.95rem", color: "var(--brand-primary, #2563EB)" }}>
                            ₹{dayItem.stayDetails.pricePerNight?.toLocaleString("en-IN")} / room
                          </strong>
                        </div>
                      </div>

                      {/* Alternative Stay Tiers Comparison */}
                      <div>
                        <span style={{ fontSize: "0.70rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                          Alternative Stay Options for this Night:
                        </span>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
                          {dayItem.stayDetails.alternatives?.map((altStay, sIdx) => (
                            <div
                              key={sIdx}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "10px",
                                background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF",
                                border: "1px solid var(--border-subtle)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "0.74rem"
                              }}
                            >
                              <div>
                                <strong style={{ color: "var(--text-primary)", display: "block" }}>{altStay.name}</strong>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>{altStay.type} • {altStay.rating}★</span>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontWeight: 800, color: "#16A34A", display: "block" }}>₹{altStay.price?.toLocaleString("en-IN")} / night</span>
                                <span style={{ fontSize: "0.64rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700 }}>{altStay.tag}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SUBTAB 2: Budget Breakdown Chart */}
          {planSubTab === "budget" && (
            <div className="glass-card" style={{ padding: "26px", borderRadius: "18px", border: "1.5px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.30rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Estimated Expense Allocation for {activePlan.travellers} Person{activePlan.travellers > 1 ? "s" : ""}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Calculated based on {activePlan.budgetTier.toUpperCase()} tier and {activePlan.days} days duration.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                {[
                  { label: "Accommodation / Stay", percent: "40%", amount: Math.round(activePlan.totalEstimatedBudget * 0.40), color: "#2563EB" },
                  { label: "Food & Authentic Dining", percent: "25%", amount: Math.round(activePlan.totalEstimatedBudget * 0.25), color: "#16A34A" },
                  { label: "Local Cabs & Transit", percent: "20%", amount: Math.round(activePlan.totalEstimatedBudget * 0.20), color: "#EA580C" },
                  { label: "Entry Tickets & Guide Fees", percent: "10%", amount: Math.round(activePlan.totalEstimatedBudget * 0.10), color: "#7C3AED" },
                  { label: "Souvenirs & Buffer Emergency", percent: "5%", amount: Math.round(activePlan.totalEstimatedBudget * 0.05), color: "#E11D48" }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: "16px", borderRadius: "14px", background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: item.color }}>{item.percent}</span>
                      <strong style={{ fontSize: "1.10rem", fontWeight: 900, color: "var(--text-primary)" }}>₹{item.amount.toLocaleString("en-IN")}</strong>
                    </div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)" }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px", borderRadius: "14px", background: isDark ? "rgba(22,163,74,0.12)" : "#ECFDF5", border: "1.5px solid #16A34A" }}>
                <div>
                  <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#16A34A", textTransform: "uppercase" }}>Total Estimated Budget</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#16A34A" }}>
                    ₹{activePlan.totalEstimatedBudget.toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Per Person Cost</div>
                  <strong style={{ fontSize: "1.20rem", color: "var(--text-primary)" }}>₹{activePlan.budgetPerPerson.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: Weather & Packing Checklist */}
          {planSubTab === "packing" && (
            <div className="glass-card" style={{ padding: "26px", borderRadius: "18px", border: "1.5px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.30rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Smart Packing Checklist for {activePlan.destinationName}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Check off items as you pack for your {activePlan.days}-day journey.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                {packingList.map((cat, idx) => (
                  <div key={idx} style={{ padding: "16px", borderRadius: "14px", background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC", border: "1px solid var(--border-subtle)" }}>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", marginBottom: "10px" }}>
                      {cat.category}
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {cat.items.map((item, itemIdx) => {
                        const isDone = completedPackingItems[item];
                        return (
                          <div
                            key={itemIdx}
                            onClick={() => handleTogglePacking(item)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              cursor: "pointer",
                              fontSize: "0.80rem",
                              color: isDone ? "var(--text-muted)" : "var(--text-primary)",
                              textDecoration: isDone ? "line-through" : "none"
                            }}
                          >
                            {isDone ? <CheckSquare size={16} color="#16A34A" /> : <Square size={16} color="var(--text-muted)" />}
                            <span>{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB 4: Regional Foodie Guide */}
          {planSubTab === "food" && (
            <div className="glass-card" style={{ padding: "26px", borderRadius: "18px", border: "1.5px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.30rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Curated Foodie & Culinary Guide in {activePlan.destinationName}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                  Must-try authentic state and district specialties.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
                {[
                  { meal: "Breakfast Delicacies", items: "Fresh Filter Coffee, Hot Steamed Idlis with Coconut & Tomato Chutneys, Medu Vada", time: "07:30 AM – 09:30 AM", place: "Traditional Udupi / Town Cafes" },
                  { meal: "Lunch Highlights", items: "Authentic Chettinad Spiced Curry / Banana Leaf Thali with Rasam & Payasam", time: "01:00 PM – 03:00 PM", place: "Heritage Hilltop Eateries" },
                  { meal: "Evening Street Food", items: "Roasted Spiced Corn on the Cob, Masala Chai, Homemade Dark Chocolates", time: "05:00 PM – 07:00 PM", place: "Lakeview Promenade & Market" },
                  { meal: "Specialty Dinner", items: "Claypot Biryani, Fresh Forest Honey Toast, Warm Malabar Parotta", time: "07:30 PM – 09:30 PM", place: "Garden Lawn Restaurant" }
                ].map((f, idx) => (
                  <div key={idx} style={{ padding: "16px", borderRadius: "14px", background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "0.92rem", color: "#EA580C" }}>{f.meal}</strong>
                      <span style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>{f.time}</span>
                    </div>
                    <p style={{ fontSize: "0.80rem", color: "var(--text-primary)", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
                      {f.items}
                    </p>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      📍 Recommended: <em>{f.place}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Saved Trips Tab */}
      {plannerTab === "saved" && (
        <div>
          {savedTrips.length === 0 ? (
            <div className="glass-card" style={{ padding: "40px 20px", textAlign: "center", borderRadius: "18px", border: "1px solid var(--border-subtle)" }}>
              <CalendarCheck size={40} style={{ color: "var(--text-muted)", marginBottom: "10px" }} />
              <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>No Saved Trips Yet</h4>
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                Create and save an itinerary above to access it anytime offline in your travel passport!
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="glass-card"
                  style={{
                    padding: "20px",
                    borderRadius: "16px",
                    border: "1.5px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "14px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                        {trip.title}
                      </h4>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", padding: "4px" }}
                        title="Delete Trip"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {trip.days} Days • {trip.travellers} Travellers • Created {trip.createdAt}
                    </div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#16A34A", marginTop: "10px" }}>
                      ₹{trip.totalEstimatedBudget?.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePlan(trip);
                        setPlannerTab("generator");
                      }}
                      style={{
                        flex: 1,
                        padding: "9px",
                        borderRadius: "8px",
                        border: "none",
                        background: "var(--brand-primary, #2563EB)",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.80rem",
                        cursor: "pointer"
                      }}
                    >
                      View Itinerary
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePlan(trip);
                        setIsModifyModalOpen(true);
                      }}
                      style={{
                        padding: "9px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "0.80rem",
                        cursor: "pointer"
                      }}
                    >
                      Adapt / Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookCab && onBookCab(trip.startCity, trip.destinationName)}
                      style={{
                        padding: "9px 12px",
                        borderRadius: "8px",
                        border: "1px solid #16A34A",
                        background: "rgba(22, 163, 74, 0.12)",
                        color: "#16A34A",
                        fontWeight: 800,
                        fontSize: "0.80rem",
                        cursor: "pointer"
                      }}
                    >
                      Book Cab
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
