import React, { useState } from "react";
import {
  MapPin,
  Home,
  Navigation,
  Clock,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Train,
  Bus,
  Car,
  Plane,
  Bike
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const JourneyTimeline = ({
  fromLocation = "Chennai Home",
  toDestination = "Kodaikanal",
  travelDate = new Date().toISOString().split("T")[0],
  firstMileChoice = { name: "Cab", duration: "25 min", cost: 300 },
  mainTransitChoice = { name: "Train (3AC)", duration: "7h 30m", cost: 650 },
  lastMileChoice = { name: "Local Bus / Cab", duration: "2h 30m", cost: 250 },
  curatedRoutes = [],
  passengers = 1,
  onBookOrConfirm,
  onSelectCuratedRoute
}) => {
  const { isDark } = useTheme();
  const [selectedRouteTab, setSelectedRouteTab] = useState(null);

  const totalCost =
    (firstMileChoice?.cost || 0) +
    ((mainTransitChoice?.cost || 0) * passengers) +
    (lastMileChoice?.cost || 0);

  const getModeIcon = (mode) => {
    switch (mode) {
      case "train":
        return <Train size={15} />;
      case "bus":
        return <Bus size={15} />;
      case "cab":
      case "car":
        return <Car size={15} />;
      case "flight":
        return <Plane size={15} />;
      case "bike":
        return <Bike size={15} />;
      default:
        return <Car size={15} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Curated Route Options (Separate Multi-Route Comparison) */}
      {curatedRoutes && curatedRoutes.length > 0 && (
        <div
          className="glass-card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "24px",
            borderRadius: "var(--radius-2xl)",
            border: "1.5px solid var(--border-subtle)",
            background: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF"
          }}
        >
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
              <Layers size={14} />
              <span>Multiple Route Options</span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.30rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginBottom: "2px"
              }}
            >
              Choose Your Complete Route Strategy
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
              Compare full combinations from <strong style={{ color: "var(--text-primary)" }}>{fromLocation}</strong> to <strong style={{ color: "var(--text-primary)" }}>{toDestination}</strong>
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "14px"
            }}
          >
            {curatedRoutes.map((route) => {
              const isSelected = selectedRouteTab === route.id;

              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteTab(route.id);
                    if (onSelectCuratedRoute) {
                      onSelectCuratedRoute(route);
                    }
                  }}
                  style={{
                    padding: "18px",
                    borderRadius: "var(--radius-xl)",
                    background: isSelected
                      ? (isDark ? "rgba(37, 99, 235, 0.14)" : "rgba(37, 99, 235, 0.05)")
                      : (isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC"),
                    border: "2px solid",
                    borderColor: isSelected
                      ? "var(--brand-primary, #2563EB)"
                      : "var(--border-subtle)",
                    boxShadow: isSelected ? "var(--shadow-md)" : "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "3px 9px",
                          borderRadius: "var(--radius-full)",
                          background: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
                          color: route.badgeColor || "var(--brand-primary, #2563EB)",
                          border: "1px solid var(--border-subtle)"
                        }}
                      >
                        {route.badge}
                      </span>
                      <strong style={{ fontSize: "1.15rem", fontWeight: 900, color: "#16A34A" }}>
                        {route.costFormatted}
                      </strong>
                    </div>

                    <h4 style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                      {route.title}
                    </h4>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: "8px" }}>
                      {route.summary}
                    </div>
                  </div>

                  {/* Route Specs */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.74rem",
                      color: "var(--text-muted)",
                      paddingTop: "8px",
                      borderTop: "1px solid var(--border-subtle)"
                    }}
                  >
                    <span>⏱ {route.totalDuration}</span>
                    <span>{route.transfers === 0 ? "Direct (0 transfers)" : `${route.transfers} Transfer`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Visual Timeline & Live Cost Breakdown */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "26px",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--border-subtle)",
          background: isDark ? "rgba(15, 23, 42, 0.7)" : "#FFFFFF",
          boxShadow: "var(--shadow-md)"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase" }}>
              <Sparkles size={14} />
              <span>Door-to-Door Visual Timeline</span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.32rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginTop: "2px"
              }}
            >
              Complete Journey Timeline & Total Cost
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <Calendar size={14} />
            <span>{new Date(travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span>•</span>
            <span>{passengers} Traveller{passengers > 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Visual Timeline Stepper */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            position: "relative",
            paddingLeft: "16px",
            borderLeft: "2.5px solid var(--brand-primary, #2563EB)",
            marginLeft: "10px",
            marginTop: "6px"
          }}
        >
          {/* Step 1: Start Location (Home) */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "-25px",
                top: "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#2563EB",
                border: "3px solid #FFFFFF",
                boxShadow: "0 0 0 2px #2563EB"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Starting Point</span>
                <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-primary)" }}>{fromLocation}</div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Doorstep Departure</div>
            </div>
          </div>

          {/* First-Mile Leg */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              background: isDark ? "rgba(37, 99, 235, 0.10)" : "rgba(37, 99, 235, 0.05)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem"
            }}
          >
            <div>
              <span style={{ fontWeight: 800, color: "var(--brand-primary, #2563EB)" }}>First-Mile (Home → Terminal): </span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{firstMileChoice?.name}</span>
            </div>
            <div style={{ display: "flex", gap: "14px", fontWeight: 800 }}>
              <span style={{ color: "var(--text-muted)" }}>⏱ {firstMileChoice?.duration || "25 min"}</span>
              <span style={{ color: "#16A34A" }}>₹{firstMileChoice?.cost}</span>
            </div>
          </div>

          {/* Step 2: Departure Terminal Hub */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "-25px",
                top: "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#7C3AED",
                border: "3px solid #FFFFFF",
                boxShadow: "0 0 0 2px #7C3AED"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Departure Terminal</span>
                <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-primary)" }}>Origin Station / Airport / Bus Hub</div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Boarding & Security</div>
            </div>
          </div>

          {/* Main Intercity Transit Leg */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              background: isDark ? "rgba(124, 58, 237, 0.10)" : "rgba(124, 58, 237, 0.05)",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem"
            }}
          >
            <div>
              <span style={{ fontWeight: 800, color: "#7C3AED" }}>Main Transit Leg: </span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{mainTransitChoice?.name}</span>
            </div>
            <div style={{ display: "flex", gap: "14px", fontWeight: 800 }}>
              <span style={{ color: "var(--text-muted)" }}>⏱ {mainTransitChoice?.duration || "7h 30m"}</span>
              <span style={{ color: "#16A34A" }}>₹{(mainTransitChoice?.cost || 0) * passengers} ({passengers}p)</span>
            </div>
          </div>

          {/* Step 3: Destination Arrival Hub */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "-25px",
                top: "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#EA580C",
                border: "3px solid #FFFFFF",
                boxShadow: "0 0 0 2px #EA580C"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Arrival Hub</span>
                <div style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-primary)" }}>Destination Terminal / Junction</div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Deboarding & Exit</div>
            </div>
          </div>

          {/* Last-Mile Transit Leg */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              background: isDark ? "rgba(234, 88, 12, 0.10)" : "rgba(234, 88, 12, 0.05)",
              border: "1px solid rgba(234, 88, 12, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem"
            }}
          >
            <div>
              <span style={{ fontWeight: 800, color: "#EA580C" }}>Last-Mile (Station → Hotel / Spot): </span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{lastMileChoice?.name}</span>
            </div>
            <div style={{ display: "flex", gap: "14px", fontWeight: 800 }}>
              <span style={{ color: "var(--text-muted)" }}>⏱ {lastMileChoice?.duration || "30 min"}</span>
              <span style={{ color: "#16A34A" }}>₹{lastMileChoice?.cost}</span>
            </div>
          </div>

          {/* Step 4: Final Destination Doorstep */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "-25px",
                top: "2px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#16A34A",
                border: "3px solid #FFFFFF",
                boxShadow: "0 0 0 2px #16A34A"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#16A34A", textTransform: "uppercase", fontWeight: 800 }}>Final Destination Reached</span>
                <div style={{ fontSize: "1.10rem", fontWeight: 900, color: "var(--text-primary)" }}>{toDestination}</div>
              </div>
              <span style={{ fontSize: "0.80rem", color: "#16A34A", fontWeight: 800 }}>✓ Doorstep Arrival</span>
            </div>
          </div>
        </div>

        {/* Complete Estimated Total Cost Breakdown Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            padding: "18px 22px",
            borderRadius: "var(--radius-xl)",
            background: isDark ? "rgba(0,0,0,0.4)" : "#F8FAFC",
            border: "1.5px solid var(--border-subtle)"
          }}
        >
          <div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 }}>
              Estimated Total Cost (Door-to-Door)
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "2px" }}>
              <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "#16A34A" }}>
                ₹{totalCost.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                (₹{firstMileChoice?.cost} First-Mile + ₹{(mainTransitChoice?.cost || 0) * passengers} Main + ₹{lastMileChoice?.cost} Last-Mile)
              </span>
            </div>
          </div>

          {onBookOrConfirm && (
            <button
              type="button"
              onClick={onBookOrConfirm}
              style={{
                padding: "13px 28px",
                borderRadius: "var(--radius-xl)",
                border: "none",
                background: "var(--brand-primary, #2563EB)",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
                transition: "all var(--transition-fast)"
              }}
            >
              <span>Proceed with Journey Plan</span>
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
