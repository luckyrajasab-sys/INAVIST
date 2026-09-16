import React from "react";
import {
  GitFork,
  ArrowRight,
  Clock,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  Layers,
  Train,
  Bus,
  Car,
  Plane,
  Bike
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const AlternativeRoutesView = ({
  routes = [],
  selectedAlternativeId,
  onSelectAlternative
}) => {
  const { isDark } = useTheme();

  const getLegIcon = (mode) => {
    switch (mode) {
      case "train":
        return <Train size={16} />;
      case "bus":
        return <Bus size={16} />;
      case "cab":
      case "car":
        return <Car size={16} />;
      case "flight":
        return <Plane size={16} />;
      case "bike":
        return <Bike size={16} />;
      default:
        return <Train size={16} />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.80rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
          <GitFork size={15} />
          <span>Smart Multi-Hop Alternatives</span>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "4px"
          }}
        >
          Alternative Ways to Reach
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Smart alternative connections if direct bookings are unavailable, expensive, or slow.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {routes.map((route, index) => {
          const isSelected = selectedAlternativeId === route.id;

          return (
            <div
              key={route.id}
              onClick={() => onSelectAlternative(route)}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                borderRadius: "var(--radius-xl)",
                background: isSelected
                  ? (isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.05)")
                  : "var(--bg-card)",
                border: "1.5px solid",
                borderColor: isSelected
                  ? "var(--brand-primary, #2563EB)"
                  : "var(--border-subtle)",
                boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
            >
              {/* Header: Title + Badge + Total Cost */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: "var(--brand-primary, #2563EB)",
                        color: "#FFFFFF",
                        fontSize: "0.76rem",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {index + 1}
                    </span>
                    <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {route.title}
                    </h4>
                    {route.badge && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "3px 9px",
                          borderRadius: "var(--radius-full)",
                          background: isDark ? "rgba(22, 163, 74, 0.18)" : "rgba(22, 163, 74, 0.12)",
                          color: "#16A34A",
                          border: "1px solid rgba(22, 163, 74, 0.25)"
                        }}
                      >
                        {route.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.80rem", color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={13} />
                      <strong>{route.totalDuration}</strong>
                    </span>
                    <span>•</span>
                    <span>{route.transfers === 0 ? "Direct (0 transfers)" : `${route.transfers} Transfer`}</span>
                    <span>•</span>
                    <span>Difficulty: <strong style={{ color: "var(--text-primary)" }}>{route.difficulty}</strong></span>
                  </div>
                </div>

                {/* Total Cost Badge */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.70rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Est. Total Cost
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#16A34A" }}>
                    {route.costFormatted}
                  </div>
                </div>
              </div>

              {/* Visual Multi-Leg Journey Stepper */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "14px",
                  background: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.02)",
                  borderRadius: "var(--radius-lg)",
                  marginBottom: "14px"
                }}
              >
                {route.legs.map((leg, legIdx) => (
                  <div
                    key={legIdx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      fontSize: "0.84rem",
                      padding: "6px 0",
                      borderBottom: legIdx < route.legs.length - 1 ? "1px dashed var(--border-subtle)" : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "var(--radius-sm)",
                          background: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
                          color: "var(--text-primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {getLegIcon(leg.mode)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                          {leg.from} <ArrowRight size={12} style={{ display: "inline", margin: "0 2px" }} /> {leg.to}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {leg.detail}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>₹{leg.cost}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{leg.duration}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Route Highlights */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                {route.highlights?.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                      padding: "3px 8px",
                      borderRadius: "var(--radius-sm)"
                    }}
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAlternative(route);
                }}
                style={{
                  alignSelf: "flex-end",
                  padding: "8px 18px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? "none" : "1px solid var(--border-subtle)",
                  background: isSelected ? "var(--brand-primary, #2563EB)" : "transparent",
                  color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Selected Alternative</span>
                  </>
                ) : (
                  <span>Select This Route</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
