import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Plane,
  Train,
  Bus,
  Car,
  Bike,
  Clock,
  IndianRupee,
  Search,
  CheckCircle2,
  Ticket,
  ArrowRight,
  ShieldCheck,
  X,
  MapPin,
  Calendar,
  Filter,
  Sparkles,
  ChevronRight,
  Navigation,
  AlertTriangle,
  ArrowLeftRight,
  Zap,
  Sliders,
  Layers,
  GitFork,
  CarFront
} from "lucide-react";
import { usePlanner } from "../../context/PlannerContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getAllStates, destinationsData } from "../../data/destinationsData";
import { verifyIndianCity, getCitySuggestions } from "../../data/indianCitiesDirectory";
import { FirstMileComparison } from "./FirstMileComparison";
import { MainTransportComparison } from "./MainTransportComparison";
import { AlternativeRoutesView } from "./AlternativeRoutesView";
import { JourneyTimeline } from "./JourneyTimeline";
import { SuddenTravelModal } from "./SuddenTravelModal";
import { TransportService } from "../../services/TransportService";
import { FareEstimator } from "../../services/FareEstimator";
import { getPlaceConnectivity } from "../../data/transitConnectivityHub";

const MAJOR_ORIGINS = [
  "Chennai (MAA)",
  "Delhi (DEL)",
  "Mumbai (BOM)",
  "Bengaluru (BLR)",
  "Kolkata (CCU)",
  "Hyderabad (HYD)",
  "Ahmedabad (AMD)",
  "Kochi (COK)",
  "Pune (PNQ)",
  "Chandigarh (IXC)"
];

const POPULAR_SEARCH_ROUTES = [
  { from: "Chennai", to: "Kodaikanal", state: "Tamil Nadu", tag: "Hill Station" },
  { from: "Delhi", to: "Leh Ladakh", state: "Ladakh", tag: "High Altitude" },
  { from: "Bengaluru", to: "Munnar", state: "Kerala", tag: "Tea Valleys" },
  { from: "Delhi", to: "Varanasi", state: "Uttar Pradesh", tag: "Sacred Heritage" },
  { from: "Mumbai", to: "Goa", state: "Goa", tag: "Coastal" },
  { from: "Delhi", to: "Manali", state: "Himachal Pradesh", tag: "Snow & Passes" }
];

