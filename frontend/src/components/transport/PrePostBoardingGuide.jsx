import React, { useState } from "react";
import {
  Clock,
  ShieldCheck,
  Luggage,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Car,
  Bus,
  Train,
  Plane,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  IndianRupee,
  Layers,
  PhoneCall
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  PRE_BOARDING_OPTIONS,
  POST_DEBOARDING_OPTIONS,
  TRAVEL_PREP_CHECKLIST,
  PRICE_VARIATION_24H,
  ATTRACTION_TIMING_GUIDE
} from "../../data/journeyAssistData";

export const PrePostBoardingGuide = ({ destinationName = "Kodaikanal", fromCity = "Chennai" }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("pre_boarding"); // 'pre_boarding' | 'post_deboarding' | 'timing_guide' | 'checklist'
  const [expandedOptionId, setExpandedOptionId] = useState(null);
  const [completedChecks, setCompletedChecks] = useState({});

  const toggleCheck = (id) => {
    setCompletedChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id) => {
    setExpandedOptionId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "24px",
        border: "1.5px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
    >
      {/* Header with Sub-tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase" }}>
            <Sparkles size={14} />
            <span>Complete Travel Lifecycle Assist</span>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginTop: "2px"
            }}
          >
            Pre-Boarding & Post-Deboarding Guide
          </h3>
          <p style={{ fontSize: "0.80rem", color: "var(--text-muted)" }}>
            Door-to-door transit, luggage policies, 24-hour fare surges, and tourist place operating hours.
          </p>
        </div>

        {/* Tab Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {[
            { id: "pre_boarding", label: "🚕 Before Boarding (Home → Hub)" },
            { id: "post_deboarding", label: "🏨 After Deboarding (Hub → Stay)" },
            { id: "timing_guide", label: "⏰ 24H Rates & Spot Times" },
            { id: "checklist", label: "📋 Travel Checklist" }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid",
                  borderColor: isSelected ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                  background: isSelected ? (isDark ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.10)") : "transparent",
                  color: isSelected ? "var(--brand-primary, #2563EB)" : "var(--text-secondary)",
                  fontSize: "0.78rem",
                  fontWeight: isSelected ? 800 : 600,
                  cursor: "pointer"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. PRE-BOARDING SECTION */}
      {activeTab === "pre_boarding" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              background: isDark ? "rgba(37, 99, 235, 0.1)" : "rgba(37, 99, 235, 0.05)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <Clock size={18} style={{ color: "var(--brand-primary, #2563EB)", flexShrink: 0 }} />
            <span>
              <strong>Departure Buffer Recommendation:</strong> Reach Railway Stations <strong>30–45 mins</strong> before departure; Domestic Airports <strong>120 mins</strong> before departure.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {PRE_BOARDING_OPTIONS.slice(0, 6).map((opt) => {
              const isExpanded = expandedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-lg)",
                    background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "1.1rem" }}>{opt.icon}</span>
                        <strong style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>{opt.name}</strong>
                      </div>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px", display: "block" }}>
                        {opt.description}
                      </span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#16A34A" }}>
                        ₹{opt.priceRange.min} – ₹{opt.priceRange.max}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "0.72rem" }}>
                    <span style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)" }}>
                      🕒 Wait: {opt.estimatedWait}
                    </span>
                    <span style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)" }}>
                      🧳 {opt.luggagePolicy}
                    </span>
                  </div>

                  {isExpanded && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px", borderTop: "1px dashed var(--border-subtle)", fontSize: "0.78rem" }}>
                      <div><strong>Booking:</strong> {opt.bookingMethod}</div>
                      <div><strong>Pricing Note:</strong> {opt.pricingNote}</div>
                      <div>
                        <strong>Pro Tips:</strong>
                        <ul style={{ paddingLeft: "16px", marginTop: "4px", color: "var(--text-secondary)" }}>
                          {opt.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleExpand(opt.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--brand-primary, #2563EB)",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0,
                      marginTop: "auto"
                    }}
                  >
                    {isExpanded ? "Show Less" : "View Booking Tips & Rules"}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. POST-DEBOARDING SECTION */}
      {activeTab === "post_deboarding" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-lg)",
              background: isDark ? "rgba(22, 163, 74, 0.1)" : "rgba(22, 163, 74, 0.05)",
              border: "1px solid rgba(22, 163, 74, 0.2)",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <MapPin size={18} style={{ color: "#16A34A", flexShrink: 0 }} />
            <span>
              <strong>Deboarding Advice for {destinationName}:</strong> Always prefer government prepaid counters at railway stations and bus stands to avoid inflated private taxi fares.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
            {POST_DEBOARDING_OPTIONS.map((opt) => {
              const isExpanded = expandedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-lg)",
                    background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "1.1rem" }}>{opt.icon}</span>
                        <strong style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>{opt.name}</strong>
                      </div>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px", display: "block" }}>
                        {opt.description}
                      </span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#16A34A" }}>
                        {opt.priceEstimate}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "0.72rem" }}>
                    <span style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)" }}>
                      📍 Board at: {opt.howToFind}
                    </span>
                  </div>

                  {isExpanded && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "8px", borderTop: "1px dashed var(--border-subtle)", fontSize: "0.78rem" }}>
                      <div><strong>Luggage:</strong> {opt.luggage}</div>
                      <div>
                        <strong>Local Tips:</strong>
                        <ul style={{ paddingLeft: "16px", marginTop: "4px", color: "var(--text-secondary)" }}>
                          {opt.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleExpand(opt.id)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "var(--brand-primary, #2563EB)",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: 0,
                      marginTop: "auto"
                    }}
                  >
                    {isExpanded ? "Show Less" : "View Deboarding Guidance"}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. 24-HOUR PRICE VARIATION & SPOT OPERATING TIMES */}
      {activeTab === "timing_guide" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 24-Hour Fare Variation Cards */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} />
              <span>24-Hour Transport Fare Variations & Surge Times</span>
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {PRICE_VARIATION_24H.map((slot, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "14px",
                    borderRadius: "var(--radius-lg)",
                    background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ fontSize: "0.84rem", color: "var(--text-primary)" }}>{slot.timeSlot}</strong>
                    <span
                      style={{
                        fontSize: "0.70rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: slot.priceMultiplier > 1.2 ? "rgba(239, 68, 68, 0.15)" : slot.priceMultiplier < 1.0 ? "rgba(22, 163, 74, 0.15)" : "rgba(37, 99, 235, 0.15)",
                        color: slot.priceMultiplier > 1.2 ? "#EF4444" : slot.priceMultiplier < 1.0 ? "#16A34A" : "var(--brand-primary, #2563EB)"
                      }}
                    >
                      {slot.pricingType}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {slot.reason}
                  </p>
                  <div style={{ fontSize: "0.72rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700, marginTop: "4px" }}>
                    💡 Tip: {slot.bestOption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attraction Operating Times & Availability */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={16} />
              <span>Attraction Operating Times & Timing Rules</span>
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
              {ATTRACTION_TIMING_GUIDE.slice(0, 4).map((att) => (
                <div
                  key={att.category}
                  style={{
                    padding: "14px",
                    borderRadius: "var(--radius-lg)",
                    background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  <strong style={{ fontSize: "0.86rem", color: "var(--text-primary)" }}>{att.category}</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    <strong>Hours:</strong> {att.typicalHours}
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#16A34A", fontWeight: 600 }}>
                    ⭐ Best Visit: {att.bestTimeToVisit}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    ⚠️ {att.ticketCounterCloses} | Closed: {att.weeklyClosure}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. PREPARATION CHECKLIST */}
      {activeTab === "checklist" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Tick off essential items before heading out of your home.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            {TRAVEL_PREP_CHECKLIST.map((grp) => (
              <div
                key={grp.category}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-lg)",
                  background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{grp.category}</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {grp.items.map((item, idx) => {
                    const itemId = `${grp.category}-${idx}`;
                    const isChecked = !!completedChecks[itemId];
                    return (
                      <label
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          fontSize: "0.78rem",
                          color: isChecked ? "var(--text-muted)" : "var(--text-secondary)",
                          textDecoration: isChecked ? "line-through" : "none",
                          cursor: "pointer"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(itemId)}
                          style={{ marginTop: "2px", accentColor: "#16A34A" }}
                        />
                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
