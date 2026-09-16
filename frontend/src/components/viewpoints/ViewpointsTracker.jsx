import React, { useState } from "react";
import {
  Eye,
  Clock,
  Users,
  ShieldCheck,
  MapPin,
  CheckCircle,
  AlertCircle,
  Sun,
  Sunrise,
  Sunset,
  Search,
  Filter
} from "lucide-react";
import { destinationsData } from "../../data/destinationsData";
import { ViewpointBadge, CrowdBadge } from "../common/Badge";

export const ViewpointsTracker = ({ onSelectDestination }) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = destinationsData.filter((dest) => {
    if (filterStatus === "open" && dest.viewpointStatus !== "OPEN") return false;
    if (filterStatus === "busy" && dest.viewpointStatus !== "BUSY") return false;
    if (filterStatus === "low-crowd" && dest.crowdLevel.toLowerCase() !== "low") return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        dest.name.toLowerCase().includes(q) ||
        dest.state.toLowerCase().includes(q) ||
        dest.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "24px 20px" }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: "32px 28px",
          background: "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(14, 165, 233, 0.12)",
              color: "#0284c7",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "10px"
            }}
          >
            <Eye size={14} />
            <span>Real-Time Viewpoint Availability & Crowd Tracker</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.3rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Viewpoints & Crowd Levels
          </h1>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Check opening hours, crowd congestion levels, sunrise/sunset golden hours, and safety ratings before heading out.
          </p>

          <div
            style={{
              marginTop: "16px",
              fontSize: "0.78rem",
              background: "var(--bg-tertiary)",
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)"
            }}
          >
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            <span>Simulated real-time estimation engine for demo mode.</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div
          style={{
            flex: 1,
            minWidth: "260px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--bg-tertiary)",
            padding: "10px 16px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search viewpoints, forts, waterfalls, sunrise spots..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "0.92rem",
              color: "var(--text-primary)",
              width: "100%"
            }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Spots" },
            { id: "open", label: "OPEN 🟢" },
            { id: "busy", label: "BUSY 🟡" },
            { id: "low-crowd", label: "LOW CROWD 👥" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: filterStatus === item.id ? "var(--brand-primary)" : "var(--border-subtle)",
                background: filterStatus === item.id ? "var(--brand-primary)" : "var(--bg-tertiary)",
                color: filterStatus === item.id ? "#fff" : "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Viewpoint Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px"
        }}
      >
        {filtered.map((dest) => {
          const crowdPercent = dest.crowdPercentage || 50;
          return (
            <div
              key={dest.id}
              className="glass-card"
              onClick={() => onSelectDestination(dest)}
              style={{
                padding: "20px",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}
            >
              {/* Header with Title and Badges */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}>
                    {dest.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <MapPin size={13} color="#f97316" />
                    <span>{dest.district}, {dest.state}</span>
                  </div>
                </div>

                <ViewpointBadge status={dest.viewpointStatus} />
              </div>

              {/* Timing Box */}
              <div
                style={{
                  background: "var(--bg-tertiary)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={14} /> Visiting Hours:
                  </span>
                  <strong>{dest.viewpointTimings?.open} - {dest.viewpointTimings?.close}</strong>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Sunrise size={14} color="#EA580C" /> Best Light Window:
                  </span>
                  <span style={{ fontWeight: 600, color: "#0284c7" }}>{dest.viewpointTimings?.bestTime}</span>
                </div>
              </div>

              {/* Crowd Density Meter */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 600 }}>
                    <Users size={14} />
                    <span>Live Crowd Estimate</span>
                  </div>
                  <CrowdBadge level={dest.crowdLevel} />
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${crowdPercent}%`,
                      height: "100%",
                      borderRadius: "var(--radius-full)",
                      background:
                        crowdPercent > 75
                          ? "linear-gradient(90deg, #EA580C, #ef4444)"
                          : crowdPercent > 45
                          ? "linear-gradient(90deg, #0ea5e9, #EA580C)"
                          : "linear-gradient(90deg, #10b981, #0ea5e9)",
                      transition: "width 0.4s ease"
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)"
                }}
              >
                <span>Safety: <strong>{dest.safetyRating}/5.0</strong></span>
                <span style={{ color: "var(--brand-primary)", fontWeight: 700 }}>
                  View Full Guidance $\rightarrow$
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
