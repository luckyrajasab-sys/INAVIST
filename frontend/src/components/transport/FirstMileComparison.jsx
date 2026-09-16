import React from "react";
import {
  Bike,
  Car,
  CarFront,
  Bus,
  Train,
  Clock,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ThumbsUp
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const FirstMileComparison = ({
  options = [],
  selectedOptionId,
  onSelectOption,
  originName = "Home",
  terminalName = "Railway Station / Airport"
}) => {
  const { isDark } = useTheme();

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Bike":
        return <Bike size={20} />;
      case "CarFront":
        return <CarFront size={20} />;
      case "Car":
        return <Car size={20} />;
      case "Bus":
        return <Bus size={20} />;
      case "Train":
        return <Train size={20} />;
      default:
        return <Car size={20} />;
    }
  };

  const getBadgeStyle = (badge) => {
    if (!badge) return null;
    if (badge.includes("Recommended")) {
      return { bg: "rgba(37, 99, 235, 0.12)", color: "#2563EB", border: "rgba(37, 99, 235, 0.25)" };
    }
    if (badge.includes("Cheapest")) {
      return { bg: "rgba(22, 163, 74, 0.12)", color: "#16A34A", border: "rgba(22, 163, 74, 0.25)" };
    }
    if (badge.includes("Fastest")) {
      return { bg: "rgba(234, 88, 12, 0.12)", color: "#EA580C", border: "rgba(234, 88, 12, 0.25)" };
    }
    return { bg: "rgba(124, 58, 237, 0.12)", color: "#7C3AED", border: "rgba(124, 58, 237, 0.25)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header with From/To route indicator */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          padding: "12px 18px",
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem" }}>
          <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>FROM:</span>
          <span style={{ color: "var(--text-secondary)" }}>{originName}</span>
          <span style={{ color: "var(--text-muted)", margin: "0 4px" }}>➔</span>
          <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>TO:</span>
          <span style={{ color: "var(--text-secondary)" }}>{terminalName}</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
          ⚡ First-Mile Transport Comparison
        </div>
      </div>

      {/* Comparison Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px"
        }}
      >
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const badgeStyle = getBadgeStyle(opt.badge);

          return (
            <div
              key={opt.id}
              onClick={() => onSelectOption(opt)}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "18px",
                borderRadius: "var(--radius-lg)",
                background: isSelected
                  ? (isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.05)")
                  : "var(--bg-card)",
                border: "1.5px solid",
                borderColor: isSelected
                  ? "var(--brand-primary, #2563EB)"
                  : "var(--border-subtle)",
                boxShadow: isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",
                cursor: "pointer",
                position: "relative",
                transition: "all var(--transition-fast)",
                transform: isSelected ? "translateY(-2px)" : "none"
              }}
            >
              {/* Top Row: Icon + Badge */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isSelected
                      ? "var(--brand-primary, #2563EB)"
                      : (isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"),
                    color: isSelected ? "#FFFFFF" : "var(--text-primary)"
                  }}
                >
                  {getIcon(opt.iconName)}
                </div>

                {opt.badge && badgeStyle && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "3px 9px",
                      borderRadius: "var(--radius-full)",
                      background: badgeStyle.bg,
                      color: badgeStyle.color,
                      border: `1px solid ${badgeStyle.border}`,
                      letterSpacing: "0.02em"
                    }}
                  >
                    {opt.badge}
                  </span>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <h4
                  style={{
                    fontSize: "0.98rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "2px"
                  }}
                >
                  {opt.name}
                </h4>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                  {opt.category} • {opt.availability}
                </div>
              </div>

              {/* Specs: Time, Cost, Convenience */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  padding: "10px 12px",
                  background: isDark ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.02)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "14px"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.70rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Est. Time</div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "3px" }}>
                    <Clock size={13} style={{ color: "var(--text-muted)" }} />
                    <span>{opt.timeFormatted}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.70rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Est. Price</div>
                  <div style={{ fontSize: "0.96rem", fontWeight: 900, color: "#16A34A" }}>
                    {opt.costFormatted}
                  </div>
                </div>

                <div style={{ gridColumn: "1 / -1", paddingTop: "4px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Convenience</span>
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: opt.convenienceScore >= 9 ? "#16A34A" : "var(--text-secondary)" }}>
                    {opt.convenience} ({opt.convenienceScore}/10)
                  </span>
                </div>
              </div>

              {/* Details line */}
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                  marginBottom: "14px",
                  flexGrow: 1
                }}
              >
                {opt.details}
              </p>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOption(opt);
                }}
                style={{
                  width: "100%",
                  padding: "9px 14px",
                  borderRadius: "var(--radius-md)",
                  border: isSelected ? "none" : "1px solid var(--border-subtle)",
                  background: isSelected ? "var(--brand-primary, #2563EB)" : "transparent",
                  color: isSelected ? "#FFFFFF" : "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: "0.84rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Selected</span>
                  </>
                ) : (
                  <span>Choose This Transport</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
