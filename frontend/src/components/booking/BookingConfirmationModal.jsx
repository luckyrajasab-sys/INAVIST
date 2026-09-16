import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Download,
  Ticket,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Printer,
  QrCode,
  ShieldCheck,
  Building,
  Car
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { getPackagesForDestination } from "../../data/travelPackagesData";
import { DestinationPackageCard } from "../rewards/DestinationPackageCard";

export const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onBack,
  bookingData,
  onViewBookingHistory,
  onExploreDestination,
  onBookPackage
}) => {
  const { isDark } = useTheme();
  const ticketRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Handle browser back button seamlessly
      const handlePopState = () => {
        if (onBack) {
          onBack();
        } else {
          onClose();
        }
      };
      window.history.pushState({ modal: "booking-confirmation" }, "");
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isOpen, onBack, onClose]);

  if (!isOpen || !bookingData) return null;

  const {
    route = {},
    travelDate = "2026-08-30",
    passengers = [],
    pricing = {},
    paymentReceipt = {}
  } = bookingData;

  const bookingId = paymentReceipt.bookingId || `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const pnr = `PNR-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const amountPaid = pricing.totalAmount || paymentReceipt.amountPaid || 1250;
  const pointsEarned = Math.max(50, Math.round(amountPaid * 0.08));

  const destinationName = route.toLocation || route.to || "Goa";
  const recommendedPackages = getPackagesForDestination(destinationName);

  const handlePrintTicket = () => {
    window.print();
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        overflowY: "auto"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "840px",
          maxHeight: "94vh",
          overflowY: "auto",
          borderRadius: "var(--radius-2xl, 24px)",
          padding: "28px",
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 29, 0.98) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
          border: "1.5px solid var(--border-subtle)",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.6)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Strip: ← Back Button & Close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleGoBack}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              fontWeight: 800,
              fontSize: "0.84rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}
          >
            <ArrowLeft size={16} />
            <span>← Back</span>
          </button>

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
        {/* Confirmed Celebration Header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(22, 163, 74, 0.45)"
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              margin: 0
            }}
          >
            Booking Confirmed!
          </h2>

          <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            Booking ID: <strong style={{ color: "var(--brand-primary, #2563EB)" }}>#{bookingId}</strong> • PNR: <strong style={{ color: "var(--text-primary)" }}>{pnr}</strong>
          </div>

          {/* Reward Points Earned Banner */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)",
              border: "1.5px solid rgba(234, 88, 12, 0.35)",
              color: "#EA580C",
              fontWeight: 800,
              fontSize: "0.90rem",
              marginTop: "4px"
            }}
          >
            <Sparkles size={16} />
            <span>You earned +{pointsEarned} INAVIST Travel Points!</span>
          </div>
        </div>

        {/* Printable Digital E-Ticket Card */}
        <div
          ref={ticketRef}
          style={{
            borderRadius: "var(--radius-xl, 18px)",
            padding: "20px 24px",
            background: isDark ? "#0F172A" : "#FFFFFF",
            border: "1.5px dashed var(--border-subtle)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          {/* Ticket Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
            <div>
              <span style={{ fontSize: "0.70rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                INAVIST Official Travel E-Ticket
              </span>
              <div style={{ fontSize: "1.10rem", fontWeight: 900, color: "var(--text-primary)" }}>
                {route.operator || route.title}
              </div>
            </div>

            {/* QR Code Graphic */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#000000",
                  color: "#FFFFFF",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <QrCode size={30} />
              </div>
            </div>
          </div>

          {/* Sector & Route Spec */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "10px" }}>
            <div>
              <div style={{ fontSize: "1.20rem", fontWeight: 900, color: "var(--text-primary)" }}>{route.departureTime || "06:30 AM"}</div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 600 }}>📍 {route.fromLocation || route.from}</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "0.70rem", color: "var(--text-muted)", fontWeight: 700 }}>{route.duration || "6h 30m"}</span>
              <div style={{ width: "70px", height: "2px", background: "var(--brand-primary, #2563EB)", margin: "4px auto" }} />
              <span style={{ fontSize: "0.66rem", color: "#16A34A", fontWeight: 700 }}>Confirmed Run</span>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.20rem", fontWeight: 900, color: "var(--text-primary)" }}>{route.arrivalTime || "01:00 PM"}</div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 600 }}>📍 {route.toLocation || route.to}</div>
            </div>
          </div>

          {/* Passenger Names & Seats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
            <div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Passengers</span>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {passengers.map((p) => p.name).join(", ") || "Verified Traveller"}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Travel Date & Class</span>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {travelDate} • {route.category || "AC Service"}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Amount Paid (Verified UPI)</span>
              <div style={{ fontSize: "0.96rem", fontWeight: 900, color: "#16A34A" }}>
                ₹{amountPaid.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handlePrintTicket}
            style={{
              flex: 1,
              minWidth: "160px",
              padding: "12px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              fontWeight: 800,
              fontSize: "0.86rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Download size={16} />
            <span>Download Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onViewBookingHistory) onViewBookingHistory();
            }}
            style={{
              flex: 1,
              minWidth: "160px",
              padding: "12px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "var(--brand-primary, #2563EB)",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 800,
              fontSize: "0.86rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
            }}
          >
            <Ticket size={16} />
            <span>View All Bookings</span>
          </button>
        </div>

        {/* Recommended Destination Packages */}
        {recommendedPackages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#EA580C", textTransform: "uppercase" }}>
                  Plan Your Stay
                </span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.20rem", fontWeight: 800, color: "var(--text-primary)", margin: "2px 0 0" }}>
                  Recommended {destinationName} Packages
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onExploreDestination) onExploreDestination(destinationName);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  fontSize: "0.80rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px"
                }}
              >
                <span>Explore Destination</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              {recommendedPackages.slice(0, 2).map((pkg) => (
                <DestinationPackageCard
                  key={pkg.id}
                  packageData={pkg}
                  onBookPackage={() => {
                    onClose();
                    if (onBookPackage) onBookPackage(pkg);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
