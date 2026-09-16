import React from "react";
import {
  CheckCircle2,
  Clock,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Check,
  X,
  Layers,
  ArrowDownUp
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const TransportComparisonMatrix = ({
  options = [],
  selectedOptionId,
  onSelectOption,
  modeTitle = "Train"
}) => {
  const { isDark } = useTheme();

  if (!options || options.length === 0) return null;

  return (
    <div
      style={{
        borderRadius: "var(--radius-2xl, 20px)",
        border: "1.5px solid var(--border-subtle, rgba(0,0,0,0.08))",
        background: isDark ? "rgba(15, 23, 42, 0.75)" : "#FFFFFF",
        overflow: "hidden",
        boxShadow: "var(--shadow-md, 0 4px 20px rgba(0,0,0,0.05))"
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-subtle, rgba(0,0,0,0.08))",
          background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "2px" }}>
            <Layers size={14} />
            <span>Side-by-Side Comparison Matrix</span>
          </div>
          <h4
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.20rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              margin: 0
            }}
          >
            Compare 4 {modeTitle} Options Side by Side
          </h4>
        </div>

        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 600 }}>
          All prices & durations marked as <strong>Estimated</strong>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Comparison Grid */}
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          style={{
            width: "100%",
            minWidth: "760px",
            borderCollapse: "collapse",
            textAlign: "left"
          }}
        >
          <thead>
            <tr style={{ background: isDark ? "rgba(0,0,0,0.2)" : "#F1F5F9" }}>
              <th style={{ padding: "16px 20px", width: "20%", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)" }}>
                Criteria / Option
              </th>
              {options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <th
                    key={opt.id}
                    style={{
                      padding: "16px 18px",
                      width: "20%",
                      borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                      background: isSelected
                        ? (isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.08)")
                        : "transparent"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span
                        style={{
                          fontSize: "0.70rem",
                          fontWeight: 900,
                          letterSpacing: "0.05em",
                          color: opt.tierColor || "#2563EB"
                        }}
                      >
                        {opt.tier}
                      </span>
                      <span
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: 800,
                          color: "var(--text-primary)",
                          lineHeight: 1.2
                        }}
                      >
                        {opt.name}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* ROW 1: Estimated Price */}
            <tr style={{ borderTop: "1px solid var(--border-subtle, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Estimated Price / Fare
              </td>
              {options.map((opt) => (
                <td
                  key={opt.id}
                  style={{
                    padding: "14px 18px",
                    borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                    background: selectedOptionId === opt.id ? (isDark ? "rgba(37,99,235,0.10)" : "rgba(37,99,235,0.04)") : "transparent"
                  }}
                >
                  <span style={{ fontSize: "1.15rem", fontWeight: 900, color: "#16A34A" }}>
                    {opt.priceFormatted}
                  </span>
                </td>
              ))}
            </tr>

            {/* ROW 2: Travel Duration */}
            <tr style={{ borderTop: "1px solid var(--border-subtle, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Travel Duration
              </td>
              {options.map((opt) => (
                <td
                  key={opt.id}
                  style={{
                    padding: "14px 18px",
                    borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                    background: selectedOptionId === opt.id ? (isDark ? "rgba(37,99,235,0.10)" : "rgba(37,99,235,0.04)") : "transparent"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 800, color: "var(--text-primary)", fontSize: "0.90rem" }}>
                    <Clock size={14} style={{ color: "var(--brand-primary, #2563EB)" }} />
                    <span>{opt.duration}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* ROW 3: Departure & Arrival Timings */}
            <tr style={{ borderTop: "1px solid var(--border-subtle, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Timings (Dep → Arr)
              </td>
              {options.map((opt) => (
                <td
                  key={opt.id}
                  style={{
                    padding: "14px 18px",
                    fontSize: "0.82rem",
                    borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                    background: selectedOptionId === opt.id ? (isDark ? "rgba(37,99,235,0.10)" : "rgba(37,99,235,0.04)") : "transparent"
                  }}
                >
                  <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
                    {opt.departureTime} → {opt.arrivalTime}
                  </div>
                </td>
              ))}
            </tr>

            {/* ROW 4: Class / Vehicle Category */}
            <tr style={{ borderTop: "1px solid var(--border-subtle, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Class / Vehicle
              </td>
              {options.map((opt) => (
                <td
                  key={opt.id}
                  style={{
                    padding: "14px 18px",
                    fontSize: "0.80rem",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                    background: selectedOptionId === opt.id ? (isDark ? "rgba(37,99,235,0.10)" : "rgba(37,99,235,0.04)") : "transparent"
                  }}
                >
                  {opt.category || "Standard"}
                </td>
              ))}
            </tr>

            {/* ROW 5: Stops / Transfers */}
            <tr style={{ borderTop: "1px solid var(--border-subtle, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Route & Stops
              </td>
              {options.map((opt) => (
                <td
                  key={opt.id}
                  style={{
                    padding: "14px 18px",
                    fontSize: "0.78rem",
                    color: "var(--text-secondary)",
                    borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                    background: selectedOptionId === opt.id ? (isDark ? "rgba(37,99,235,0.10)" : "rgba(37,99,235,0.04)") : "transparent"
                  }}
                >
                  {opt.stops}
                </td>
              ))}
            </tr>

            {/* ROW 6: Rating */}
            <tr style={{ borderTop: "1px solid var(--border-subtle, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                User Rating
              </td>
              {options.map((opt) => (
                <td
                  key={opt.id}
                  style={{
                    padding: "14px 18px",
                    fontSize: "0.80rem",
                    borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                    background: selectedOptionId === opt.id ? (isDark ? "rgba(37,99,235,0.10)" : "rgba(37,99,235,0.04)") : "transparent"
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 800, color: "#EA580C" }}>
                    <Star size={13} fill="#EA580C" />
                    <span>{opt.rating} / 5.0</span>
                  </span>
                </td>
              ))}
            </tr>

            {/* ROW 7: Best Suited For */}
            <tr style={{ borderTop: "1px solid var(--border-subtle, rgba(0,0,0,0.06))" }}>
              <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Best Suited For
              </td>
              {options.map((opt) => (
                <td
                  key={opt.id}
                  style={{
                    padding: "14px 18px",
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                    borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                    background: selectedOptionId === opt.id ? (isDark ? "rgba(37,99,235,0.10)" : "rgba(37,99,235,0.04)") : "transparent"
                  }}
                >
                  {opt.recommendationReason}
                </td>
              ))}
            </tr>

            {/* ROW 8: Action Selection Buttons */}
            <tr style={{ borderTop: "2px solid var(--border-subtle, rgba(0,0,0,0.08))", background: isDark ? "rgba(0,0,0,0.1)" : "#FAFAFA" }}>
              <td style={{ padding: "16px 20px", fontWeight: 800, fontSize: "0.80rem", color: "var(--text-primary)" }}>
                Select Option
              </td>
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <td
                    key={opt.id}
                    style={{
                      padding: "16px 18px",
                      borderLeft: "1px solid var(--border-subtle, rgba(0,0,0,0.06))",
                      background: isSelected ? (isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.06)") : "transparent"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectOption && onSelectOption(opt)}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: isSelected ? "none" : "1px solid var(--brand-primary, #2563EB)",
                        background: isSelected ? "var(--brand-primary, #2563EB)" : "transparent",
                        color: isSelected ? "#FFFFFF" : "var(--brand-primary, #2563EB)",
                        fontWeight: 800,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
                        transition: "all 0.18s ease"
                      }}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Select This</span>
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
