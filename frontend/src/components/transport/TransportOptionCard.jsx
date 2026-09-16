import React from "react";
import {
  Train,
  Bus,
  Plane,
  Car,
  Bike,
  Clock,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Luggage,
  Fuel,
  Receipt,
  Navigation,
  Info,
  Zap,
  Tag,
  Layers
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const TransportOptionCard = ({
  option,
  isSelected = false,
  onSelect,
  optionNumber = 1
}) => {
  const { isDark } = useTheme();

  if (!option) return null;

  const getModeIcon = (mode) => {
    switch (mode) {
      case "bus":
        return <Bus size={20} />;
      case "train":
        return <Train size={20} />;
      case "flight":
        return <Plane size={20} />;
      case "cab":
      case "car":
        return <Car size={20} />;
      case "bike":
        return <Bike size={20} />;
      default:
        return <Train size={20} />;
    }
  };

  const getTierBadgeStyle = (tierType) => {
    switch (tierType) {
      case "best_value":
        return {
          bg: isDark ? "rgba(22, 163, 74, 0.20)" : "rgba(22, 163, 74, 0.12)",
          color: "#16A34A",
          border: "rgba(22, 163, 74, 0.35)",
          icon: Sparkles
        };
      case "fastest":
        return {
          bg: isDark ? "rgba(234, 88, 12, 0.20)" : "rgba(234, 88, 12, 0.12)",
          color: "#EA580C",
          border: "rgba(234, 88, 12, 0.35)",
          icon: Zap
        };
      case "cheapest":
        return {
          bg: isDark ? "rgba(37, 99, 235, 0.20)" : "rgba(37, 99, 235, 0.12)",
          color: "#2563EB",
          border: "rgba(37, 99, 235, 0.35)",
          icon: Tag
        };
      case "premium":
        return {
          bg: isDark ? "rgba(124, 58, 237, 0.20)" : "rgba(124, 58, 237, 0.12)",
          color: "#7C3AED",
          border: "rgba(124, 58, 237, 0.35)",
          icon: Star
        };
      default:
        return {
          bg: isDark ? "rgba(37, 99, 235, 0.20)" : "rgba(37, 99, 235, 0.12)",
          color: "#2563EB",
          border: "rgba(37, 99, 235, 0.35)",
          icon: Sparkles
        };
    }
  };

  const badgeStyle = getTierBadgeStyle(option.tierType);
  const BadgeIcon = badgeStyle.icon;

  return (
    <div
      onClick={() => onSelect && onSelect(option)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "var(--radius-2xl, 20px)",
        padding: "22px 24px",
        background: isSelected
          ? (isDark ? "rgba(37, 99, 235, 0.14)" : "rgba(37, 99, 235, 0.05)")
          : "var(--bg-card, #FFFFFF)",
        border: "2px solid",
        borderColor: isSelected
          ? "var(--brand-primary, #2563EB)"
          : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"),
        boxShadow: isSelected
          ? "0 10px 30px rgba(37, 99, 235, 0.20), 0 2px 8px rgba(0,0,0,0.05)"
          : "0 4px 16px rgba(0,0,0,0.04)",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isSelected ? "translateY(-3px)" : "none",
        gap: "18px"
      }}
    >
      {/* Top Bar: Option Identifier & Tier Label */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          {/* Header Tag e.g. TRAIN OPTION 01 */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted, #64748B)",
                padding: "3px 8px",
                borderRadius: "6px",
                background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"
              }}
            >
              {option.mode?.toUpperCase()} OPTION {optionNumber < 10 ? `0${optionNumber}` : optionNumber}
            </span>

            {option.category && (
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--brand-primary, #2563EB)",
                  background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.08)",
                  padding: "3px 8px",
                  borderRadius: "6px"
                }}
              >
                {option.category.split("/")[0].trim()}
              </span>
            )}
          </div>

          {/* Tier Badge (CHEAPEST, FASTEST, BEST VALUE, PREMIUM) */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.76rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: "9999px",
              background: badgeStyle.bg,
              color: badgeStyle.color,
              border: `1.5px solid ${badgeStyle.border}`,
              boxShadow: isSelected ? `0 2px 10px ${badgeStyle.border}` : "none"
            }}
          >
            <BadgeIcon size={13} />
            <span>{option.tier}</span>
          </div>
        </div>

        {/* Transport Name & Operator */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: isSelected
                ? "var(--brand-primary, #2563EB)"
                : (isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"),
              color: isSelected ? "#FFFFFF" : "var(--text-primary)",
              boxShadow: isSelected ? "0 4px 12px rgba(37,99,235,0.3)" : "none"
            }}
          >
            {getModeIcon(option.mode)}
          </div>

          <div style={{ flexGrow: 1 }}>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.12rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                marginBottom: "2px"
              }}
            >
              {option.name}
            </h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
              {option.operator}
            </p>
          </div>
        </div>

        {/* Departure -> Duration & Stops -> Arrival Timeline Box */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderRadius: "14px",
            background: isDark ? "rgba(0,0,0,0.35)" : "#F8FAFC",
            border: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
            marginBottom: "16px"
          }}
        >
          {/* Departure */}
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "2px" }}>
              Departure
            </div>
            <div style={{ fontSize: "1.08rem", fontWeight: 900, color: "var(--text-primary)" }}>
              {option.departureTime}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px", fontWeight: 500 }} title={option.fromLocation}>
              {option.fromLocation}
            </div>
          </div>

          {/* Middle Duration & Stops Indicator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 8px" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={13} style={{ color: "var(--brand-primary, #2563EB)" }} />
              <span>{option.duration}</span>
            </div>
            <div
              style={{
                width: "100%",
                minWidth: "75px",
                height: "2px",
                background: "var(--border-subtle, #CBD5E1)",
                position: "relative",
                margin: "6px 0"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--brand-primary, #2563EB)"
                }}
              />
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textAlign: "center", whiteSpace: "nowrap" }}>
              {option.stopsCount === 0 ? "Non-stop" : `${option.stopsCount} stop${option.stopsCount > 1 ? "s" : ""}`}
            </div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "2px" }}>
              Arrival
            </div>
            <div style={{ fontSize: "1.08rem", fontWeight: 900, color: "var(--text-primary)" }}>
              {option.arrivalTime}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px", fontWeight: 500 }} title={option.toLocation}>
              {option.toLocation}
            </div>
          </div>
        </div>

        {/* Pricing & Class Banner */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 14px",
            borderRadius: "12px",
            background: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
            marginBottom: "14px"
          }}
        >
          <div>
            <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
              Estimated Price / Fare
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#16A34A", display: "flex", alignItems: "baseline", gap: "2px" }}>
              <span>{option.priceFormatted}</span>
              {option.mode === "car" && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}> (Fuel + Toll)</span>}
              {option.mode === "bike" && <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}> (Fuel)</span>}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
                background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF",
                padding: "4px 10px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)"
              }}
            >
              {option.directText?.includes("Direct") ? "Direct Journey" : "Connecting Route"}
            </span>
          </div>
        </div>

        {/* Mode-Specific Highlight Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
          {/* Rating */}
          {option.rating && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.72rem",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "6px",
                background: "rgba(234, 88, 12, 0.12)",
                color: "#EA580C"
              }}
            >
              <Star size={11} fill="#EA580C" />
              <span>{option.rating} ({option.ratingCount?.toLocaleString("en-IN") || "500+"})</span>
            </span>
          )}

          {/* Baggage info for flight */}
          {option.baggageInfo && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "6px",
                background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                color: "var(--text-secondary)"
              }}
            >
              <Luggage size={11} />
              <span>{option.baggageInfo}</span>
            </span>
          )}

          {/* Fuel & Toll breakdown for car */}
          {option.mode === "car" && option.fuelCost && (
            <>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                  color: "var(--text-secondary)"
                }}
              >
                <Fuel size={11} />
                <span>Fuel: ₹{option.fuelCost} ({option.fuelLiters}L)</span>
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                  color: "var(--text-secondary)"
                }}
              >
                <Receipt size={11} />
                <span>Toll: ₹{option.tollCost}</span>
              </span>
            </>
          )}

          {/* Bike suggested route */}
          {option.suggestedRoute && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "6px",
                background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
                color: "var(--text-secondary)"
              }}
            >
              <Navigation size={11} />
              <span>{option.suggestedRoute}</span>
            </span>
          )}

          {/* Availability Status */}
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "6px",
              background: isDark ? "rgba(255,255,255,0.05)" : "#EDE9FE",
              color: "#7C3AED"
            }}
          >
            {option.availabilityStatus}
          </span>
        </div>

        {/* Available Classes Pills when available */}
        {option.availableClasses && option.availableClasses.length > 1 && (
          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
              Available Classes & Fares:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {option.availableClasses.map((cls, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "0.70rem",
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: "4px",
                    background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)"
                  }}
                >
                  {cls.name} • <strong>₹{cls.price?.toLocaleString("en-IN")}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Reason */}
        {option.recommendationReason && (
          <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.45, margin: "0 0 16px 0" }}>
            {option.recommendationReason}
          </p>
        )}
      </div>

      {/* Bottom Section: Sample Data Disclaimer + Selection Action Button */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.70rem",
            color: "var(--text-muted)",
            marginBottom: "12px"
          }}
        >
          <Info size={12} style={{ color: "var(--brand-primary, #2563EB)", flexShrink: 0 }} />
          <span>Estimated Fare • Sample Transport Data (API Ready)</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(option);
          }}
          style={{
            width: "100%",
            padding: "12px 18px",
            borderRadius: "var(--radius-xl, 14px)",
            border: isSelected ? "none" : "1.5px solid var(--brand-primary, #2563EB)",
            background: isSelected ? "var(--brand-primary, #2563EB)" : "transparent",
            color: isSelected ? "#FFFFFF" : "var(--brand-primary, #2563EB)",
            fontWeight: 800,
            fontSize: "0.88rem",
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            boxShadow: isSelected ? "0 4px 16px rgba(37,99,235,0.35)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={18} />
              <span>Selected This Journey</span>
            </>
          ) : (
            <>
              <span>Select This Journey</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
