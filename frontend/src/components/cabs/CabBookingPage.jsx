import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  Luggage,
  ShieldCheck,
  Zap,
  Sparkles,
  Phone,
  Share2,
  Navigation,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  ChevronRight,
  Info,
  Radio,
  Sliders,
  Award,
  Fuel,
  Receipt,
  Plane,
  RotateCcw,
  ArrowRight,
  Star
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePlanner } from "../../context/PlannerContext";
import { useAuth } from "../../context/AuthContext";
import { RouteService } from "../../services/RouteService.js";
import { getCitySuggestions, verifyIndianCity } from "../../data/indianCitiesDirectory.js";
import { CAB_DISTRICT_HUBS, getDistrictById, searchDistricts } from "../../data/cabDistrictPlaces.js";

const CAB_FLEET_CATEGORIES = [
  {
    id: "mini",
    name: "Economy Mini",
    models: "Maruti WagonR, Tata Tiago, Maruti Celerio",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
    capacity: "3 Passengers",
    luggage: "1 Large + 1 Handbag",
    perKmRate: 11.5,
    baseFare: 350,
    eta: "4–6 mins away",
    tag: "Lowest Cost",
    tagColor: "#2563EB",
    features: ["AC Airflow", "Compact & Nimble", "Verified Driver", "Zero Cancellation Fee"]
  },
  {
    id: "sedan",
    name: "Prime Sedan",
    models: "Maruti Dzire, Toyota Etios, Hyundai Aura",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=600&q=80",
    capacity: "4 Passengers",
    luggage: "2 Large Suitcases + 2 Handbags",
    perKmRate: 14.0,
    baseFare: 450,
    eta: "5–8 mins away",
    tag: "Most Popular",
    tagColor: "#16A34A",
    features: ["Spacious Boot Space", "High Fuel Economy", "Top-Rated Chauffeur", "USB Charging Ports"]
  },
  {
    id: "suv",
    name: "Luxury SUV / MPV",
    models: "Toyota Innova Crysta, Maruti Ertiga ZXi",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    capacity: "6–7 Passengers",
    luggage: "4 Large Suitcases + Carrier",
    perKmRate: 19.0,
    baseFare: 750,
    eta: "8–12 mins away",
    tag: "Family & Hill Stations",
    tagColor: "#7C3AED",
    features: ["Reclining Captain Seats", "Rear AC Vents", "Roof Carrier for Ghats", "High Ground Clearance"]
  },
  {
    id: "executive",
    name: "Executive Luxury",
    models: "Toyota Camry, Fortuner, Mercedes-Benz E-Class",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
    capacity: "4 Passengers",
    luggage: "3 Premium Suitcases",
    perKmRate: 28.0,
    baseFare: 1400,
    eta: "15–20 mins scheduled",
    tag: "VIP Luxury",
    tagColor: "#EA580C",
    features: ["Chauffeur in Uniform", "Leather Interiors", "Complimentary Water & Mints", "Priority VIP Toll Lane"]
  }
];

const LOCAL_RENTAL_PACKAGES = [
  { id: "4h40k", label: "4 Hours / 40 km", desc: "Short city errands & business meetings", multiplier: 1.0 },
  { id: "8h80k", label: "8 Hours / 80 km", desc: "Full-day city sightseeing & shopping (Recommended)", multiplier: 1.85 },
  { id: "12h120k", label: "12 Hours / 120 km", desc: "Extended day tour & evening dining", multiplier: 2.6 }
];

