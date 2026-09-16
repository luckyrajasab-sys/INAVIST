import React from "react";
import {
  Zap,
  Clock,
  Car,
  Bus,
  Train,
  Plane,
  MapPin,
  ArrowRight,
  ShieldAlert,
  X,
  Navigation,
  CheckCircle2,
  PhoneCall
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { TransportService } from "../../services/TransportService";

export const SuddenTravelModal = ({
  isOpen,
  onClose,
  currentCity = "Chennai",
  destination = "Kodaikanal",
  onSelectOption
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const suddenData = TransportService.getSuddenTravelOptions(currentCity, destination);

  const getOptionIcon = (iconName) => {
    switch (iconName) {
      case "Car":
        return <Car size={22} />;
      case "Bus":
        return <Bus size={22} />;
      case "Train":
        return <Train size={22} />;
      default:
        return <Zap size={22} />;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: isDark ? "#0F172A" : "#FFFFFF",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--border-subtle)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          padding: "26px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: "rgba(220, 38, 38, 0.12)",
                color: "#DC2626",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "0.03em",
                marginBottom: "6px"
              }}
            >
              <Zap size={14} />
              <span>SUDDEN TRAVEL • INSTANT DEPARTURE MODE</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.45rem",
                fontWeight: 900,
                color: "var(--text-primary)"
              }}
            >
              Need to Travel Now?
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Leaving from <strong style={{ color: "var(--text-primary)" }}>{currentCity}</strong> to <strong style={{ color: "var(--text-primary)" }}>{destination}</strong> (~{suddenData.distanceKm} km)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--border-subtle)",
              background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nearest Terminals Radar Strip */}
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius-lg)",
            background: isDark ? "rgba(37, 99, 235, 0.08)" : "rgba(37, 99, 235, 0.04)",
            border: "1px solid rgba(37, 99, 235, 0.2)"
          }}
        >
          <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Navigation size={14} />
            <span>Nearby Departure Terminals from Your Current Area</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", fontSize: "0.80rem" }}>
            <div>
              <div style={{ color: "var(--text-muted)" }}>🚆 Railway Terminal:</div>
              <strong style={{ color: "var(--text-primary)" }}>{suddenData.nearbyTerminals.railway[0]?.name}</strong>
              <div style={{ fontSize: "0.74rem", color: "#16A34A" }}>~{suddenData.nearbyTerminals.railway[0]?.travelTimeMins} min away ({suddenData.nearbyTerminals.railway[0]?.distanceKm} km)</div>
            </div>

            <div>
              <div style={{ color: "var(--text-muted)" }}>🚌 Bus Terminal:</div>
              <strong style={{ color: "var(--text-primary)" }}>{suddenData.nearbyTerminals.bus[0]?.name}</strong>
              <div style={{ fontSize: "0.74rem", color: "#16A34A" }}>~{suddenData.nearbyTerminals.bus[0]?.travelTimeMins} min away ({suddenData.nearbyTerminals.bus[0]?.distanceKm} km)</div>
            </div>

            <div>
              <div style={{ color: "var(--text-muted)" }}>✈️ Nearest Airport:</div>
              <strong style={{ color: "var(--text-primary)" }}>{suddenData.nearbyTerminals.airport[0]?.name}</strong>
              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>~{suddenData.nearbyTerminals.airport[0]?.travelTimeMins} min away</div>
            </div>
          </div>
        </div>

        {/* Instant Travel Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {suddenData.instantOptions.map((opt) => (
            <div
              key={opt.id}
              style={{
                padding: "18px",
                borderRadius: "var(--radius-xl)",
                background: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                border: "1.5px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--brand-primary, #2563EB)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {getOptionIcon(opt.iconName)}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <h4 style={{ fontSize: "1.02rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {opt.title}
                      </h4>
                      {opt.badge && (
                        <span
                          style={{
                            fontSize: "0.70rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            background: isDark ? "rgba(220, 38, 38, 0.2)" : "rgba(220, 38, 38, 0.1)",
                            color: opt.badgeColor || "#DC2626",
                            border: "1px solid rgba(220, 38, 38, 0.3)"
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      {opt.operator}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.70rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Est. Total</div>
                  <div style={{ fontSize: "1.20rem", fontWeight: 900, color: "#16A34A" }}>
                    {opt.costFormatted}
                  </div>
                </div>
              </div>

              {/* Timing & Features */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.80rem", color: "var(--text-secondary)", background: isDark ? "rgba(0,0,0,0.2)" : "#FFFFFF", padding: "10px 14px", borderRadius: "var(--radius-md)" }}>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Departure: </span>
                  <strong style={{ color: "var(--text-primary)" }}>{opt.departureTime}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Estimated Arrival: </span>
                  <strong style={{ color: "var(--text-primary)" }}>{opt.estimatedArrival}</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {opt.features?.map((f, i) => (
                  <span key={i} style={{ fontSize: "0.74rem", color: "var(--text-secondary)", background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0", padding: "3px 8px", borderRadius: "var(--radius-sm)" }}>
                    ✓ {f}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectOption?.(opt);
                  onClose();
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: "var(--brand-primary, #2563EB)",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <span>Travel Now via {opt.title.split(" ")[0]}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
