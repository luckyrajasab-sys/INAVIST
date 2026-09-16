import React from "react";
import {
  GitFork,
  Train,
  Car,
  Plane,
  Bus,
  Clock,
  IndianRupee,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Plus
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { EndToEndJourneySection } from "./EndToEndJourneySection";

export const MultiModalRouteCard = ({
  route,
  onViewJourney,
  fromCity = "Chennai",
  toDestination = "Goa",
  passengers = 1,
  showEndToEndDefault = true
}) => {
  const { isDark } = useTheme();

  const getModeIcon = (mode) => {
    switch (mode) {
      case "flight":
        return Plane;
      case "train":
        return Train;
      case "bus":
        return Bus;
      case "cab":
        return Car;
      default:
        return Train;
    }
  };

  const sectors = route.sectors || [
    {
      sectorIndex: 1,
      mode: "train",
      operator: "Chennai Central ➔ Bengaluru Express",
      departureTime: "06:15 AM",
      arrivalTime: "12:45 PM",
      price: 650
    },
    {
      sectorIndex: 2,
      mode: "cab",
      operator: "Bengaluru Railway Station ➔ Hotel Cab",
      departureTime: "01:00 PM",
      arrivalTime: "02:15 PM",
      price: 350
    }
  ];

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-xl, 18px)",
        padding: "22px 24px",
        border: "2px solid rgba(139, 92, 246, 0.4)",
        background: isDark
          ? "linear-gradient(135deg, rgba(24, 15, 38, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)"
          : "linear-gradient(135deg, rgba(245, 243, 255, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%)",
        boxShadow: "0 10px 30px -5px rgba(139, 92, 246, 0.18)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 16px 36px -6px rgba(139, 92, 246, 0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px -5px rgba(139, 92, 246, 0.18)";
      }}
    >
      {/* Top Header Strip */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "rgba(139, 92, 246, 0.16)",
              color: "#8B5CF6",
              fontWeight: 800,
              fontSize: "0.74rem",
              border: "1px solid rgba(139, 92, 246, 0.3)"
            }}
          >
            <GitFork size={14} />
            <span>MULTI-MODAL • {route.multiModalType || "Train + Cab"}</span>
          </div>

          <span style={{ fontSize: "0.94rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {route.title || `${route.fromLocation} → ${route.toLocation}`}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              padding: "3px 9px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "rgba(22, 163, 74, 0.12)",
              color: "#16A34A",
              fontSize: "0.72rem",
              fontWeight: 800,
              border: "1px solid rgba(22, 163, 74, 0.3)"
            }}
          >
            Seamless Connection
          </span>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.78rem", fontWeight: 700, color: "#F59E0B" }}>
            <Star size={13} fill="#F59E0B" />
            <span>{route.rating || 4.85}</span>
          </div>
        </div>
      </div>

      {/* Connected Sectors Breakdown Ribbon */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "14px 16px",
          borderRadius: "var(--radius-lg, 12px)",
          background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF",
          border: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          {sectors.map((sec, idx) => {
            const Icon = getModeIcon(sec.mode);
            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#8B5CF6", fontWeight: 800, fontSize: "0.76rem" }}>
                    <Plus size={14} />
                    <span style={{ padding: "2px 8px", borderRadius: "4px", background: "rgba(139, 92, 246, 0.12)" }}>
                      Transfer (15m buffer)
                    </span>
                  </div>
                )}

                <div
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                    border: "1px solid var(--border-subtle)"
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(139, 92, 246, 0.15)",
                      color: "#8B5CF6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      Sector {idx + 1}: {sec.operator}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {sec.departureTime} → {sec.arrivalTime} • <strong style={{ color: "var(--text-primary)" }}>₹{sec.price}</strong>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary & Pricing */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={13} />
            <span>Total Duration: <strong>{route.duration || "8h 00m"}</strong></span>
          </span>
          <span style={{ fontSize: "0.76rem", color: "#16A34A", fontWeight: 700 }}>
            • Single Combined Ticket
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", display: "flex", alignItems: "baseline", gap: "2px" }}>
              <span>₹{(route.price || 1000).toLocaleString("en-IN")}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Total</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "#8B5CF6", fontWeight: 700 }}>
              +Earn {Math.round((route.price || 1000) * 0.1)} Points (10% Multi-Modal Bonus)
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewJourney(route)}
            style={{
              padding: "10px 22px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 800,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(139, 92, 246, 0.35)",
              transition: "all var(--transition-fast)"
            }}
          >
            <span>View Journey</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Embedded End-to-End Doorstep Options */}
      <EndToEndJourneySection
        route={route}
        fromCity={fromCity}
        toDestination={toDestination}
        passengers={passengers}
        onBookEndToEnd={onViewJourney}
        isDefaultExpanded={showEndToEndDefault}
      />
    </div>
  );
};