export const TransportHub = ({ initialDestination = null, onSelectDestination, onBackdropChange }) => {
  const { bookTransportTicket, bookedTickets, showToast } = usePlanner();
  const { isDark } = useTheme();
  const { isAuthenticated, openAuthModal, user } = useAuth();

  const [fromCity, setFromCity] = useState("");
  const [toDestination, setToDestination] = useState(initialDestination?.name || "");
  const [travelDate, setTravelDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );
  const [passengerCount, setPassengerCount] = useState(1);

  // Active View Tab: 'smart_journey' | 'main_comparison' | 'first_mile' | 'alternatives' | 'timeline'
  const [activeSubTab, setActiveSubTab] = useState("smart_journey");

  // Filters
  const [filterMode, setFilterMode] = useState("all");
  const [filterBudget, setFilterBudget] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");
  const [filterPreference, setFilterPreference] = useState("all");

  // Validation States
  const [validationError, setValidationError] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  // Booking Modal
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // Sudden Travel Modal
  const [isSuddenModalOpen, setIsSuddenModalOpen] = useState(false);

  // Verified route
  const [verifiedRoute, setVerifiedRoute] = useState({
    from: "",
    to: initialDestination?.name || "",
    state: "",
    isValid: false
  });

  // Dynamic Smart Journey Bundle
  const [journeyBundle, setJourneyBundle] = useState(() =>
    TransportService.getSmartJourneyPlan({
      fromLocation: "Chennai",
      toDestination: "Kodaikanal",
      travelDate,
      passengers: 1
    })
  );

  // Active selection inside journey bundle
  const [selectedFirstMile, setSelectedFirstMile] = useState(
    journeyBundle.defaultSelection.firstMile
  );
  const [selectedMainMode, setSelectedMainMode] = useState("train");
  const [selectedMainOption, setSelectedMainOption] = useState(null);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState(null);

  const handleSwapRoutes = () => {
    const tempFrom = fromCity;
    const tempTo = toDestination;
    setFromCity(tempTo);
    setToDestination(tempFrom);
    setValidationError(null);
    validateAndExecuteSearch(tempTo, tempFrom);
  };

  useEffect(() => {
    if (initialDestination) {
      const destName = initialDestination.name || initialDestination;
      setToDestination(destName);
      validateAndExecuteSearch("Chennai", destName);
      if (onBackdropChange && initialDestination.images?.[0]) {
        onBackdropChange(initialDestination.images[0]);
      }
    }
  }, [initialDestination]);

  const handleFromChange = (val) => {
    setFromCity(val);
    setValidationError(null);
    if (val.trim().length >= 1) {
      setFromSuggestions(getCitySuggestions(val));
      setShowFromSuggestions(true);
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToChange = (val) => {
    setToDestination(val);
    setValidationError(null);
    if (val.trim().length >= 1) {
      setToSuggestions(getCitySuggestions(val));
      setShowToSuggestions(true);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const validateAndExecuteSearch = (from, to) => {
    setShowFromSuggestions(false);
    setShowToSuggestions(false);

    const originCheck = verifyIndianCity(from);
    if (!originCheck.isValid) {
      setValidationError({
        field: "from",
        message: `"${from}" is not a recognized Indian city. Please enter a valid origin city.`,
        suggestions: originCheck.suggestions
      });
      return false;
    }

    const destCheck = verifyIndianCity(to);
    if (!destCheck.isValid) {
      setValidationError({
        field: "to",
        message: `"${to}" is not a recognized Indian city or destination. Please enter a valid city name.`,
        suggestions: destCheck.suggestions
      });
      return false;
    }

    setValidationError(null);
    setVerifiedRoute({
      from: originCheck.city,
      to: destCheck.city,
      state: destCheck.state,
      isValid: true
    });

    const bundle = TransportService.getSmartJourneyPlan({
      fromLocation: originCheck.city,
      toDestination: destCheck.city,
      travelDate,
      passengers: passengerCount
    });

    setJourneyBundle(bundle);
    setSelectedFirstMile(bundle.defaultSelection.firstMile);
    setSelectedMainOption(null);
    setSelectedAlternativeId(null);
    showToast?.(`Smart Journey generated for ${originCheck.city} → ${destCheck.city}! 🚆🚌`);
    return true;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    validateAndExecuteSearch(fromCity, toDestination);
  };

  const handleOpenBooking = (transport) => {
    if (!isAuthenticated) {
      showToast?.("Please Sign In or Create an Account to book transit tickets! 🎫");
      openAuthModal("signin");
      return;
    }
    setSelectedTransport(transport);
    setConfirmedTicket(null);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast?.("Please Sign In or Create an Account to book transit tickets! 🎫");
      openAuthModal("signin");
      return;
    }
    if (!selectedTransport) return;

    const ticket = bookTransportTicket(selectedTransport, passengerCount, travelDate);
    setConfirmedTicket(ticket);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast?.(`Ticket booked successfully for ${selectedTransport.operator || selectedTransport.title}! 🎉`);
  };

  const activeMainChoice = journeyBundle.mainTransport[selectedMainMode] || journeyBundle.mainTransport.train;

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
                Preview Mode (Sign In Required to Book Tickets)
              </strong>
              <span style={{ fontSize: "0.80rem", color: "var(--text-secondary)" }}>
                You can compare trains, buses, flights, and cab routes freely. Sign in or create an account to book e-tickets and obtain IRCTC / bus PNRs.
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

      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "30px 28px",
          background: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--border-subtle)",
          position: "relative",
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
                borderRadius: "var(--radius-full)",
                fontSize: "0.78rem",
                fontWeight: 800,
                marginBottom: "10px"
              }}
            >
              <ShieldCheck size={14} />
              <span>Smart Journey & Transport Comparison Engine</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 900, marginBottom: "6px", color: "var(--text-primary)" }}>
              Transportation Hub
            </h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: "700px" }}>
              Doorstep-to-destination transport comparison. Compare first-mile cabs, IRCTC trains, luxury buses, flights, and multi-hop alternative connections across India.
            </p>
          </div>

          {/* Sudden Travel Action Button */}
          <button
            type="button"
            onClick={() => setIsSuddenModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "var(--radius-full)",
              background: "rgba(220, 38, 38, 0.12)",
              color: "#DC2626",
              border: "1.5px solid rgba(220, 38, 38, 0.3)",
              fontSize: "0.84rem",
              fontWeight: 800,
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
          >
            <Zap size={16} />
            <span>Need to Travel Now?</span>
          </button>
        </div>

        {/* Route Search Console */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            marginTop: "20px",
            background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
            padding: "18px 20px",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-subtle)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            alignItems: "flex-end"
          }}
        >
          {/* Origin Input */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              From (Origin City)
            </label>
            <input
              type="text"
              value={fromCity}
              onChange={(e) => handleFromChange(e.target.value)}
              onFocus={() => fromCity.trim().length >= 1 && setShowFromSuggestions(true)}
              placeholder="Search departure city, station, airport..."
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
              required
            />

            {showFromSuggestions && fromSuggestions.length > 0 && (
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
                  zIndex: 20,
                  marginTop: "4px",
                  maxHeight: "200px",
                  overflowY: "auto"
                }}
              >
                {fromSuggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFromCity(sug.name);
                      setShowFromSuggestions(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "0.84rem",
                      borderBottom: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <span><strong>{sug.name}</strong>, {sug.state}</span>
                    <span style={{ fontSize: "0.70rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700 }}>{sug.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button
              type="button"
              onClick={handleSwapRoutes}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                border: "1px solid var(--border-subtle)",
                color: "var(--brand-primary, #2563EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
              title="Swap Origin and Destination"
            >
              <ArrowLeftRight size={16} />
            </button>
          </div>

          {/* Destination Input */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              To (Destination)
            </label>
            <input
              type="text"
              value={toDestination}
              onChange={(e) => handleToChange(e.target.value)}
              onFocus={() => toDestination.trim().length >= 1 && setShowToSuggestions(true)}
              placeholder="Search destination city, hill station, beach..."
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
              required
            />

            {showToSuggestions && toSuggestions.length > 0 && (
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
                  zIndex: 20,
                  marginTop: "4px",
                  maxHeight: "200px",
                  overflowY: "auto"
                }}
              >
                {toSuggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setToDestination(sug.name);
                      setShowToSuggestions(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "0.84rem",
                      borderBottom: "1px solid var(--border-subtle)",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <span><strong>{sug.name}</strong>, {sug.state}</span>
                    <span style={{ fontSize: "0.70rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700 }}>{sug.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Travel Date */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              Travel Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
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
              required
            />
          </div>

          {/* Passengers */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              Travellers
            </label>
            <select
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number(e.target.value))}
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
              {[1, 2, 3, 4, 5, 6].map((p) => (
                <option key={p} value={p}>{p} Person{p > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              height: "42px",
              padding: "0 22px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "var(--brand-primary, #2563EB)",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "0.90rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(37,99,235,0.35)"
            }}
          >
            <Search size={16} />
            <span>Search & Compare</span>
          </button>
        </form>

        {/* Validation error alert */}
        {validationError && (
          <div
            style={{
              marginTop: "14px",
              background: "rgba(220, 38, 38, 0.12)",
              border: "1.5px solid #DC2626",
              borderRadius: "var(--radius-lg)",
              padding: "14px 18px",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#DC2626", fontWeight: 800 }}>
              <AlertTriangle size={18} />
              <span>City Verification Error</span>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-primary)" }}>{validationError.message}</p>
          </div>
        )}

        {/* Verified Route Shortcuts */}
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Popular Routes:
          </span>
          {POPULAR_SEARCH_ROUTES.map((r, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setFromCity(r.from);
                setToDestination(r.to);
                validateAndExecuteSearch(r.from, r.to);
              }}
              style={{
                fontSize: "0.76rem",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-subtle)",
                background: toDestination.toLowerCase() === r.to.toLowerCase() ? "rgba(37, 99, 235, 0.12)" : "transparent",
                color: toDestination.toLowerCase() === r.to.toLowerCase() ? "var(--brand-primary, #2563EB)" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              {r.from} → {r.to} ({r.tag})
            </button>
          ))}
        </div>

        {/* Live Transit Connectivity Intelligence Advisory */}
        {(() => {
          const connectivity = getPlaceConnectivity(toDestination);
          if (!connectivity || (connectivity.hasDirectAirway && connectivity.hasDirectRailway)) return null;

          return (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px 16px",
                borderRadius: "var(--radius-xl, 14px)",
                background: isDark ? "rgba(234, 88, 12, 0.12)" : "rgba(234, 88, 12, 0.08)",
                border: "1.5px solid rgba(234, 88, 12, 0.35)",
                fontSize: "0.82rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} color="#EA580C" />
                <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  📍 Verified Transit Infrastructure: <strong>{connectivity.name}</strong> has no direct {!connectivity.hasDirectAirway && !connectivity.hasDirectRailway ? "commercial airport or mainline railway" : !connectivity.hasDirectAirway ? "commercial airport" : "direct railway station"}.
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {!connectivity.hasDirectAirway && connectivity.nearestAirport && (
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
                    <span>Nearest Airport: <strong>{connectivity.nearestAirport.name} ({connectivity.nearestAirport.code})</strong> • {connectivity.nearestAirport.distanceKm} km ({connectivity.nearestAirport.driveTime})</span>
                  </div>
                )}
                {!connectivity.hasDirectRailway && connectivity.nearestRailway && (
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
                    <span>Nearest Railhead: <strong>{connectivity.nearestRailway.name} ({connectivity.nearestRailway.code})</strong> • {connectivity.nearestRailway.distanceKm} km ({connectivity.nearestRailway.driveTime})</span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Navigation Sub-Tabs Strip */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          borderBottom: "1px solid var(--border-subtle)"
        }}
      >
        {[
          { id: "smart_journey", label: "Overview & Timeline", icon: Sparkles },
          { id: "main_comparison", label: "Main Transport Comparison", icon: Train },
          { id: "first_mile", label: "First-Mile (Home → Terminal)", icon: CarFront },
          { id: "alternatives", label: "Alternative Ways to Reach", icon: GitFork }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: isActive ? "var(--brand-primary, #2563EB)" : "transparent",
                background: isActive ? "var(--brand-primary, #2563EB)" : "transparent",
                color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: isActive ? 800 : 600,
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all var(--transition-fast)"
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeSubTab === "smart_journey" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Main Transport Comparison */}
          <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-2xl)", border: "1.5px solid var(--border-subtle)" }}>
            <MainTransportComparison
              mainOptions={journeyBundle.mainTransport}
              selectedMode={selectedMainMode}
              onSelectMode={(mode) => setSelectedMainMode(mode)}
              selectedOption={selectedMainOption}
              onSelectOption={(opt) => {
                setSelectedMainOption(opt);
                setSelectedMainMode(opt.mode);
                showToast?.(`Selected: ${opt.name} (${opt.tier}) ✨`);
              }}
              fromCity={verifiedRoute.from}
              toDestination={verifiedRoute.to}
              travelDate={travelDate}
              passengers={passengerCount}
            />
          </div>

          {/* First-Mile Comparison */}
          <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-2xl)", border: "1.5px solid var(--border-subtle)" }}>
            <div style={{ marginBottom: "14px" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "2px" }}>
                First-Mile: How to get from {verifiedRoute.from} Home to the Departure Station?
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Compare doorstep-to-station options with estimated fare and duration.
              </p>
            </div>

            <FirstMileComparison
              options={journeyBundle.firstMileOptions}
              selectedOptionId={selectedFirstMile?.id}
              onSelectOption={(opt) => setSelectedFirstMile(opt)}
              originName={`${verifiedRoute.from} Home`}
              terminalName={`${verifiedRoute.from} Terminal`}
            />
          </div>

          {/* Alternative Routes */}
          <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-2xl)", border: "1.5px solid var(--border-subtle)" }}>
            <AlternativeRoutesView
              routes={journeyBundle.alternativeRoutes}
              selectedAlternativeId={selectedAlternativeId}
              onSelectAlternative={(alt) => {
                setSelectedAlternativeId(alt.id);
                showToast?.(`Selected: ${alt.title}`);
              }}
            />
          </div>

          {/* Complete Door-to-Door Journey Timeline & Cost Aggregation */}
          <JourneyTimeline
            fromLocation={`${verifiedRoute.from} Home`}
            toDestination={verifiedRoute.to}
            travelDate={travelDate}
            firstMileChoice={{
              name: selectedFirstMile?.name || "App Cab",
              duration: selectedFirstMile?.timeFormatted || "25 min",
              cost: selectedFirstMile?.estimatedCost || 300
            }}
            mainTransitChoice={{
              name: selectedMainOption
                ? `${selectedMainOption.name} (${selectedMainOption.tier})`
                : (activeMainChoice?.title || "Train (3AC)"),
              duration: selectedMainOption?.duration || activeMainChoice?.durationFormatted || "7h 30m",
              cost: selectedMainOption?.price || activeMainChoice?.priceMin || 650,
              mode: selectedMainOption?.mode || selectedMainMode
            }}
            lastMileChoice={{
              name: "Local Town Transit",
              duration: "25 min",
              cost: 200
            }}
            passengers={passengerCount}
            onBookOrConfirm={() => {
              handleOpenBooking({
                operator: selectedMainOption
                  ? `${selectedMainOption.name} (${selectedMainOption.tier})`
                  : `${activeMainChoice.title} (${verifiedRoute.from} → ${verifiedRoute.to})`,
                from: selectedMainOption?.fromLocation || `${verifiedRoute.from} Departure Hub`,
                to: selectedMainOption?.toLocation || `${verifiedRoute.to} Terminal`,
                price: selectedMainOption?.price || activeMainChoice.priceMin,
                type: selectedMainOption?.mode || activeMainChoice.mode
              });
            }}
          />
        </div>
      )}

      {activeSubTab === "main_comparison" && (
        <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-2xl)", border: "1.5px solid var(--border-subtle)" }}>
          <MainTransportComparison
            mainOptions={journeyBundle.mainTransport}
            selectedMode={selectedMainMode}
            onSelectMode={(mode) => setSelectedMainMode(mode)}
            selectedOption={selectedMainOption}
            onSelectOption={(opt) => {
              setSelectedMainOption(opt);
              setSelectedMainMode(opt.mode);
              showToast?.(`Selected: ${opt.name} (${opt.tier}) ✨`);
            }}
            fromCity={verifiedRoute.from}
            toDestination={verifiedRoute.to}
            travelDate={travelDate}
            passengers={passengerCount}
          />
        </div>
      )}

      {activeSubTab === "first_mile" && (
        <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-2xl)", border: "1.5px solid var(--border-subtle)" }}>
          <FirstMileComparison
            options={journeyBundle.firstMileOptions}
            selectedOptionId={selectedFirstMile?.id}
            onSelectOption={(opt) => setSelectedFirstMile(opt)}
            originName={`${verifiedRoute.from} Home`}
            terminalName={`${verifiedRoute.from} Terminal`}
          />
        </div>
      )}

      {activeSubTab === "alternatives" && (
        <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-2xl)", border: "1.5px solid var(--border-subtle)" }}>
          <AlternativeRoutesView
            routes={journeyBundle.alternativeRoutes}
            selectedAlternativeId={selectedAlternativeId}
            onSelectAlternative={(alt) => {
              setSelectedAlternativeId(alt.id);
              showToast?.(`Selected: ${alt.title}`);
            }}
          />
        </div>
      )}

      {/* Sudden Travel Modal */}
      <SuddenTravelModal
        isOpen={isSuddenModalOpen}
        onClose={() => setIsSuddenModalOpen(false)}
        currentCity={verifiedRoute.from}
        destination={verifiedRoute.to}
        onSelectOption={(opt) => {
          showToast?.(`Instant travel option selected: ${opt.title}`);
        }}
      />

      {/* Booking Modal */}
      {selectedTransport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
          onClick={() => setSelectedTransport(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              background: isDark ? "#0F172A" : "#FFFFFF",
              padding: "30px 26px",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xl)",
              border: "1.5px solid var(--border-subtle)",
              position: "relative"
            }}
          >
            <button
              onClick={() => setSelectedTransport(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "6px"
              }}
            >
              <X size={20} />
            </button>

            {confirmedTicket ? (
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#16A34A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>Ticket Confirmed!</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Your e-ticket reference PNR has been issued for your journey.
                </p>

                <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", padding: "16px", borderRadius: "var(--radius-lg)", width: "100%", textAlign: "left", fontSize: "0.84rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--text-muted)" }}>PNR Number</span>
                    <strong style={{ color: "var(--text-primary)" }}>{confirmedTicket.pnr}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Route</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedTransport.from} → {selectedTransport.to}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#16A34A", fontWeight: 800 }}>
                    <span>Total Fare</span>
                    <span>₹{(selectedTransport.price * passengerCount).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTransport(null)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "none",
                    background: "var(--brand-primary, #2563EB)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", color: "var(--brand-primary, #2563EB)", fontWeight: 800, textTransform: "uppercase" }}>
                    Confirm Transit Booking
                  </span>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>{selectedTransport.operator}</h3>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    {selectedTransport.from} → {selectedTransport.to}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                        color: "var(--text-primary)"
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      Passengers
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                        color: "var(--text-primary)"
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", padding: "14px", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Total Estimated Fare</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#16A34A" }}>
                      ₹{(selectedTransport.price * passengerCount).toLocaleString("en-IN")}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 700 }}>
                    Instant Confirmation ✓
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
                    fontSize: "0.90rem",
                    cursor: "pointer"
                  }}
                >
                  Proceed to Secure Confirmation
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
