import React, { useState, useMemo } from "react";
import {
  Train,
  Bus,
  Plane,
  Car,
  GitFork,
  Sparkles,
  Zap,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  X,
  AlertCircle
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { RouteCard } from "./RouteCard";
import { MultiModalRouteCard } from "./MultiModalRouteCard";
import { getPlaceConnectivity } from "../../data/transitConnectivityHub";

export const TravelSearchResultsView = ({
  searchData,
  onBack,
  onSelectRoute,
  onModifySearch
}) => {
  const { isDark } = useTheme();

  const allRoutes = searchData?.allRoutes || [];
  const meta = searchData?.meta || { from: "Chennai", to: "Goa", travelDate: "2026-08-30", passengers: 1 };
  const recommended = searchData?.recommended;

  const toConnectivity = useMemo(() => {
    return getPlaceConnectivity(meta.to);
  }, [meta.to]);

  // Filters State
  const [selectedMode, setSelectedMode] = useState("all"); // 'all' | 'flight' | 'train' | 'bus' | 'cab' | 'multi_modal'
  const [sortBy, setSortBy] = useState("recommended"); // 'recommended' | 'cheapest' | 'fastest' | 'rating'
  const [maxPrice, setMaxPrice] = useState(25000);
  const [filterAC, setFilterAC] = useState(false);
  const [filterSleeper, setFilterSleeper] = useState(false);
  const [filterDirectOnly, setFilterDirectOnly] = useState(false);
  const [filterTimeSlot, setFilterTimeSlot] = useState("all"); // 'all' | 'morning' | 'afternoon' | 'evening' | 'night'

  // Filter & Sort Logic
  const filteredRoutes = useMemo(() => {
    let list = [...allRoutes];

    // Mode filter
    if (selectedMode !== "all") {
      list = list.filter((r) => r.mode === selectedMode);
    }

    // Price filter
    list = list.filter((r) => (r.price || 0) <= maxPrice);

    // Direct Only
    if (filterDirectOnly) {
      list = list.filter((r) => r.stopsCount === 0 || r.stops?.toLowerCase().includes("non-stop") || r.direct);
    }

    // AC Filter
    if (filterAC) {
      list = list.filter((r) =>
        r.category?.toLowerCase().includes("ac") ||
        r.classes?.some((c) => c.className?.toLowerCase().includes("ac")) ||
        r.mode === "flight" ||
        r.mode === "cab"
      );
    }

    // Sleeper Filter
    if (filterSleeper) {
      list = list.filter((r) =>
        r.category?.toLowerCase().includes("sleeper") ||
        r.classes?.some((c) => c.className?.toLowerCase().includes("sleeper"))
      );
    }

    // Time Slot Filter
    if (filterTimeSlot !== "all") {
      list = list.filter((r) => {
        const time = r.departureTime || "";
        const isPM = time.includes("PM");
        const parts = time.match(/(\d+):/);
        let hour = parts ? parseInt(parts[1], 10) : 6;
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

        if (filterTimeSlot === "morning") return hour >= 5 && hour < 12;
        if (filterTimeSlot === "afternoon") return hour >= 12 && hour < 17;
        if (filterTimeSlot === "evening") return hour >= 17 && hour < 21;
        if (filterTimeSlot === "night") return hour >= 21 || hour < 5;
        return true;
      });
    }

    // Sorting
    switch (sortBy) {
      case "cheapest":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "fastest":
        list.sort((a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "recommended":
      default:
        // Score based ranking
        list.sort((a, b) => {
          const scoreA = (a.rating || 4.5) * 20 - (a.durationMinutes || 300) * 0.05 - (a.price || 1000) * 0.005;
          const scoreB = (b.rating || 4.5) * 20 - (b.durationMinutes || 300) * 0.05 - (b.price || 1000) * 0.005;
          return scoreB - scoreA;
        });
        break;
    }

    return list;
  }, [allRoutes, selectedMode, sortBy, maxPrice, filterAC, filterSleeper, filterDirectOnly, filterTimeSlot]);

  const modeTabs = [
    { id: "all", label: "All Sectors", icon: Sparkles, count: allRoutes.length },
    { id: "train", label: "Trains (IRCTC)", icon: Train, count: searchData?.counts?.trains || 0 },
    { id: "bus", label: "Buses (RTC / Volvo)", icon: Bus, count: searchData?.counts?.buses || 0 },
    { id: "flight", label: "Flights", icon: Plane, count: searchData?.counts?.flights || 0 },
    { id: "cab", label: "Cabs & Taxis", icon: Car, count: searchData?.counts?.cabs || 0 },
    { id: "multi_modal", label: "Multi-Modal Routes", icon: GitFork, count: searchData?.counts?.multiModal || 0 }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "1240px", margin: "0 auto", padding: "16px 20px 80px", width: "100%" }}>
      {/* Top Search Summary & Modify Bar */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-xl, 18px)",
          padding: "18px 24px",
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 29, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)",
          border: "1.5px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-fast)"
            }}
            title="Back to Search"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)" }}>
              <span>{meta.from}</span>
              <span style={{ color: "#2563EB" }}>➔</span>
              <span>{meta.to}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginTop: "2px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={13} /> {meta.travelDate}
              </span>
              <span>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Users size={13} /> {meta.passengers} Traveller{meta.passengers > 1 ? "s" : ""}
              </span>
              <span>•</span>
              <span>~{meta.distanceKm} km Corridor</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onModifySearch}
          style={{
            padding: "8px 18px",
            borderRadius: "var(--radius-full, 9999px)",
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-subtle)",
            color: "var(--brand-primary, #2563EB)",
            fontWeight: 800,
            fontSize: "0.82rem",
            cursor: "pointer"
          }}
        >
          Modify Search
        </button>
      </div>

      {/* End-to-End Door-to-Door Highlights Banner */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-xl, 18px)",
          padding: "16px 22px",
          background: isDark
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)"
            : "linear-gradient(135deg, rgba(239, 246, 255, 0.98) 0%, rgba(245, 243, 255, 0.98) 100%)",
          border: "1.5px solid rgba(37, 99, 235, 0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
              <span>Door-to-Door End-to-End Aggregation Active</span>
            </div>
            <h3 style={{ fontSize: "0.98rem", fontWeight: 900, color: "var(--text-primary)", margin: "2px 0 0" }}>
              Every route below includes Cab from Home + Main Transit + Deboarding Continuation
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "2px 0 0" }}>
              Compare Uber, Ola, Rapido, and BluSmart fares from your doorstep, connect to your departure hub, and ride from deboarding directly to your stay.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: "var(--radius-full, 9999px)", background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF", border: "1px solid var(--border-subtle)", fontWeight: 700, color: "var(--text-primary)" }}>
            🚕 Uber / Ola / Rapido / BluSmart
          </span>
          <span style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: "var(--radius-full, 9999px)", background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF", border: "1px solid var(--border-subtle)", fontWeight: 700, color: "var(--text-primary)" }}>
            🚆 Flights • Trains • Buses • Cabs
          </span>
          <span style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: "var(--radius-full, 9999px)", background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF", border: "1px solid var(--border-subtle)", fontWeight: 700, color: "var(--text-primary)" }}>
            🏨 Prepaid Taxi / Hill Shuttles
          </span>
        </div>
      </div>

      {/* Transit Connectivity Verification & Nearest Hubs Banner (For places without direct airport/railway) */}
      {toConnectivity && (!toConnectivity.hasDirectAirway || !toConnectivity.hasDirectRailway) && (
        <div
          className="glass-card"
          style={{
            borderRadius: "var(--radius-xl, 18px)",
            padding: "20px 24px",
            background: isDark
              ? "linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(37, 99, 235, 0.12) 100%)"
              : "linear-gradient(135deg, rgba(255, 247, 237, 0.98) 0%, rgba(239, 246, 255, 0.98) 100%)",
            border: "1.5px solid rgba(234, 88, 12, 0.4)",
            boxShadow: "0 4px 20px rgba(234, 88, 12, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(234, 88, 12, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#EA580C" }}>
                <Sparkles size={16} />
              </div>
              <div>
                <strong style={{ fontSize: "0.96rem", color: "var(--text-primary)" }}>
                  Verified Connectivity Intelligence: {meta.to}
                </strong>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  {meta.to} is an exotic destination with no direct {!toConnectivity.hasDirectAirway && !toConnectivity.hasDirectRailway ? "airway or mainline railway" : !toConnectivity.hasDirectAirway ? "commercial airway" : "mainline railway"}. We have automatically linked nearest transit hubs with seamless road connections.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", marginTop: "4px" }}>
            {!toConnectivity.hasDirectAirway && toConnectivity.nearestAirport && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg, 12px)",
                  background: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                  border: "1px solid rgba(37, 99, 235, 0.25)"
                }}
              >
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0, marginTop: "2px" }}>
                  <Plane size={14} />
                </div>
                <div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>Nearest Airport</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {toConnectivity.nearestAirport.name} ({toConnectivity.nearestAirport.code})
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    📍 <strong>{toConnectivity.nearestAirport.distanceKm} km</strong> • ~{toConnectivity.nearestAirport.driveTime} via {toConnectivity.nearestAirport.connectingTransport}
                  </div>
                </div>
              </div>
            )}

            {!toConnectivity.hasDirectRailway && toConnectivity.nearestRailway && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-lg, 12px)",
                  background: isDark ? "rgba(22, 163, 74, 0.15)" : "rgba(22, 163, 74, 0.08)",
                  border: "1px solid rgba(22, 163, 74, 0.25)"
                }}
              >
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0, marginTop: "2px" }}>
                  <Train size={14} />
                </div>
                <div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#16A34A", textTransform: "uppercase" }}>Nearest Railhead</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {toConnectivity.nearestRailway.name} ({toConnectivity.nearestRailway.code})
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    📍 <strong>{toConnectivity.nearestRailway.distanceKm} km</strong> • ~{toConnectivity.nearestRailway.driveTime} via {toConnectivity.nearestRailway.connectingTransport}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommended Spotlight Box (if available) */}
      {recommended && selectedMode === "all" && sortBy === "recommended" && (
        <div
          style={{
            borderRadius: "var(--radius-2xl, 22px)",
            padding: "20px 24px",
            background: isDark
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(124, 58, 237, 0.18) 100%)"
              : "linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(243, 232, 255, 0.95) 100%)",
            border: "2px solid rgba(37, 99, 235, 0.4)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 12px",
                borderRadius: "var(--radius-full, 9999px)",
                background: "#2563EB",
                color: "#FFFFFF",
                fontSize: "0.74rem",
                fontWeight: 800
              }}
            >
              <Sparkles size={13} />
              <span>INAVIST SMART RECOMMENDATION</span>
            </span>
            <span style={{ fontSize: "0.80rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              Optimal balance between <strong>Price + Travel Time + Comfort + Rating</strong>
            </span>
          </div>

          {recommended.mode === "multi_modal" ? (
            <MultiModalRouteCard
              route={recommended}
              onViewJourney={onSelectRoute}
              fromCity={meta.from}
              toDestination={meta.to}
              passengers={meta.passengers}
              showEndToEndDefault={true}
            />
          ) : (
            <RouteCard
              route={recommended}
              onViewJourney={onSelectRoute}
              fromCity={meta.from}
              toDestination={meta.to}
              passengers={meta.passengers}
              showEndToEndDefault={true}
            />
          )}
        </div>
      )}

      {/* Mode Selector Tabs Strip */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          scrollbarWidth: "none"
        }}
      >
        {modeTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedMode(tab.id)}
              style={{
                padding: "9px 18px",
                borderRadius: "var(--radius-xl, 14px)",
                border: "1.5px solid",
                borderColor: isSelected ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                background: isSelected
                  ? "var(--brand-primary, #2563EB)"
                  : isDark
                  ? "rgba(255,255,255,0.04)"
                  : "#FFFFFF",
                color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: isSelected ? 800 : 600,
                fontSize: "0.84rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all var(--transition-fast)",
                boxShadow: isSelected ? "0 4px 14px rgba(37, 99, 235, 0.35)" : "none"
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: "0.70rem",
                  fontWeight: 800,
                  padding: "1px 6px",
                  borderRadius: "var(--radius-full, 9999px)",
                  background: isSelected ? "rgba(255,255,255,0.25)" : "var(--bg-tertiary)",
                  color: isSelected ? "#FFFFFF" : "var(--text-muted)"
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Filter & Sorting Strip */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-xl, 16px)",
          padding: "14px 18px",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        {/* Quick Filter Toggle Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
            <Filter size={13} /> Filters:
          </span>

          <button
            type="button"
            onClick={() => setFilterAC(!filterAC)}
            style={{
              padding: "5px 12px",
              borderRadius: "var(--radius-full, 9999px)",
              border: `1px solid ${filterAC ? "#16A34A" : "var(--border-subtle)"}`,
              background: filterAC ? (isDark ? "rgba(22,163,74,0.25)" : "rgba(22,163,74,0.12)") : "transparent",
              color: filterAC ? "#16A34A" : "var(--text-secondary)",
              fontWeight: filterAC ? 800 : 600,
              fontSize: "0.76rem",
              cursor: "pointer"
            }}
          >
            AC Only
          </button>

          <button
            type="button"
            onClick={() => setFilterSleeper(!filterSleeper)}
            style={{
              padding: "5px 12px",
              borderRadius: "var(--radius-full, 9999px)",
              border: `1px solid ${filterSleeper ? "#7C3AED" : "var(--border-subtle)"}`,
              background: filterSleeper ? (isDark ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.12)") : "transparent",
              color: filterSleeper ? "#7C3AED" : "var(--text-secondary)",
              fontWeight: filterSleeper ? 800 : 600,
              fontSize: "0.76rem",
              cursor: "pointer"
            }}
          >
            Sleeper Berths
          </button>

          <button
            type="button"
            onClick={() => setFilterDirectOnly(!filterDirectOnly)}
            style={{
              padding: "5px 12px",
              borderRadius: "var(--radius-full, 9999px)",
              border: `1px solid ${filterDirectOnly ? "#2563EB" : "var(--border-subtle)"}`,
              background: filterDirectOnly ? (isDark ? "rgba(37,99,235,0.25)" : "rgba(37,99,235,0.12)") : "transparent",
              color: filterDirectOnly ? "#2563EB" : "var(--text-secondary)",
              fontWeight: filterDirectOnly ? 800 : 600,
              fontSize: "0.76rem",
              cursor: "pointer"
            }}
          >
            Direct Non-Stop
          </button>

          {/* Time slot filter */}
          <select
            value={filterTimeSlot}
            onChange={(e) => setFilterTimeSlot(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: "var(--radius-md, 8px)",
              border: "1px solid var(--border-subtle)",
              background: isDark ? "#0F172A" : "#F8FAFC",
              color: "var(--text-primary)",
              fontSize: "0.76rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <option value="all">Any Departure Time</option>
            <option value="morning">Morning (5 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
            <option value="evening">Evening (5 PM - 9 PM)</option>
            <option value="night">Night (9 PM - 5 AM)</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
            <ArrowUpDown size={13} /> Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-md, 8px)",
              border: "1px solid var(--border-subtle)",
              background: isDark ? "#0F172A" : "#F8FAFC",
              color: "var(--text-primary)",
              fontSize: "0.80rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <option value="recommended">⭐ Recommended (Best Balance)</option>
            <option value="cheapest">💰 Cheapest First</option>
            <option value="fastest">⚡ Fastest Travel Time</option>
            <option value="rating">🌟 Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Search Results Route List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Showing {filteredRoutes.length} available transport option{filteredRoutes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredRoutes.length === 0 ? (
          <div
            className="glass-card"
            style={{
              borderRadius: "var(--radius-xl, 18px)",
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <AlertCircle size={36} color="var(--text-muted)" />
            <h3 style={{ fontSize: "1.10rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              No routes match the selected filters
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", maxWidth: "420px", margin: 0 }}>
              Try resetting your filters or adjusting your price and departure time preferences.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedMode("all");
                setFilterAC(false);
                setFilterSleeper(false);
                setFilterDirectOnly(false);
                setFilterTimeSlot("all");
              }}
              style={{
                padding: "8px 18px",
                borderRadius: "var(--radius-full, 9999px)",
                background: "var(--brand-primary, #2563EB)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                marginTop: "6px"
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredRoutes.map((route, idx) => {
            if (route.mode === "multi_modal") {
              return (
                <MultiModalRouteCard
                  key={route.id}
                  route={route}
                  onViewJourney={onSelectRoute}
                  fromCity={meta.from}
                  toDestination={meta.to}
                  passengers={meta.passengers}
                  showEndToEndDefault={idx === 0}
                />
              );
            }
            return (
              <RouteCard
                key={route.id}
                route={route}
                onViewJourney={onSelectRoute}
                fromCity={meta.from}
                toDestination={meta.to}
                passengers={meta.passengers}
                showEndToEndDefault={idx === 0}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
