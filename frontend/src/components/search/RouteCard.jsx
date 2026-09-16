import React from "react";
import {
  Train,
  Bus,
  Plane,
  Car,
  Clock,
  IndianRupee,
  Star,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { EndToEndJourneySection } from "./EndToEndJourneySection";

export const RouteCard = ({
  route,
  onViewJourney,
  onBookDirect,
  fromCity = "Chennai",
  toDestination = "Goa",
  passengers = 1,
  showEndToEndDefault = true
}) => {
  const { isDark } = useTheme();

  const getModeDetails = (mode) => {
    switch (mode) {
      case "flight":
        return { icon: Plane, label: "FLIGHT", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.12)" };
      case "train":
        return { icon: Train, label: "TRAIN", color: "#10B981", bg: "rgba(16, 185, 129, 0.12)" };
      case "bus":
        return { icon: Bus, label: "BUS", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.12)" };
      case "cab":
        return { icon: Car, label: "CAB / TAXI", color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.12)" };
      default:
        return { icon: Train, label: "TRANSIT", color: "#2563EB", bg: "rgba(37, 99, 235, 0.12)" };
    }
  };

  const modeInfo = getModeDetails(route.mode);
  const ModeIcon = modeInfo.icon;

  const isRecommended = route.recommendationTier === "best_value" || route.isRecommended;
  const isFastest = route.recommendationTier === "fastest";
  const isCheapest = route.recommendationTier === "cheapest";

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-xl, 18px)",
        padding: "22px 24px",
        border: isRecommended
          ? "2px solid #2563EB"
          : isDark
          ? "1.5px solid rgba(255, 255, 255, 0.08)"
          : "1.5px solid rgba(0, 0, 0, 0.08)",
        background: isDark
          ? "linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
        boxShadow: isRecommended
          ? "0 12px 30px -5px rgba(37, 99, 235, 0.25)"
          : "0 6px 20px -4px rgba(0, 0, 0, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        transition: "transform 0.15s ease, box-shadow 0.15s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 16px 36px -6px rgba(0, 0, 0, 0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isRecommended
          ? "0 12px 30px -5px rgba(37, 99, 235, 0.25)"
          : "0 6px 20px -4px rgba(0, 0, 0, 0.06)";
      }}
    >
      {/* Top Strip: Mode Badge + Operator & Recommendation Pill */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Mode Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "var(--radius-full, 9999px)",
              background: modeInfo.bg,
              color: modeInfo.color,
              fontWeight: 800,
              fontSize: "0.74rem",
              letterSpacing: "0.06em",
              border: `1px solid ${modeInfo.color}30`
            }}
          >
            <ModeIcon size={14} />
            <span>{modeInfo.label}</span>
          </div>

          <span style={{ fontSize: "0.94rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {route.operator || route.name}
          </span>
        </div>

        {/* Status / Tier Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isRecommended && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "var(--radius-full, 9999px)",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                fontSize: "0.72rem",
                fontWeight: 800,
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)"
              }}
            >
              <Sparkles size={11} />
              <span>Recommended</span>
            </span>
          )}

          {isFastest && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 9px",
                borderRadius: "var(--radius-full, 9999px)",
                background: "rgba(234, 88, 12, 0.12)",
                color: "#EA580C",
                fontSize: "0.72rem",
                fontWeight: 800,
                border: "1px solid rgba(234, 88, 12, 0.3)"
              }}
            >
              <Zap size={11} />
              <span>Fastest</span>
            </span>
          )}

          {isCheapest && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 9px",
                borderRadius: "var(--radius-full, 9999px)",
                background: "rgba(22, 163, 74, 0.12)",
                color: "#16A34A",
                fontSize: "0.72rem",
                fontWeight: 800,
                border: "1px solid rgba(22, 163, 74, 0.3)"
              }}
            >
              <span>₹ Lowest Price</span>
            </span>
          )}

          <div style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.78rem", fontWeight: 700, color: "#F59E0B" }}>
            <Star size={13} fill="#F59E0B" />
            <span>{route.rating || 4.7}</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Departure ➔ Duration ➔ Arrival */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "14px",
          padding: "12px 16px",
          borderRadius: "var(--radius-lg, 12px)",
          background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
          border: "1px solid var(--border-subtle)"
        }}
      >
        {/* Departure */}
        <div>
          <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>
            {route.departureTime || "06:30 AM"}
          </div>
          <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
            {route.fromLocation || route.from || "Origin Hub"}
          </div>
        </div>

        {/* Duration & Connector Line */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "120px" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
            <Clock size={12} />
            <span>{route.duration || "5h 30m"}</span>
          </span>
          <div style={{ width: "100%", height: "2px", background: "var(--border-subtle)", position: "relative", margin: "6px 0" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: modeInfo.color,
                position: "absolute",
                top: "-3px",
                left: "calc(50% - 4px)"
              }}
            />
          </div>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {route.stops || "Direct Transit"}
          </span>
        </div>

        {/* Arrival */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>
            {route.arrivalTime || "01:45 PM"}
          </div>
          <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px", marginLeft: "auto" }}>
            {route.toLocation || route.to || "Destination Hub"}
          </div>
        </div>
      </div>

      {/* Bottom Row: Seat/Class Specs + Price & View Journey Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          paddingTop: "6px"
        }}
      >
        {/* Class & Seat Availability */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              background: "var(--bg-tertiary)",
              fontSize: "0.76rem",
              fontWeight: 700,
              color: "var(--text-secondary)"
            }}
          >
            {route.category || (route.classes?.[0]?.className) || "Standard Class"}
          </span>

          <span
            style={{
              fontSize: "0.76rem",
              fontWeight: 700,
              color: "#16A34A",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <CheckCircle2 size={13} />
            <span>{route.seatAvailability || route.availabilityStatus || "Available"}</span>
          </span>
        </div>

        {/* Price & Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", display: "flex", alignItems: "baseline", gap: "1px" }}>
              <span>₹{(route.price || 650).toLocaleString("en-IN")}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>/ passenger</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "#16A34A", fontWeight: 700 }}>
              +Earn {Math.round((route.price || 650) * 0.05)} INAVIST Points
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewJourney(route)}
            style={{
              padding: "10px 22px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "var(--brand-primary, #2563EB)",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 800,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              transition: "all var(--transition-fast)"
            }}
          >
            <span>View Journey</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Embedded End-to-End Doorstep Options (Cab from Home + Deboarding) */}
      <EndToEndJourneySection
        route={route}
        fromCity={fromCity}
        toDestination={toDestination}
        passengers={passengers}
        onBookEndToEnd={onViewJourney}
        isDefaultExpanded={isRecommended || showEndToEndDefault}
      />
    </div>
  );
};
