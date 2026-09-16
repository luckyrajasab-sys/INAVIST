import React from "react";
import {
  X,
  Train,
  Bus,
  Plane,
  Car,
  GitFork,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  CreditCard,
  Sparkles,
  Ticket
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const JourneyDetailsModal = ({
  isOpen,
  onClose,
  route,
  travelDate,
  passengers = 1,
  onContinueToBooking
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !route) return null;

  const baseFare = route.price || 650;
  const taxes = Math.round(baseFare * 0.05); // 5% GST on transit
  const convenienceFee = 49;
  const totalAmount = baseFare * passengers + taxes + convenienceFee;

  const sectors = route.sectors || [
    {
      sectorIndex: 1,
      mode: route.mode,
      operator: route.operator || route.name,
      fromLocation: route.fromLocation || route.from || "Origin Terminal",
      toLocation: route.toLocation || route.to || "Destination Terminal",
      departureTime: route.departureTime || "06:30 AM",
      arrivalTime: route.arrivalTime || "01:45 PM",
      duration: route.duration || "7h 15m",
      category: route.category || "Standard AC",
      price: baseFare,
      stops: route.stops || "Direct non-stop service"
    }
  ];

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

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "var(--radius-2xl, 24px)",
          padding: "28px",
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 15, 29, 0.98) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
          border: "1.5px solid var(--border-subtle)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase" }}>
              <Ticket size={14} />
              <span>Journey Details & Sector Breakdown</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.45rem", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0 0" }}>
              {route.operator || route.title}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>📅 {travelDate || "2026-08-30"}</span>
              <span>•</span>
              <span>👥 {passengers} Passenger{passengers > 1 ? "s" : ""}</span>
              <span>•</span>
              <span>⏱️ Total Duration: {route.duration || "6h 30m"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Complete 3-Leg Door-to-Door Journey Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={14} />
            <span>Complete Door-to-Door Journey Chain (3 Legs)</span>
          </div>

          {/* Leg 1: Cab from Home */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "var(--radius-lg, 12px)",
              background: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.06)",
              border: "1.5px solid rgba(37, 99, 235, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Car size={14} />
                </div>
                <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
                  Leg 1: Doorstep Pickup ({route.firstMileSelection?.appName || "Uber / Ola / Rapido"})
                </strong>
              </div>
              <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#16A34A" }}>
                ₹{route.firstMileSelection?.price || 220}
              </span>
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", paddingLeft: "34px" }}>
              Pickup: <strong>{route.pickupLocation || "Home Address"}</strong> ➔ Drop at <strong>{route.departureHub || route.fromLocation || route.from || "Departure Concourse"}</strong> • ~{route.firstMileSelection?.durationFormatted || "25 min"} ({route.firstMileSelection?.pickupWaitFormatted || "3 min wait"})
            </div>
            {route.localTransportSelection && (
              <div style={{ fontSize: "0.72rem", color: "#2563EB", paddingLeft: "34px", fontWeight: 700 }}>
                ✓ Selected Local Mode: {route.localTransportSelection.name} ({route.localTransportSelection.category})
              </div>
            )}
          </div>

          {/* Leg 2: Main Intercity Transit */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "var(--radius-lg, 12px)",
              background: isDark ? "rgba(124, 58, 237, 0.12)" : "rgba(124, 58, 237, 0.06)",
              border: "1.5px solid rgba(124, 58, 237, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {route.mode === "flight" ? <Plane size={14} /> : route.mode === "bus" ? <Bus size={14} /> : route.mode === "cab" ? <Car size={14} /> : <Train size={14} />}
                </div>
                <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
                  Leg 2: Main Transit ({route.mode === "flight" ? "Flight" : route.mode === "bus" ? "Bus Stand Coach" : route.mode === "cab" ? "Highway Cab" : "Railway Express"}) — {route.operator || route.title}
                </strong>
              </div>
              <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary)" }}>
                ₹{(baseFare * passengers).toLocaleString("en-IN")}
              </span>
            </div>

            {/* Departure & Arrival Sub-Card */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: isDark ? "rgba(0,0,0,0.3)" : "#FFFFFF",
                border: "1px solid var(--border-subtle)",
                marginLeft: "34px"
              }}
            >
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>{route.departureTime || "06:30 AM"}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>📍 {route.departureHub || route.fromLocation || route.from || "Origin Hub"}</div>
              </div>

              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700 }}>{route.duration || "6h 30m"}</span>
                <div style={{ width: "50px", height: "2px", background: "var(--border-subtle)", margin: "3px auto" }} />
                <span style={{ fontSize: "0.64rem", color: "#16A34A", fontWeight: 700 }}>{route.stops || "Direct Sector"}</span>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>{route.arrivalTime || "01:45 PM"}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>📍 {route.arrivalHub || route.toLocation || route.to || "Destination Hub"}</div>
              </div>
            </div>
          </div>

          {/* Leg 3: After Deboarding Continuation */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "var(--radius-lg, 12px)",
              background: isDark ? "rgba(234, 88, 12, 0.12)" : "rgba(234, 88, 12, 0.06)",
              border: "1.5px solid rgba(234, 88, 12, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#EA580C", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={14} />
                </div>
                <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>
                  Leg 3: After Deboarding ({route.deboardSelection?.name || "Official Prepaid Taxi / Station Counter"})
                </strong>
              </div>
              <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#16A34A" }}>
                ₹{route.deboardSelection?.price || 350}
              </span>
            </div>
            <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", paddingLeft: "34px" }}>
              From: <strong>{route.arrivalHub || route.toLocation || route.to || "Arrival Station"}</strong> ➔ Drop at: <strong>{route.deboardDropLocation || "Hotel / Stay Doorstep"}</strong> • ~{route.deboardSelection?.durationFormatted || "30 min"} ({route.deboardSelection?.howToBoard || "Prepaid Line outside Exit"})
            </div>
          </div>
        </div>

        {/* Fare Breakdown Card */}
        <div
          style={{
            padding: "16px 20px",
            borderRadius: "var(--radius-xl, 16px)",
            background: isDark ? "rgba(0,0,0,0.2)" : "#F1F5F9",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}
        >
          <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Price Breakdown (Itemized Door-to-Door)
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>1. First-Mile Cab ({route.firstMileSelection?.appName || "Uber / Ola"})</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{route.firstMileSelection?.price || 220}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>2. Main Transit ({passengers} Passenger{passengers > 1 ? "s" : ""})</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{(baseFare * passengers).toLocaleString("en-IN")}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>3. Last-Mile Deboarding ({route.deboardSelection?.name || "Prepaid Taxi"})</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{route.deboardSelection?.price || 350}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>GST & Travel Platform Taxes</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{taxes.toLocaleString("en-IN")}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <span style={{ color: "var(--text-secondary)" }}>Smart Connected Booking Fee</span>
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>₹{convenienceFee}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)", fontSize: "1.05rem" }}>
            <span style={{ fontWeight: 900, color: "var(--text-primary)" }}>Total Complete Doorstep Amount</span>
            <span style={{ fontWeight: 900, color: "#16A34A", fontSize: "1.25rem" }}>
              ₹{((route.firstMileSelection?.price || 220) + (baseFare * passengers) + (route.deboardSelection?.price || 350) + taxes + convenienceFee).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Cancellation & Travel Instructions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.76rem", color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
            <ShieldCheck size={14} style={{ color: "#16A34A", marginTop: "2px", flexShrink: 0 }} />
            <span><strong>Cancellation Policy:</strong> {route.cancellationPolicy || "Free cancellation up to 4 hours before departure with 100% refund minus clerkage fee."}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
            <Info size={14} style={{ color: "#2563EB", marginTop: "2px", flexShrink: 0 }} />
            <span><strong>Important Instructions:</strong> Please carry original government ID during transit. E-Ticket on your smartphone is accepted by all Indian transit inspectors.</span>
          </div>
        </div>

        {/* CTA: Continue to Booking */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "6px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "12px 24px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onContinueToBooking) onContinueToBooking(route);
            }}
            style={{
              padding: "12px 32px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 900,
              fontSize: "0.96rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
              cursor: "pointer"
            }}
          >
            <span>Continue to Booking</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