export const CabBookingPage = ({ initialFromCity = "Chennai", initialToCity = "Kodaikanal", onNavigateTransport }) => {
  const { isDark } = useTheme();
  const { showToast, emergencyContacts } = usePlanner();
  const { isAuthenticated, openAuthModal, user } = useAuth();

  // Booking Type: 'outstation' | 'rental' | 'city' (Airport Transfer removed)
  const [tripType, setTripType] = useState("city"); // Default to Daily City Cab for instant local rides
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // Daily City Cab: Selected District & Landmark Places State
  const [selectedDistrictId, setSelectedDistrictId] = useState("chennai");
  const currentDistrict = getDistrictById(selectedDistrictId);

  const [cityPickupPlace, setCityPickupPlace] = useState("");
  const [cityDropPlace, setCityDropPlace] = useState("");
  const [showCityPickupSug, setShowCityPickupSug] = useState(false);
  const [showCityDropSug, setShowCityDropSug] = useState(false);

  // Outstation & Rental Locations & Search
  const [pickupCity, setPickupCity] = useState(initialFromCity || "");
  const [dropCity, setDropCity] = useState(initialToCity || "");
  const [pickupDate, setPickupDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]
  );
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0]
  );
  const [pickupTime, setPickupTime] = useState("06:30 AM");
  const [passengerCount, setPassengerCount] = useState(2);
  const [selectedRentalPkg, setSelectedRentalPkg] = useState("8h80k");

  // Autocomplete states for Outstation
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupSug, setShowPickupSug] = useState(false);
  const [showDropSug, setShowDropSug] = useState(false);

  // Selected Cab & Confirmation States
  const [selectedCabId, setSelectedCabId] = useState("sedan");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("John Doe");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Handle District Change for Daily City Cab
  const handleDistrictChange = (newDistrictId) => {
    setSelectedDistrictId(newDistrictId);
    setCityPickupPlace("");
    setCityDropPlace("");
  };

  // Distance computation
  const estimatedDistance = React.useMemo(() => {
    if (tripType === "rental") return 80;
    if (tripType === "city") {
      // Calculate realistic intra-district distance based on string length hash for deterministic variety
      const hash = Math.abs((cityPickupPlace.length * 7 + cityDropPlace.length * 13) % 22) + 6;
      return hash;
    }
    const d = RouteService.getEstimatedDistanceKm(pickupCity, dropCity);
    return isRoundTrip ? d * 2 : d;
  }, [pickupCity, dropCity, tripType, isRoundTrip, cityPickupPlace, cityDropPlace]);

  const handlePickupChange = (val) => {
    setPickupCity(val);
    if (val.trim().length >= 1) {
      setPickupSuggestions(getCitySuggestions(val));
      setShowPickupSug(true);
    } else {
      setPickupSuggestions([]);
      setShowPickupSug(false);
    }
  };

  const handleDropChange = (val) => {
    setDropCity(val);
    if (val.trim().length >= 1) {
      setDropSuggestions(getCitySuggestions(val));
      setShowDropSug(true);
    } else {
      setDropSuggestions([]);
      setShowDropSug(false);
    }
  };

  const calculateFare = (cab) => {
    let fare = 0;
    if (tripType === "rental") {
      const pkg = LOCAL_RENTAL_PACKAGES.find((p) => p.id === selectedRentalPkg) || LOCAL_RENTAL_PACKAGES[1];
      fare = Math.round(cab.baseFare * 3.5 * pkg.multiplier);
    } else if (tripType === "city") {
      fare = Math.round(cab.baseFare + estimatedDistance * cab.perKmRate);
    } else {
      // Outstation
      const kmFare = estimatedDistance * cab.perKmRate;
      const tollEst = Math.round(estimatedDistance * 1.35);
      const driverNightAllowance = isRoundTrip ? 600 : 300;
      fare = Math.round(cab.baseFare + kmFare + tollEst + driverNightAllowance);
    }
    return fare;
  };

  const handleConfirmRide = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast?.("Please Sign In or Create an Account to book a cab! 🚖");
      openAuthModal("signin");
      return;
    }

    if (tripType === "city" && cityPickupPlace === cityDropPlace) {
      showToast?.("Pickup and drop location cannot be the same place!");
      return;
    }

    const cab = CAB_FLEET_CATEGORIES.find((c) => c.id === selectedCabId) || CAB_FLEET_CATEGORIES[1];
    const totalFare = calculateFare(cab);

    const pickupLocationText = tripType === "city" ? `${cityPickupPlace}, ${currentDistrict.districtName}` : pickupCity;
    const dropLocationText = tripType === "city" ? `${cityDropPlace}, ${currentDistrict.districtName}` : (tripType === "rental" ? `Local Rental Package (${selectedRentalPkg})` : dropCity);

    const booking = {
      bookingId: `CAB-${Math.floor(100000 + Math.random() * 900000)}`,
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
      cabCategory: cab.name,
      vehicleModel: cab.models.split(",")[0],
      vehicleNumber: `TN 07 AB ${Math.floor(1000 + Math.random() * 9000)}`,
      driverName: "Rajesh K. Verma",
      driverPhone: "+91 98401 22910",
      driverRating: 4.92,
      driverTrips: 2840,
      pickupLocation: pickupLocationText,
      dropLocation: dropLocationText,
      pickupDate,
      pickupTime,
      totalFare,
      tripType: tripType === "city" ? `DAILY CITY CAB (${currentDistrict.districtName.toUpperCase()})` : tripType.toUpperCase(),
      distanceKm: estimatedDistance,
      passengers: passengerCount,
      customerName: user?.name || customerName,
      customerPhone: user?.phone || customerPhone,
      specialInstructions,
      createdAt: new Date().toLocaleString()
    };

    setConfirmedBooking(booking);

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast?.(`Cab confirmed! Driver arriving in ${cab.eta} 🚖`);
  };

  const selectedCab = CAB_FLEET_CATEGORIES.find((c) => c.id === selectedCabId) || CAB_FLEET_CATEGORIES[1];
  const activeFare = calculateFare(selectedCab);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px 60px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
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
                Preview Mode (Sign In Required to Book)
              </strong>
              <span style={{ fontSize: "0.80rem", color: "var(--text-secondary)" }}>
                You can browse cab categories, routes & fare estimates freely. Sign in or create an account to dispatch verified drivers.
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
      {/* Top Hero Banner */}
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
              <ShieldCheck size={14} />
              <span>Official INAVIST Verified Chauffeur & Outstation Cab Platform</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 900, marginBottom: "6px", color: "var(--text-primary)" }}>
              Cab & Taxi Booking
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: "700px", margin: 0 }}>
              Doorstep-to-destination chauffeur taxi service across India. Guaranteed on-time pickup, transparent per-km billing, and 24/7 highway roadside assistance.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "var(--radius-xl, 14px)",
              background: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
              border: "1px solid var(--border-subtle)"
            }}
          >
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#16A34A", boxShadow: "0 0 8px #16A34A" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
              1,420+ Verified Cabs Active
            </span>
          </div>
        </div>

        {/* Trip Mode Switcher Tabs */}
        <div style={{ display: "flex", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
          {[
            { id: "outstation", label: "Outstation Trip", icon: Navigation, desc: "Inter-city long drive" },
            { id: "rental", label: "Hourly Rental", icon: Clock, desc: "Local city tour (4h/8h/12h)" },
            { id: "city", label: "Daily City Cab", icon: Zap, desc: "Intra-District Only" }
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = tripType === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setTripType(mode.id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "var(--radius-xl, 14px)",
                  border: "1.5px solid",
                  borderColor: isActive ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                  background: isActive ? "var(--brand-primary, #2563EB)" : (isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC"),
                  color: isActive ? "#FFFFFF" : "var(--text-primary)",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.86rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 4px 14px rgba(37,99,235,0.3)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <Icon size={16} />
                <span>{mode.label}</span>
                {mode.id === "city" && (
                  <span
                    style={{
                      fontSize: "0.66rem",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      background: isActive ? "rgba(255,255,255,0.2)" : "rgba(22,163,74,0.14)",
                      color: isActive ? "#FFFFFF" : "#16A34A"
                    }}
                  >
                    In-District Only
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Booking Query Console */}
        <div
          style={{
            marginTop: "20px",
            background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
            padding: "20px",
            borderRadius: "var(--radius-xl, 16px)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {/* DAILY CITY CAB: DISTRICT SELECTOR */}
          {tripType === "city" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "14px 16px",
                borderRadius: "var(--radius-lg, 12px)",
                background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.06)",
                border: "1.5px solid rgba(37,99,235,0.25)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={18} color="#2563EB" />
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase" }}>
                    Select Operating District (Intra-District Only)
                  </span>
                </div>

                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>
                  {currentDistrict.popularPlaces.length} Real Landmarks Available
                </span>
              </div>

              <select
                value={selectedDistrictId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  background: isDark ? "#0F172A" : "#FFFFFF",
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  cursor: "pointer",
                  marginTop: "4px"
                }}
              >
                {CAB_DISTRICT_HUBS.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.districtName} — {dist.state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* INPUTS ROW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              alignItems: "flex-end"
            }}
          >
            {/* DAILY CITY CAB: Real Places Pickup Input */}
            {tripType === "city" ? (
              <div style={{ position: "relative" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Pickup Place in {currentDistrict.districtName.split(" ")[0]}
                </label>
                <input
                  type="text"
                  value={cityPickupPlace}
                  onChange={(e) => setCityPickupPlace(e.target.value)}
                  onFocus={() => setShowCityPickupSug(true)}
                  placeholder="Search pickup landmark (e.g. Central Station, Marina Beach)..."
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
                {showCityPickupSug && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: isDark ? "#0F172A" : "#FFFFFF",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      zIndex: 40,
                      marginTop: "4px",
                      maxHeight: "220px",
                      overflowY: "auto"
                    }}
                  >
                    {currentDistrict.popularPlaces
                      .filter((p) => p.name.toLowerCase().includes(cityPickupPlace.toLowerCase()) || cityPickupPlace.trim() === "")
                      .map((place, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCityPickupPlace(place.name);
                            setShowCityPickupSug(false);
                          }}
                          style={{
                            padding: "9px 12px",
                            cursor: "pointer",
                            fontSize: "0.82rem",
                            borderBottom: "1px solid var(--border-subtle)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <strong>{place.name}</strong>
                          <span style={{ fontSize: "0.68rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700, background: "rgba(37,99,235,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                            {place.type}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              /* OUTSTATION / RENTAL: Pickup City Input */
              <div style={{ position: "relative" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Pickup City
                </label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => handlePickupChange(e.target.value)}
                  onFocus={() => pickupCity.trim().length >= 1 && setShowPickupSug(true)}
                  placeholder="Search pickup city or station..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.90rem"
                  }}
                />
                {showPickupSug && pickupSuggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: isDark ? "#0F172A" : "#FFFFFF",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      zIndex: 30,
                      marginTop: "4px",
                      maxHeight: "180px",
                      overflowY: "auto"
                    }}
                  >
                    {pickupSuggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setPickupCity(sug.name);
                          setShowPickupSug(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "0.84rem",
                          borderBottom: "1px solid var(--border-subtle)"
                        }}
                      >
                        <strong>{sug.name}</strong>, {sug.state}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* DAILY CITY CAB: Real Places Drop Input */}
            {tripType === "city" ? (
              <div style={{ position: "relative" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Drop Place in {currentDistrict.districtName.split(" ")[0]}
                </label>
                <input
                  type="text"
                  value={cityDropPlace}
                  onChange={(e) => setCityDropPlace(e.target.value)}
                  onFocus={() => setShowCityDropSug(true)}
                  placeholder="Search drop landmark (e.g. T. Nagar, OMR, Adyar)..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: cityPickupPlace && cityDropPlace && cityPickupPlace === cityDropPlace ? "1.5px solid #DC2626" : "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.88rem"
                  }}
                />
                {showCityDropSug && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: isDark ? "#0F172A" : "#FFFFFF",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      zIndex: 40,
                      marginTop: "4px",
                      maxHeight: "220px",
                      overflowY: "auto"
                    }}
                  >
                    {currentDistrict.popularPlaces
                      .filter((p) => p.name.toLowerCase().includes(cityDropPlace.toLowerCase()) || cityDropPlace.trim() === "")
                      .map((place, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setCityDropPlace(place.name);
                            setShowCityDropSug(false);
                          }}
                          style={{
                            padding: "9px 12px",
                            cursor: "pointer",
                            fontSize: "0.82rem",
                            borderBottom: "1px solid var(--border-subtle)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <strong>{place.name}</strong>
                          <span style={{ fontSize: "0.68rem", color: "#16A34A", fontWeight: 700, background: "rgba(22,163,74,0.1)", padding: "2px 6px", borderRadius: "4px" }}>
                            {place.type}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : tripType !== "rental" ? (
              /* OUTSTATION: Drop City Input */
              <div style={{ position: "relative" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Destination / Drop City
                </label>
                <input
                  type="text"
                  value={dropCity}
                  onChange={(e) => handleDropChange(e.target.value)}
                  onFocus={() => dropCity.trim().length >= 1 && setShowDropSug(true)}
                  placeholder="Search destination city or station..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: "0.90rem"
                  }}
                />
                {showDropSug && dropSuggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: isDark ? "#0F172A" : "#FFFFFF",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-lg)",
                      zIndex: 30,
                      marginTop: "4px",
                      maxHeight: "180px",
                      overflowY: "auto"
                    }}
                  >
                    {dropSuggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setDropCity(sug.name);
                          setShowDropSug(false);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "0.84rem",
                          borderBottom: "1px solid var(--border-subtle)"
                        }}
                      >
                        <strong>{sug.name}</strong>, {sug.state}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* RENTAL: Package Selector */}
            {tripType === "rental" && (
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Rental Package
                </label>
                <select
                  value={selectedRentalPkg}
                  onChange={(e) => setSelectedRentalPkg(e.target.value)}
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
                >
                  {LOCAL_RENTAL_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>{pkg.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ADVANCE PRE-BOOKING DATE & TIME FOR OUTSTATION & HOURLY RENTAL */}
            {tripType !== "city" ? (
              <>
                {/* Pre-Booking Date */}
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={13} />
                    <span>Pre-Booking Date</span>
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
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

                {/* Pre-Booking Time */}
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={13} />
                    <span>Pre-Booking Pickup Time</span>
                  </label>
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    placeholder="e.g. 06:30 AM"
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
              </>
            ) : (
              /* DAILY CITY CAB: INSTANT RIDE INDICATOR */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  background: isDark ? "rgba(22, 163, 74, 0.12)" : "rgba(22, 163, 74, 0.08)",
                  border: "1px solid rgba(22, 163, 74, 0.25)"
                }}
              >
                <div style={{ fontSize: "0.70rem", fontWeight: 800, color: "#16A34A", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Zap size={13} /> Instant Dispatch
                </div>
                <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>
                  Arrives in 3–5 mins
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  No pre-booking needed for daily cab
                </div>
              </div>
            )}

            {/* Outstation Round-Trip Toggle */}
            {tripType === "outstation" && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  <input
                    type="checkbox"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "var(--brand-primary, #2563EB)" }}
                  />
                  <span>Round Trip (Return)</span>
                </label>
              </div>
            )}
          </div>

          {/* ADVANCE PRE-BOOKING NOTICE FOR OUTSTATION & RENTALS */}
          {tripType !== "city" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.06)",
                border: "1px solid rgba(37, 99, 235, 0.25)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.80rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>Advance Pre-Booking Guaranteed: <strong>Lock zero-surge price & reserved chauffeur</strong></span>
              </div>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Free cancellation up to 2 hours before scheduled pickup
              </span>
            </div>
          )}

          {/* Intra-District Route Badge for Daily City Cab */}
          {tripType === "city" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: isDark ? "rgba(22, 163, 74, 0.12)" : "rgba(22, 163, 74, 0.08)",
                border: "1px solid rgba(22, 163, 74, 0.25)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.80rem", color: "#16A34A", fontWeight: 700 }}>
                <CheckCircle2 size={15} />
                <span>Intra-District Route: <strong>{cityPickupPlace}</strong> ➔ <strong>{cityDropPlace}</strong></span>
              </div>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Est. ~{estimatedDistance} km within {currentDistrict.districtName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Fleet Category Cards */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.30rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Available Fleet Options for {tripType === "city" ? `${currentDistrict.districtName} (${cityPickupPlace} ➔ ${cityDropPlace})` : `${pickupCity} ${tripType !== "rental" ? `→ ${dropCity}` : ""}`}
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
              Estimated Distance: <strong>~{estimatedDistance} km</strong> • All tolls & chauffeur charges calculated.
            </p>
          </div>

          <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", padding: "6px 12px", borderRadius: "9999px" }}>
            <Info size={13} style={{ display: "inline", marginRight: "4px" }} />
            <span>Clean, Sanitized & GPS-Tracked Vehicles</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "18px" }}>
          {CAB_FLEET_CATEGORIES.map((cab) => {
            const isSelected = selectedCabId === cab.id;
            const fare = calculateFare(cab);

            return (
              <div
                key={cab.id}
                onClick={() => setSelectedCabId(cab.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "var(--radius-2xl, 18px)",
                  padding: "22px",
                  background: isSelected
                    ? (isDark ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.04)")
                    : "var(--bg-card, #FFFFFF)",
                  border: "2px solid",
                  borderColor: isSelected ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                  boxShadow: isSelected ? "0 8px 24px rgba(37,99,235,0.22)" : "var(--shadow-sm)",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  transform: isSelected ? "translateY(-3px)" : "none"
                }}
              >
                <div>
                  {/* Top Tag & ETA */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        padding: "3px 9px",
                        borderRadius: "9999px",
                        background: `${cab.tagColor}1A`,
                        color: cab.tagColor,
                        border: `1px solid ${cab.tagColor}40`
                      }}
                    >
                      {cab.tag}
                    </span>
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#16A34A" }}>
                      ● {cab.eta}
                    </span>
                  </div>

                  {/* Cab Image & Name */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                    <img
                      src={cab.image}
                      alt={cab.name}
                      style={{ width: "70px", height: "50px", objectFit: "cover", borderRadius: "10px" }}
                    />
                    <div>
                      <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                        {cab.name}
                      </h4>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                        {cab.models}
                      </div>
                    </div>
                  </div>

                  {/* Passenger & Luggage Specs */}
                  <div style={{ display: "flex", gap: "12px", padding: "8px 10px", borderRadius: "8px", background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC", marginBottom: "14px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Users size={13} /> {cab.capacity}
                    </span>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Luggage size={13} /> {cab.luggage.split("+")[0]}
                    </span>
                  </div>

                  {/* Price Box */}
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                      Total Estimated Fare
                    </div>
                    <div style={{ fontSize: "1.45rem", fontWeight: 900, color: "#16A34A" }}>
                      ₹{fare.toLocaleString("en-IN")}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      ₹{cab.perKmRate}/km base rate • Tolls & allowance included
                    </div>
                  </div>

                  {/* Key Features */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
                    {cab.features.map((feat, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.70rem",
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: "4px",
                          background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                          color: "var(--text-secondary)"
                        }}
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAuthenticated) {
                      showToast?.("Please Sign In or Create an Account to book a cab! 🚖");
                      openAuthModal("signin");
                      return;
                    }
                    setSelectedCabId(cab.id);
                    setIsBookingModalOpen(true);
                  }}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "12px",
                    border: isSelected ? "none" : "1.5px solid var(--brand-primary, #2563EB)",
                    background: isSelected ? "var(--brand-primary, #2563EB)" : "transparent",
                    color: isSelected ? "#FFFFFF" : "var(--brand-primary, #2563EB)",
                    fontWeight: 800,
                    fontSize: "0.86rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                    transition: "all 0.18s ease"
                  }}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>{tripType === "city" ? `Book ${cab.name}` : `Pre-Book ${cab.name}`}</span>
                    </>
                  ) : (
                    <>
                      <span>{tripType === "city" ? "Select & Book" : "Select & Pre-Book"}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Confirmation / Booking Modal */}
      {isBookingModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "540px",
              background: isDark ? "#0F172A" : "#FFFFFF",
              borderRadius: "var(--radius-2xl, 20px)",
              padding: "26px",
              border: "1.5px solid var(--border-subtle)",
              boxShadow: "var(--shadow-2xl)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <button
              onClick={() => {
                setIsBookingModalOpen(false);
                setConfirmedBooking(null);
              }}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              <X size={20} />
            </button>

            {confirmedBooking ? (
              /* Booking Success Pass */
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#16A34A", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 style={{ fontSize: "1.30rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {tripType === "city" ? "Daily Cab Dispatched!" : "Pre-Booking Confirmed!"}
                  </h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                    {tripType === "city"
                      ? "Your chauffeur is on the way for immediate intra-district pickup."
                      : "Your advance reservation is locked with guaranteed vehicle & chauffeur."}
                  </p>
                </div>

                {/* Driver & Cab OTP Card */}
                <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC", padding: "16px", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Trip OTP (Share on Start)</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--brand-primary, #2563EB)", letterSpacing: "0.1em" }}>
                        {confirmedBooking.otp}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Booking ID</div>
                      <strong style={{ fontSize: "0.90rem", color: "var(--text-primary)" }}>{confirmedBooking.bookingId}</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--brand-primary, #2563EB)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                      RK
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.92rem" }}>
                        {confirmedBooking.driverName} • <span style={{ color: "#EA580C" }}>{confirmedBooking.driverRating} ★</span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        {confirmedBooking.vehicleModel} • <strong>{confirmedBooking.vehicleNumber}</strong>
                      </div>
                    </div>
                    <a
                      href={`tel:${confirmedBooking.driverPhone}`}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: "#16A34A",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Phone size={13} /> Call
                    </a>
                  </div>
                </div>

                {/* Route Summary */}
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Route:</span>
                    <strong style={{ color: "var(--text-primary)" }}>{confirmedBooking.pickupLocation} → {confirmedBooking.dropLocation}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Schedule:</span>
                    <span>{tripType === "city" ? "Instant (Arriving ~3-5 mins)" : `${confirmedBooking.pickupDate} at ${confirmedBooking.pickupTime}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#16A34A", fontWeight: 800, fontSize: "0.95rem" }}>
                    <span>Total Fare:</span>
                    <span>₹{confirmedBooking.totalFare.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-subtle)",
                      background: "transparent",
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <Printer size={14} /> Print Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setConfirmedBooking(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      border: "none",
                      background: "var(--brand-primary, #2563EB)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.84rem",
                      cursor: "pointer"
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Input Form */
              <form onSubmit={handleConfirmRide} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--brand-primary, #2563EB)", fontWeight: 800, textTransform: "uppercase" }}>
                    {tripType === "city" ? "Instant Daily Cab Reservation" : "Guaranteed Advance Pre-Booking"}
                  </span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: "2px 0 0" }}>
                    {selectedCab.name} ({selectedCab.models.split(",")[0]})
                  </h3>
                  <div style={{ fontSize: "0.80rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {tripType === "city"
                      ? `${cityPickupPlace} ➔ ${cityDropPlace} (${currentDistrict.districtName}) • Instant Ride`
                      : `${pickupCity} ${tripType !== "rental" ? `→ ${dropCity}` : ""} • Pre-booked for ${pickupDate} at ${pickupTime}`}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Passenger Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "0.88rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Mobile Number (For Driver Call & OTP)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "0.88rem"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Special Pickup Notes / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Near main gate, need boot space for stroller"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                      color: "var(--text-primary)",
                      fontSize: "0.84rem"
                    }}
                  />
                </div>

                {/* Fare Summary Box */}
                <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", padding: "14px", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Total Fare (Incl. Tolls & GST)</div>
                    <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#16A34A" }}>
                      ₹{activeFare.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 700, background: "rgba(22, 163, 74, 0.12)", padding: "4px 10px", borderRadius: "9999px" }}>
                    Instant Dispatch ✓
                  </span>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "var(--brand-primary, #2563EB)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.92rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.35)"
                  }}
                >
                  Confirm & Dispatch Cab
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
