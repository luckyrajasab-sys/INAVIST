import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MapPin,
  Calendar,
  Users,
  ArrowLeftRight,
  Search,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Building,
  Plane,
  Train,
  Bus,
  ShieldCheck,
  TrendingUp,
  X
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { VERIFIED_INDIAN_CITIES, getCitySuggestions } from "../../data/indianCitiesDirectory";
import { getPlaceConnectivity } from "../../data/transitConnectivityHub";

const POPULAR_DESTINATIONS = [
  { name: "Goa", type: "Beach & Coastal Hub", state: "Goa", code: "GOI" },
  { name: "Kodaikanal", type: "Princess of Hills", state: "Tamil Nadu", code: "KOD" },
  { name: "Leh Ladakh", type: "High Altitude Passes", state: "Ladakh", code: "IXL" },
  { name: "Varanasi", type: "Sacred Spiritual Ghats", state: "Uttar Pradesh", code: "BSB" },
  { name: "Munnar", type: "Tea Gardens & Mist", state: "Kerala", code: "COK" },
  { name: "Jaipur", type: "Pink City & Forts", state: "Rajasthan", code: "JAI" }
];

const RECENT_SEARCHES_DEFAULT = [
  { from: "Chennai", to: "Bengaluru" },
  { from: "Delhi", to: "Goa" },
  { from: "Mumbai", to: "Kodaikanal" }
];

