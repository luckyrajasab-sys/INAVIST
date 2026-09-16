import React, { useState, useMemo } from "react";
import {
  Car,
  CarFront,
  Bike,
  Train,
  Plane,
  Bus,
  Clock,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
  Navigation,
  ArrowRight,
  Luggage,
  Smartphone,
  Sliders,
  Compass,
  Building,
  Home,
  Briefcase
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  getFirstMileAppOptions,
  getPostDeboardingOptions,
  getLocalTransportComparison,
  getHubPresets,
  getPickupPresets,
  calculateDoorstepDuration,
  formatINR
} from "../../data/endToEndTransportData";

export const EndToEndJourneySection = ({
  route,
  fromCity = "Chennai",
  toDestination = "Goa",
  passengers = 1,
  onBookEndToEnd,
  isDefaultExpanded = true
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);
  const [activeTab, setActiveTab] = useState("all_legs"); // 'all_legs' | 'first_mile' | 'local_compare' | 'post_deboard'

  // Determine Hub Type based on route mode
  const mode = route?.mode || "train";
  const hubType = mode === "flight" ? "airport" : mode === "bus" ? "bus" : mode === "cab" ? "generic" : "railway";

  // Hub and Pickup Presets
  const hubPresets = useMemo(() => getHubPresets(fromCity, mode), [fromCity, mode]);
  const arrivalHubPresets = useMemo(() => getHubPresets(toDestination, mode), [toDestination, mode]);
  const pickupPresets = useMemo(() => getPickupPresets(fromCity), [fromCity]);

  // Interactive Pickup & Drop State
  const [selectedPickup, setSelectedPickup] = useState(pickupPresets[0] || "Home Address");
  const [customPickupText, setCustomPickupText] = useState("");
  const [isEditingPickup, setIsEditingPickup] = useState(false);

  const [selectedDepartureHub, setSelectedDepartureHub] = useState(
    route?.fromLocation || hubPresets[0] || `${fromCity} Departure Hub`
  );

  const [selectedArrivalHub, setSelectedArrivalHub] = useState(
    route?.toLocation || arrivalHubPresets[0] || `${toDestination} Arrival Terminal`
  );

  const [selectedDeboardDrop, setSelectedDeboardDrop] = useState("Hotel / Stay Doorstep");
  const [customDeboardDropText, setCustomDeboardDropText] = useState("");
  const [isEditingDeboardDrop, setIsEditingDeboardDrop] = useState(false);

  // Distance configuration (km)
  const [firstMileDistKm, setFirstMileDistKm] = useState(hubType === "airport" ? 22 : 12);
  const [lastMileDistKm, setLastMileDistKm] = useState(hubType === "airport" ? 25 : 10);

  // Selected First-Mile App
  const [selectedAppId, setSelectedAppId] = useState("app-uber");
  // Selected Local Transport Mode from Comparison
  const [selectedLocalModeId, setSelectedLocalModeId] = useState("local-cab-hatch");
  // Selected Post-Deboarding Option
  const [selectedDeboardId, setSelectedDeboardId] = useState("post-prepaid-taxi");

  // Dynamic Options based on Distance
  const firstMileApps = useMemo(() => {
    return getFirstMileAppOptions(fromCity, hubType, firstMileDistKm);
  }, [fromCity, hubType, firstMileDistKm]);

  const localTransportOptions = useMemo(() => {
    return getLocalTransportComparison(
      isEditingPickup && customPickupText ? customPickupText : selectedPickup,
      selectedDepartureHub,
      firstMileDistKm
    );
  }, [selectedPickup, customPickupText, isEditingPickup, selectedDepartureHub, firstMileDistKm]);

  const postDeboardOptions = useMemo(() => {
    return getPostDeboardingOptions(toDestination, hubType);
  }, [toDestination, hubType]);

  const selectedFirstMileApp = firstMileApps.find((a) => a.id === selectedAppId) || firstMileApps[0];
  const selectedLocalMode = localTransportOptions.find((l) => l.id === selectedLocalModeId) || localTransportOptions[0];
  const selectedDeboardOption = postDeboardOptions.find((d) => d.id === selectedDeboardId) || postDeboardOptions[0];

  // Pricing calculations
  const mainTransitPrice = (route?.price || 650) * passengers;
  const firstMilePrice = selectedFirstMileApp?.price || 220;
  const deboardPrice = selectedDeboardOption?.price || 350;
  const totalCombinedCost = firstMilePrice + mainTransitPrice + deboardPrice;

  const totalDoorstepDuration = calculateDoorstepDuration(
    selectedFirstMileApp?.estimatedDurationMinutes || 25,
    route?.durationMinutes || 360,
    selectedDeboardOption?.durationMinutes || 30,
    hubType === "airport" ? 90 : 30
  );

  const getModeInfo = (m) => {
    switch (m) {
      case "flight":
        return {
          icon: Plane,
          label: "Flight",
          badge: "AIRPORT EXPRESS",
          hubLabel: "Airport Terminal",
          color: "#2563EB"
        };
      case "train":
        return {
          icon: Train,
          label: "Railway Express",
          badge: "IRCTC MAINLINE",
          hubLabel: "Railway Station",
          color: "#7C3AED"
        };
      case "bus":
        return {
          icon: Bus,
          label: "Intercity Bus",
          badge: "BUS STAND / TERMINAL",
          hubLabel: "Bus Stand / ISBT",
          color: "#059669"
        };
      case "cab":
        return {
          icon: Car,
          label: "Outstation Cab",
          badge: "HIGHWAY DOORSTEP",
          hubLabel: "Doorstep / Highway Pickup",
          color: "#D97706"
        };
      default:
        return {
          icon: Train,
          label: "Transit",
          badge: "TRANSIT HUB",
          hubLabel: "Station",
          color: "#2563EB"
        };
    }
  };

  const currentModeInfo = getModeInfo(mode);
  const ModeIcon = currentModeInfo.icon;

  const activePickupName = isEditingPickup && customPickupText ? customPickupText : selectedPickup;
  const activeDeboardDropName = isEditingDeboardDrop && customDeboardDropText ? customDeboardDropText : selectedDeboardDrop;

  return (
    <div
      style={{
        borderRadius: "var(--radius-xl, 16px)",
        border: "1.5px solid rgba(37, 99, 235, 0.35)",
        background: isDark
          ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.55) 100%)"
          : "linear-gradient(135deg, rgba(239, 246, 255, 0.98) 0%, rgba(245, 243, 255, 0.98) 100%)",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginTop: "10px"
      }}
    >
      {/* Top Banner: End-to-End Badge & Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              color: "#FFFFFF",
              fontSize: "0.72rem",
              fontWeight: 800,
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.35)"
            }}
          >
            <Sparkles size={12} />
            <span>DOOR-TO-DOOR END-TO-END TRIP</span>
          </div>

          <span
            style={{
              fontSize: "0.68rem",
              padding: "2px 8px",
              borderRadius: "var(--radius-full, 9999px)",
              background: `${currentModeInfo.color}18`,
              color: currentModeInfo.color,
              fontWeight: 800,
              border: `1px solid ${currentModeInfo.color}40`
            }}
          >
            {currentModeInfo.badge}
          </span>

          <span style={{ fontSize: "0.80rem", color: "var(--text-secondary)", fontWeight: 700 }}>
            {activePickupName} ➔ {selectedDepartureHub} ➔ {route?.operator || route?.name} ➔ {activeDeboardDropName}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--brand-primary, #2563EB)",
            fontWeight: 800,
            fontSize: "0.78rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <span>{isExpanded ? "Hide Doorstep Options" : "Show Full End-to-End & Compare (Cab + Deboard)"}</span>
          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>

      {/* Quick Summary Pill Strip (Always Visible) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "10px",
          padding: "10px 14px",
          borderRadius: "var(--radius-lg, 12px)",
          background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF",
          border: "1px solid var(--border-subtle)"
        }}
      >
        {/* First-Mile Summary */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(37, 99, 235, 0.15)", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Car size={14} />
          </div>
          <div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>1. Home Pickup</div>
            <div style={{ fontSize: "0.80rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {selectedFirstMileApp?.appName} • <span style={{ color: "#16A34A" }}>₹{selectedFirstMileApp?.price}</span> ({selectedFirstMileApp?.durationFormatted})
            </div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
              To {selectedDepartureHub}
            </div>
          </div>
        </div>

        {/* Main Transit Summary */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${currentModeInfo.color}1A`, color: currentModeInfo.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ModeIcon size={14} />
          </div>
          <div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              2. Main ({currentModeInfo.label})
            </div>
            <div style={{ fontSize: "0.80rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {route?.operator || route?.name} • <span style={{ color: "#16A34A" }}>₹{mainTransitPrice}</span>
            </div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>
              {route?.duration || "6h 30m"} • {passengers} Pax
            </div>
          </div>
        </div>

        {/* Post-Deboarding Summary */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(234, 88, 12, 0.15)", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Navigation size={14} />
          </div>
          <div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>3. After Deboard</div>
            <div style={{ fontSize: "0.80rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {selectedDeboardOption?.name} • <span style={{ color: "#16A34A" }}>₹{selectedDeboardOption?.price}</span>
            </div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
              To {activeDeboardDropName}
            </div>
          </div>
        </div>

        {/* All-Inclusive Total */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "8px", borderLeft: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}>
          <div>
            <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Doorstep</div>
            <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#16A34A" }}>
              {formatINR(totalCombinedCost)}
            </div>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>⏱ {totalDoorstepDuration}</span>
        </div>
      </div>

      {/* Expanded Interactive Customizer & Local Transport Comparison */}
      {isExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "6px" }}>
          {/* Sub Tabs */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px", flexWrap: "wrap" }}>
            {[
              { id: "all_legs", label: "🗺️ All 3 Legs Overview" },
              { id: "first_mile", label: "🚕 First-Mile: Cab from Home" },
              { id: "local_compare", label: "📊 Local Transport Price Comparison" },
              { id: "post_deboard", label: "🏨 Last-Mile: After Deboarding" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full, 9999px)",
                  background: activeTab === tab.id ? "var(--brand-primary, #2563EB)" : "transparent",
                  color: activeTab === tab.id ? "#FFFFFF" : "var(--text-secondary)",
                  border: "none",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* INTERACTIVE PICKUP & DROP LOCATION SELECTOR BAR */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-lg, 12px)",
              background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.80rem", fontWeight: 800, color: "var(--text-primary)" }}>
                <MapPin size={15} color="#2563EB" />
                <span>Customize Pickup & Drop Points for Accurate Fares</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.74rem", color: "var(--text-muted)" }}>
                <span>City Distance:</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[6, 12, 18, 25].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setFirstMileDistKm(km)}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        border: `1px solid ${firstMileDistKm === km ? "#2563EB" : "var(--border-subtle)"}`,
                        background: firstMileDistKm === km ? "#2563EB" : "transparent",
                        color: firstMileDistKm === km ? "#FFFFFF" : "var(--text-primary)",
                        fontSize: "0.70rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
              {/* Leg 1 Pickup Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  🏠 Leg 1: Pickup Location ({fromCity})
                </label>
                {isEditingPickup ? (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <input
                      type="text"
                      value={customPickupText}
                      onChange={(e) => setCustomPickupText(e.target.value)}
                      placeholder="Enter street / colony / apartment..."
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #2563EB",
                        background: isDark ? "rgba(0,0,0,0.5)" : "#FFFFFF",
                        color: "var(--text-primary)",
                        fontSize: "0.78rem"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingPickup(false)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        background: "#2563EB",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <select
                      value={selectedPickup}
                      onChange={(e) => {
                        if (e.target.value === "Custom Address") {
                          setIsEditingPickup(true);
                        } else {
                          setSelectedPickup(e.target.value);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.5)" : "#F8FAFC",
                        color: "var(--text-primary)",
                        fontSize: "0.78rem",
                        fontWeight: 600
                      }}
                    >
                      {pickupPresets.map((preset) => (
                        <option key={preset} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsEditingPickup(true)}
                      title="Type exact custom address"
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle)",
                        background: "transparent",
                        color: "#2563EB",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Leg 1 Departure Hub Drop Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  📍 Leg 1 Drop: Departure {currentModeInfo.hubLabel}
                </label>
                <select
                  value={selectedDepartureHub}
                  onChange={(e) => setSelectedDepartureHub(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.5)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.78rem",
                    fontWeight: 600
                  }}
                >
                  {hubPresets.map((hub) => (
                    <option key={hub} value={hub}>
                      {hub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Leg 3 Deboarding Drop Location Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  🏨 Leg 3 Drop: Final Stay / Spot in {toDestination}
                </label>
                {isEditingDeboardDrop ? (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <input
                      type="text"
                      value={customDeboardDropText}
                      onChange={(e) => setCustomDeboardDropText(e.target.value)}
                      placeholder="Resort name, villa or street..."
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #EA580C",
                        background: isDark ? "rgba(0,0,0,0.5)" : "#FFFFFF",
                        color: "var(--text-primary)",
                        fontSize: "0.78rem"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingDeboardDrop(false)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        background: "#EA580C",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <select
                      value={selectedDeboardDrop}
                      onChange={(e) => {
                        if (e.target.value === "Custom Address") {
                          setIsEditingDeboardDrop(true);
                        } else {
                          setSelectedDeboardDrop(e.target.value);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.5)" : "#F8FAFC",
                        color: "var(--text-primary)",
                        fontSize: "0.78rem",
                        fontWeight: 600
                      }}
                    >
                      <option value="Hotel / Stay Doorstep">Hotel / Stay Doorstep</option>
                      <option value="City Center / Market">City Center / Market Area</option>
                      <option value="Beach Resort / Coastal Stay">Beach Resort / Coastal Stay</option>
                      <option value="Hilltop Homestay / Airbnb">Hilltop Homestay / Airbnb</option>
                      <option value="Custom Address">Enter Custom Hotel/Address...</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsEditingDeboardDrop(true)}
                      title="Type exact stay location"
                      style={{
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-subtle)",
                        background: "transparent",
                        color: "#EA580C",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TAB 1 & 2: FIRST-MILE CAB APPS (UBER, OLA, RAPIDO, BLUSMART) */}
          {(activeTab === "all_legs" || activeTab === "first_mile") && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.95rem" }}>🚕</span>
                  <strong style={{ fontSize: "0.86rem", color: "var(--text-primary)" }}>
                    Leg 1: Cab from {activePickupName} to {selectedDepartureHub}
                  </strong>
                </div>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  Compare ride-hailing apps & live fares ({firstMileDistKm} km)
                </span>
              </div>

              {/* Ride Apps Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "10px"
                }}
              >
                {firstMileApps.map((app) => {
                  const isSelected = selectedAppId === app.id;
                  const Icon = app.iconType === "bike" ? Bike : app.iconType === "train" ? Train : Car;

                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-lg, 12px)",
                        background: isSelected
                          ? isDark
                            ? "rgba(37, 99, 235, 0.22)"
                            : "rgba(37, 99, 235, 0.08)"
                          : isDark
                          ? "rgba(255, 255, 255, 0.03)"
                          : "#FFFFFF",
                        border: `1.5px solid ${isSelected ? "#2563EB" : "var(--border-subtle)"}`,
                        boxShadow: isSelected ? "0 4px 14px rgba(37, 99, 235, 0.2)" : "none",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "8px",
                        position: "relative",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      {/* Top Header: App Name + Tag */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "6px",
                              background: isSelected ? "#2563EB" : "var(--bg-tertiary)",
                              color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Icon size={15} />
                          </div>
                          <div>
                            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-primary)" }}>
                              {app.appName}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                              {app.category}
                            </div>
                          </div>
                        </div>

                        {app.tag && (
                          <span
                            style={{
                              fontSize: "0.64rem",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "var(--radius-full, 9999px)",
                              background: "rgba(37, 99, 235, 0.12)",
                              color: app.tagColor || "#2563EB",
                              letterSpacing: "0.02em"
                            }}
                          >
                            {app.tag}
                          </span>
                        )}
                      </div>

                      {/* Pricing & Travel Time Specs */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.64rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Est. Fare</div>
                          <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#16A34A" }}>
                            ₹{app.price}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.64rem", color: "var(--text-muted)", textTransform: "uppercase" }}>ETA / Duration</div>
                          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "3px" }}>
                            <Clock size={11} />
                            <span>{app.durationFormatted}</span>
                          </div>
                          <span style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>{app.pickupWaitFormatted}</span>
                        </div>
                      </div>

                      {/* Select / Active State */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAppId(app.id);
                        }}
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "6px",
                          border: isSelected ? "none" : "1px solid var(--border-subtle)",
                          background: isSelected ? "#2563EB" : "transparent",
                          color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          transition: "all var(--transition-fast)"
                        }}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Selected for Trip</span>
                          </>
                        ) : (
                          <span>Select {app.appName}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: LOCAL TRANSPORT PRICE COMPARISON MATRIX */}
          {(activeTab === "all_legs" || activeTab === "local_compare") && (
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--radius-lg, 12px)",
                background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF",
                border: "1.5px solid rgba(16, 185, 129, 0.35)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sliders size={16} />
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.90rem", color: "var(--text-primary)" }}>
                      Local Transport Price & Mode Comparison
                    </strong>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                      Side-by-side fares from {activePickupName} to {selectedDepartureHub} ({firstMileDistKm} km)
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "#10B981", fontWeight: 800 }}>
                  <ShieldCheck size={14} />
                  <span>Real-time local rate estimator</span>
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "10px"
                }}
              >
                {localTransportOptions.map((local) => {
                  const isSelected = selectedLocalModeId === local.id;
                  const Icon = local.iconType === "bike" ? Bike : local.iconType === "auto" ? CarFront : local.iconType === "train" ? Train : Car;

                  return (
                    <div
                      key={local.id}
                      onClick={() => {
                        setSelectedLocalModeId(local.id);
                        if (local.mode === "bike") setSelectedAppId("app-rapido");
                        else if (local.mode === "transit") setSelectedAppId("app-metro-feeder");
                        else if (local.mode === "sedan") setSelectedAppId("app-blusmart");
                        else if (local.mode === "cab") setSelectedAppId("app-uber");
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "var(--radius-lg, 12px)",
                        border: `1.5px solid ${isSelected ? "#10B981" : "var(--border-subtle)"}`,
                        background: isSelected
                          ? isDark
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(16, 185, 129, 0.08)"
                          : isDark
                          ? "rgba(255, 255, 255, 0.02)"
                          : "#F8FAFC",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "8px",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: isSelected ? "#10B981" : "var(--bg-tertiary)", color: isSelected ? "#FFFFFF" : "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)" }}>
                              {local.name}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                              {local.capacity} • {local.luggage}
                            </div>
                          </div>
                        </div>

                        {local.badge && (
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "var(--radius-full, 9999px)",
                              background: `${local.badgeColor}1A`,
                              color: local.badgeColor,
                              border: `1px solid ${local.badgeColor}40`
                            }}
                          >
                            {local.badge}
                          </span>
                        )}
                      </div>

                      {/* Specs */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 8px", borderRadius: "6px", background: isDark ? "rgba(0,0,0,0.2)" : "#FFFFFF" }}>
                        <div>
                          <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Fare</div>
                          <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#16A34A" }}>
                            ₹{local.price}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Travel Time</div>
                          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)" }}>
                            ⏱ {local.etaFormatted}
                          </div>
                          <div style={{ fontSize: "0.64rem", color: "var(--text-muted)" }}>{local.waitFormatted}</div>
                        </div>
                      </div>

                      {/* Pros & best for */}
                      <div style={{ fontSize: "0.70rem", color: "var(--text-secondary)" }}>
                        <strong>Best For:</strong> {local.bestFor}
                      </div>

                      <button
                        type="button"
                        style={{
                          width: "100%",
                          padding: "5px",
                          borderRadius: "6px",
                          border: isSelected ? "none" : "1px solid var(--border-subtle)",
                          background: isSelected ? "#10B981" : "transparent",
                          color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px"
                        }}
                      >
                        {isSelected ? <CheckCircle2 size={12} /> : null}
                        <span>{isSelected ? "Selected Mode" : "Choose This Mode"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. MAIN INTERCITY TRANSIT CONNECTOR (TRAIN / BUS / FLIGHT / CAB) */}
          {activeTab === "all_legs" && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "var(--radius-lg, 12px)",
                background: `${currentModeInfo.color}10`,
                border: `1.5px solid ${currentModeInfo.color}35`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: currentModeInfo.color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ModeIcon size={18} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", color: currentModeInfo.color }}>
                      Leg 2: Main Transit ({currentModeInfo.label})
                    </span>
                    <span style={{ fontSize: "0.64rem", padding: "1px 6px", borderRadius: "4px", background: `${currentModeInfo.color}20`, color: currentModeInfo.color, fontWeight: 700 }}>
                      {route?.category || "Standard Coach"}
                    </span>
                  </div>
                  <strong style={{ fontSize: "0.96rem", color: "var(--text-primary)" }}>
                    {route?.operator || route?.name}
                  </strong>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                    {selectedDepartureHub} ({route?.departureTime || "06:30 AM"}) ➔ {selectedArrivalHub} ({route?.arrivalTime || "01:45 PM"})
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-primary)" }}>
                  {formatINR(mainTransitPrice)}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {route?.duration || "6h 30m"} • {passengers} Pax
                </div>
              </div>
            </div>
          )}

          {/* 3. POST-DEBOARDING: CONTINUATION TO HOTEL / TOURIST SPOTS */}
          {(activeTab === "all_legs" || activeTab === "post_deboard") && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.95rem" }}>🏨</span>
                  <strong style={{ fontSize: "0.86rem", color: "var(--text-primary)" }}>
                    Leg 3: Deboarding at {selectedArrivalHub} ➔ {activeDeboardDropName}
                  </strong>
                </div>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  Prepaid counters, app bays, hill shuttles & scooter rentals
                </span>
              </div>

              {/* Deboarding Options Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "10px"
                }}
              >
                {postDeboardOptions.map((opt) => {
                  const isSelected = selectedDeboardId === opt.id;
                  const Icon = opt.iconType === "bike" ? Bike : opt.iconType === "jeep" ? CarFront : Car;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedDeboardId(opt.id)}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-lg, 12px)",
                        background: isSelected
                          ? isDark
                            ? "rgba(234, 88, 12, 0.22)"
                            : "rgba(234, 88, 12, 0.08)"
                          : isDark
                          ? "rgba(255, 255, 255, 0.03)"
                          : "#FFFFFF",
                        border: `1.5px solid ${isSelected ? "#EA580C" : "var(--border-subtle)"}`,
                        boxShadow: isSelected ? "0 4px 14px rgba(234, 88, 12, 0.2)" : "none",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "8px",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      {/* Top Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "6px",
                              background: isSelected ? "#EA580C" : "var(--bg-tertiary)",
                              color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Icon size={15} />
                          </div>
                          <div>
                            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary)" }}>
                              {opt.name}
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                              {opt.durationFormatted}
                            </div>
                          </div>
                        </div>

                        {opt.badge && (
                          <span
                            style={{
                              fontSize: "0.62rem",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "var(--radius-full, 9999px)",
                              background: "rgba(234, 88, 12, 0.12)",
                              color: opt.badgeColor || "#EA580C"
                            }}
                          >
                            {opt.badge}
                          </span>
                        )}
                      </div>

                      {/* Pricing & Boarding tip */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.64rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Est. Fare</div>
                          <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "#16A34A" }}>
                            {opt.priceFormatted}
                          </div>
                        </div>

                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textAlign: "right", maxWidth: "110px" }}>
                          {opt.howToBoard}
                        </div>
                      </div>

                      {/* Selection button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDeboardId(opt.id);
                        }}
                        style={{
                          width: "100%",
                          padding: "6px",
                          borderRadius: "6px",
                          border: isSelected ? "none" : "1px solid var(--border-subtle)",
                          background: isSelected ? "#EA580C" : "transparent",
                          color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          transition: "all var(--transition-fast)"
                        }}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Deboarding Selected</span>
                          </>
                        ) : (
                          <span>Select Option</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Strip: Combined End-to-End Booking */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              paddingTop: "8px",
              borderTop: "1px solid var(--border-subtle)"
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Combined 3-Leg Doorstep Price ({passengers} Pax)
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "#16A34A" }}>
                  {formatINR(totalCombinedCost)}
                </span>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                  (₹{firstMilePrice} {selectedFirstMileApp?.appName} + ₹{mainTransitPrice} {currentModeInfo.label} + ₹{deboardPrice} {selectedDeboardOption?.name})
                </span>
              </div>
            </div>

            {onBookEndToEnd && (
              <button
                type="button"
                onClick={() =>
                  onBookEndToEnd({
                    ...route,
                    pickupLocation: activePickupName,
                    departureHub: selectedDepartureHub,
                    arrivalHub: selectedArrivalHub,
                    deboardDropLocation: activeDeboardDropName,
                    firstMileSelection: selectedFirstMileApp,
                    localTransportSelection: selectedLocalMode,
                    deboardSelection: selectedDeboardOption,
                    totalCombinedCost,
                    totalDoorstepDuration
                  })
                }
                style={{
                  padding: "9px 20px",
                  borderRadius: "var(--radius-lg, 12px)",
                  background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: "0.84rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                  transition: "all var(--transition-fast)"
                }}
              >
                <span>Book Complete Doorstep Journey</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
