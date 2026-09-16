import React from "react";
import {
  Sparkles,
  MapPin,
  Clock,
  Building,
  Car,
  Star,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const DestinationPackageCard = ({ packageData, onBookPackage }) => {
  const { isDark } = useTheme();

  if (!packageData) return null;

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-xl, 16px)",
        overflow: "hidden",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF",
        transition: "transform 0.15s ease, box-shadow 0.15s ease"
      }}
    >
      {/* Package Image & Tag */}
      <div style={{ height: "140px", position: "relative" }}>
        <img
          src={packageData.image}
          alt={packageData.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />

        <div style={{ position: "absolute", top: "8px", left: "8px" }}>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "rgba(0,0,0,0.6)",
              color: "#FFFFFF"
            }}
          >
            {packageData.durationDays} Days / {packageData.durationNights} Nights
          </span>
        </div>

        <div style={{ position: "absolute", bottom: "8px", left: "10px", right: "10px", color: "#FFFFFF" }}>
          <div style={{ fontSize: "0.92rem", fontWeight: 800, lineHeight: 1.2 }}>{packageData.title}</div>
          <div style={{ fontSize: "0.72rem", opacity: 0.9 }}>📍 {packageData.destination}, {packageData.state}</div>
        </div>
      </div>

      {/* Package Details */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <Building size={12} style={{ color: "#2563EB" }} /> {packageData.hotel?.type?.split(" ")[0] || "4-Star"}
          </span>
          <span>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <Car size={12} style={{ color: "#16A34A" }} /> Cab Included
          </span>
        </div>

        {/* Reward Bonus Tag */}
        <div
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            background: "rgba(234, 88, 12, 0.10)",
            color: "#EA580C",
            fontSize: "0.70rem",
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <Sparkles size={11} />
          <span>Book this package & earn +{packageData.rewardPointsEarnable || 500} Points</span>
        </div>

        {/* Price & Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px", borderTop: "1px solid var(--border-subtle)", marginTop: "auto" }}>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--text-primary)" }}>
              ₹{packageData.price.toLocaleString("en-IN")}
            </div>
            <span style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>per person</span>
          </div>

          <button
            type="button"
            onClick={onBookPackage}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-lg, 8px)",
              background: "var(--brand-primary, #2563EB)",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 800,
              fontSize: "0.78rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span>Book</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