export const AdvancedSearchBar = ({
  onSearch,
  initialFrom = "",
  initialTo = "",
  initialDate = null
}) => {
  const { isDark } = useTheme();

  // Inputs
  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);
  const todayStr = new Date().toISOString().split("T")[0];
  const [travelDate, setTravelDate] = useState(
    initialDate || new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]
  );

  // Travellers breakdown
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);
  const [isTravellerDropdownOpen, setIsTravellerDropdownOpen] = useState(false);

  // Travel Preference
  const [preference, setPreference] = useState("best_value"); // 'cheapest' | 'fastest' | 'best_value' | 'comfortable'

  // Autocomplete dropdowns
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  // Validation
  const [validationError, setValidationError] = useState(null);

  // Recent searches
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("inavist_recent_searches");
    return saved ? JSON.parse(saved) : RECENT_SEARCHES_DEFAULT;
  });

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const travellerRef = useRef(null);

  // Dynamic Transit & Connectivity Intelligence
  const destinationConnectivity = useMemo(() => {
    return getPlaceConnectivity(toLocation);
  }, [toLocation]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setIsFromOpen(false);
      if (toRef.current && !toRef.current.contains(e.target)) setIsToOpen(false);
      if (travellerRef.current && !travellerRef.current.contains(e.target)) setIsTravellerDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFromChange = (val) => {
    setFromLocation(val);
    setValidationError(null);
    if (val.trim().length > 0) {
      setFromSuggestions(getCitySuggestions(val));
      setIsFromOpen(true);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (val) => {
    setToLocation(val);
    setValidationError(null);
    if (val.trim().length > 0) {
      setToSuggestions(getCitySuggestions(val));
      setIsToOpen(true);
    } else {
      setToSuggestions([]);
    }
  };

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
    setValidationError(null);
  };

  const handleDateShortcut = (daysAhead) => {
    const d = new Date(Date.now() + 86400000 * daysAhead);
    setTravelDate(d.toISOString().split("T")[0]);
  };

  const handleFind = (e) => {
    if (e) e.preventDefault();

    const cleanFrom = fromLocation.trim();
    const cleanTo = toLocation.trim();

    if (!cleanFrom) {
      setValidationError("Please enter a departure origin location (From).");
      return;
    }
    if (!cleanTo) {
      setValidationError("Please enter a destination location (To).");
      return;
    }
    if (cleanFrom.toLowerCase() === cleanTo.toLowerCase()) {
      setValidationError("Origin (From) and Destination (To) cannot be the exact same location. Please choose different points.");
      return;
    }
    if (travelDate < todayStr) {
      setValidationError("Travel date cannot be in the past.");
      return;
    }

    setValidationError(null);

    // Update recent searches
    const newRecent = [
      { from: cleanFrom, to: cleanTo },
      ...recentSearches.filter((s) => !(s.from.toLowerCase() === cleanFrom.toLowerCase() && s.to.toLowerCase() === cleanTo.toLowerCase()))
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("inavist_recent_searches", JSON.stringify(newRecent));

    const totalPassengers = adults + children;

    if (onSearch) {
      onSearch({
        fromCity: cleanFrom,
        toDestination: cleanTo,
        travelDate,
        passengers: totalPassengers,
        adults,
        children,
        isSeniorCitizen,
        travelPreference: preference
      });
    }
  };

  const totalPax = adults + children;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1180px",
        margin: "0 auto",
        position: "relative",
        zIndex: 20
      }}
    >
      <form
        onSubmit={handleFind}
        className="glass-card"
        style={{
          borderRadius: "var(--radius-2xl, 24px)",
          padding: "26px 28px",
          border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid rgba(0,0,0,0.08)",
          boxShadow: isDark
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(37, 99, 235, 0.15)"
            : "0 20px 45px -10px rgba(37, 99, 235, 0.12), 0 4px 20px rgba(0,0,0,0.04)",
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.96) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        {/* Top Header Strip: Quick Mode Indicators & Recent Searches */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)"
              }}
            >
              <Search size={16} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                  margin: 0
                }}
              >
                Search Trains, Buses, Flights & Cabs Across India
              </h2>
              <p style={{ margin: 0, fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Instant real-time fare comparison, seat status & connected multi-modal routes
              </p>
            </div>
          </div>

          {/* Quick Route Badges (Recent/Popular) */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Quick Routes:
            </span>
            {recentSearches.slice(0, 3).map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setFromLocation(r.from);
                  setToLocation(r.to);
                  setValidationError(null);
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full, 9999px)",
                  background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all var(--transition-fast)"
                }}
              >
                <span>{r.from} ➔ {r.to}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-lg, 12px)",
              background: "rgba(220, 38, 38, 0.12)",
              border: "1.5px solid rgba(220, 38, 38, 0.35)",
              color: "#DC2626",
              fontSize: "0.84rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <AlertCircle size={17} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main Search Inputs Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            position: "relative"
          }}
        >
          {/* 1. FROM Location Input */}
          <div style={{ position: "relative" }} ref={fromRef}>
            <label
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <MapPin size={13} style={{ color: "#2563EB" }} />
              <span>From (Origin)</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => handleFromChange(e.target.value)}
                onFocus={() => setIsFromOpen(true)}
                placeholder="Search departure city, station, airport..."
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 40px",
                  borderRadius: "var(--radius-xl, 16px)",
                  border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #CBD5E1",
                  background: isDark ? "rgba(0,0,0,0.35)" : "#F8FAFC",
                  color: "var(--text-primary)",
                  fontSize: "0.96rem",
                  fontWeight: 700,
                  outline: "none",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)"
                }}
              />
              <MapPin
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "16px",
                  color: "#2563EB"
                }}
              />
              {fromLocation && (
                <button
                  type="button"
                  onClick={() => setFromLocation("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "16px",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer"
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* From Suggestions Dropdown */}
            {isFromOpen && (
              <div
                className="glass-card"
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  maxHeight: "320px",
                  overflowY: "auto",
                  zIndex: 99,
                  borderRadius: "var(--radius-xl, 16px)",
                  padding: "8px",
                  boxShadow: "0 15px 35px -5px rgba(0,0,0,0.3)",
                  background: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
                  border: "1.5px solid var(--border-subtle)"
                }}
              >
                <div style={{ padding: "6px 10px", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {fromSuggestions.length > 0 ? "Suggested Locations" : "Popular Indian Hubs"}
                </div>
                {(fromSuggestions.length > 0 ? fromSuggestions : POPULAR_DESTINATIONS).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFromLocation(item.name);
                      setIsFromOpen(false);
                      setValidationError(null);
                    }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md, 8px)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background 0.15s ease",
                      borderBottom: "1px solid var(--border-subtle)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <MapPin size={15} style={{ color: "#2563EB" }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {item.type || item.state}
                        </div>
                      </div>
                    </div>
                    {item.code && (
                      <span style={{ fontSize: "0.70rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                        {item.code}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button (Floating or inline) */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "6px" }}>
            <button
              type="button"
              onClick={handleSwap}
              title="Swap From and To"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
                border: "1.5px solid var(--border-subtle)",
                color: "#2563EB",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(180deg)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
            >
              <ArrowLeftRight size={17} />
            </button>
          </div>

          {/* 2. TO Location Input */}
          <div style={{ position: "relative" }} ref={toRef}>
            <label
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <MapPin size={13} style={{ color: "#16A34A" }} />
              <span>To (Destination)</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={toLocation}
                onChange={(e) => handleToChange(e.target.value)}
                onFocus={() => setIsToOpen(true)}
                placeholder="Search destination city, hill station, beach..."
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 40px",
                  borderRadius: "var(--radius-xl, 16px)",
                  border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #CBD5E1",
                  background: isDark ? "rgba(0,0,0,0.35)" : "#F8FAFC",
                  color: "var(--text-primary)",
                  fontSize: "0.96rem",
                  fontWeight: 700,
                  outline: "none",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)"
                }}
              />
              <MapPin
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "16px",
                  color: "#16A34A"
                }}
              />
              {toLocation && (
                <button
                  type="button"
                  onClick={() => setToLocation("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "16px",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer"
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* To Suggestions Dropdown */}
            {isToOpen && (
              <div
                className="glass-card"
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  maxHeight: "320px",
                  overflowY: "auto",
                  zIndex: 99,
                  borderRadius: "var(--radius-xl, 16px)",
                  padding: "8px",
                  boxShadow: "0 15px 35px -5px rgba(0,0,0,0.3)",
                  background: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
                  border: "1.5px solid var(--border-subtle)"
                }}
              >
                <div style={{ padding: "6px 10px", fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {toSuggestions.length > 0 ? "Matching Destinations" : "Trending Destinations in India"}
                </div>
                {(toSuggestions.length > 0 ? toSuggestions : POPULAR_DESTINATIONS).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setToLocation(item.name);
                      setIsToOpen(false);
                      setValidationError(null);
                    }}
                    style={{
                      padding: "9px 12px",
                      borderRadius: "var(--radius-md, 8px)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.15s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(22,163,74,0.18)" : "rgba(22,163,74,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <MapPin size={16} style={{ color: "#16A34A" }} />
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {item.type || item.state}
                        </div>
                      </div>
                    </div>
                    {item.code && (
                      <span style={{ fontSize: "0.70rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                        {item.code}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Travel Date Input with Shortcuts */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Calendar size={13} style={{ color: "#EA580C" }} />
                <span>Travel Date</span>
              </label>

              {/* Date Shortcut Pills */}
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  type="button"
                  onClick={() => handleDateShortcut(0)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#2563EB",
                    cursor: "pointer",
                    padding: "0 2px"
                  }}
                >
                  Today
                </button>
                <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>•</span>
                <button
                  type="button"
                  onClick={() => handleDateShortcut(1)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "#2563EB",
                    cursor: "pointer",
                    padding: "0 2px"
                  }}
                >
                  Tomorrow
                </button>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type="date"
                min={todayStr}
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 40px",
                  borderRadius: "var(--radius-xl, 16px)",
                  border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #CBD5E1",
                  background: isDark ? "rgba(0,0,0,0.35)" : "#F8FAFC",
                  color: "var(--text-primary)",
                  fontSize: "0.94rem",
                  fontWeight: 700,
                  outline: "none"
                }}
              />
              <Calendar
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "16px",
                  color: "#EA580C"
                }}
              />
            </div>
          </div>

          {/* 4. Travellers Counter & Senior Citizen Selector */}
          <div style={{ position: "relative" }} ref={travellerRef}>
            <label
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <Users size={13} style={{ color: "#7C3AED" }} />
              <span>Travellers</span>
            </label>

            <button
              type="button"
              onClick={() => setIsTravellerDropdownOpen(!isTravellerDropdownOpen)}
              style={{
                width: "100%",
                padding: "14px 14px 14px 40px",
                borderRadius: "var(--radius-xl, 16px)",
                border: isDark ? "1.5px solid rgba(255,255,255,0.12)" : "1.5px solid #CBD5E1",
                background: isDark ? "rgba(0,0,0,0.35)" : "#F8FAFC",
                color: "var(--text-primary)",
                fontSize: "0.94rem",
                fontWeight: 700,
                outline: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <Users
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "16px",
                  color: "#7C3AED"
                }}
              />
              <span>
                {totalPax} Traveller{totalPax > 1 ? "s" : ""}
                {isSeniorCitizen ? " • Sr. Citizen" : ""}
              </span>
              <ChevronDown size={15} style={{ transform: isTravellerDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
            </button>

            {/* Travellers Details Dropdown */}
            {isTravellerDropdownOpen && (
              <div
                className="glass-card"
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  width: "280px",
                  zIndex: 99,
                  borderRadius: "var(--radius-xl, 16px)",
                  padding: "16px",
                  boxShadow: "0 15px 35px -5px rgba(0,0,0,0.3)",
                  background: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
                  border: "1.5px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                {/* Adults */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>Adults</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Age 12+ years</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        cursor: adults <= 1 ? "not-allowed" : "pointer"
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 800, fontSize: "0.96rem", minWidth: "20px", textAlign: "center" }}>{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        cursor: "pointer"
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)" }}>Children</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Age 2 - 11 years</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        cursor: children <= 0 ? "not-allowed" : "pointer"
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 800, fontSize: "0.96rem", minWidth: "20px", textAlign: "center" }}>{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--bg-tertiary)",
                        color: "var(--text-primary)",
                        fontWeight: 800,
                        cursor: "pointer"
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Senior Citizen Checkbox */}
                <div
                  onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    background: isSeniorCitizen ? "rgba(124, 58, 237, 0.12)" : "var(--bg-tertiary)",
                    border: `1px solid ${isSeniorCitizen ? "rgba(124, 58, 237, 0.3)" : "transparent"}`,
                    cursor: "pointer"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSeniorCitizen}
                    onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                    style={{ accentColor: "#7C3AED", cursor: "pointer" }}
                  />
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Senior Citizen (60+ yrs)</div>
                    <div style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>Special lower-berth priority in trains</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTravellerDropdownOpen(false)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    background: "#2563EB",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transit Verification & Nearest Hub Advisory (for places lacking direct airways or railways) */}
        {toLocation.trim().length > 1 && destinationConnectivity && (!destinationConnectivity.hasDirectAirway || !destinationConnectivity.hasDirectRailway) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "12px 16px",
              borderRadius: "var(--radius-xl, 14px)",
              background: isDark ? "rgba(234, 88, 12, 0.12)" : "rgba(234, 88, 12, 0.07)",
              border: "1.5px solid rgba(234, 88, 12, 0.35)",
              fontSize: "0.82rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={16} color="#EA580C" />
              <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                📍 Transit Intelligence: <strong>{destinationConnectivity.name}</strong> has no direct {!destinationConnectivity.hasDirectAirway && !destinationConnectivity.hasDirectRailway ? "commercial airport or direct mainline railhead" : !destinationConnectivity.hasDirectAirway ? "commercial airport" : "direct railway station"}.
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              {!destinationConnectivity.hasDirectAirway && destinationConnectivity.nearestAirport && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
                    padding: "5px 12px",
                    borderRadius: "9999px",
                    color: "var(--brand-primary, #2563EB)",
                    fontWeight: 800
                  }}
                >
                  <Plane size={13} />
                  <span>Nearest Airport: <strong>{destinationConnectivity.nearestAirport.name} ({destinationConnectivity.nearestAirport.code})</strong> • {destinationConnectivity.nearestAirport.distanceKm} km away ({destinationConnectivity.nearestAirport.driveTime})</span>
                </div>
              )}
              {!destinationConnectivity.hasDirectRailway && destinationConnectivity.nearestRailway && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: isDark ? "rgba(22, 163, 74, 0.2)" : "rgba(22, 163, 74, 0.1)",
                    padding: "5px 12px",
                    borderRadius: "9999px",
                    color: "#16A34A",
                    fontWeight: 800
                  }}
                >
                  <Train size={13} />
                  <span>Nearest Railhead: <strong>{destinationConnectivity.nearestRailway.name} ({destinationConnectivity.nearestRailway.code})</strong> • {destinationConnectivity.nearestRailway.distanceKm} km away ({destinationConnectivity.nearestRailway.driveTime})</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section: Travel Preference Filter & Find CTA Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            paddingTop: "10px",
            borderTop: "1px solid var(--border-subtle)"
          }}
        >
          {/* Preference Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Preference:
            </span>
            {[
              { id: "cheapest", label: "Cheapest", icon: "💰" },
              { id: "fastest", label: "Fastest", icon: "⚡" },
              { id: "best_value", label: "Best Value", icon: "⭐" },
              { id: "comfortable", label: "Comfortable (AC/1st Class)", icon: "🛋️" }
            ].map((p) => {
              const isSelected = preference === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPreference(p.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full, 9999px)",
                    border: "1.5px solid",
                    borderColor: isSelected ? "#2563EB" : "var(--border-subtle)",
                    background: isSelected
                      ? (isDark ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.12)")
                      : "transparent",
                    color: isSelected ? "#2563EB" : "var(--text-secondary)",
                    fontSize: "0.80rem",
                    fontWeight: isSelected ? 800 : 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* MAIN PROMINENT CTA: "FIND" */}
          <button
            type="submit"
            style={{
              padding: "15px 44px",
              borderRadius: "var(--radius-xl, 16px)",
              border: "none",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              color: "#FFFFFF",
              fontFamily: "var(--font-heading)",
              fontSize: "1.12rem",
              fontWeight: 900,
              letterSpacing: "0.03em",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.45)",
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(37, 99, 235, 0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(37, 99, 235, 0.45)";
            }}
          >
            <Search size={20} strokeWidth={2.5} />
            <span>Find</span>
          </button>
        </div>
      </form>
    </div>
  );
};
