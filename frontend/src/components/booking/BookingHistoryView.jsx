import React, { useState, useEffect } from "react";
import {
  Ticket,
  Train,
  Bus,
  Plane,
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Search,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  AlertCircle,
  X,
  FileText
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { usePlanner } from "../../context/PlannerContext";
import { FirestoreService } from "../../services/FirestoreService";
import { api } from "../../api/client";

const SAMPLE_INITIAL_BOOKINGS = [
  {
    id: "bkg-1",
    bookingId: "INV-28451",
    pnr: "PNR-49210482",
    originCity: "Chennai",
    destinationCity: "Bengaluru",
    travelDate: "2026-08-30",
    type: "train",
    operator: "Vande Bharat Express (20601)",
    category: "AC Chair Car (CC)",
    departureTime: "06:00 AM",
    arrivalTime: "10:30 AM",
    duration: "4h 30m",
    amount: 650,
    paymentStatus: "VERIFIED",
    paymentMethod: "UPI (traveller@okhdfcbank)",
    rewardPointsEarned: 65,
    status: "Confirmed",
    passengers: [{ name: "Dr. Rajesh Kumar", age: 32, seatNumber: "14A" }]
  },
  {
    id: "bkg-2",
    bookingId: "INV-71934",
    pnr: "PNR-88192031",
    originCity: "Chennai",
    destinationCity: "Goa",
    travelDate: "2026-09-12",
    type: "flight",
    operator: "IndiGo 6E-2415",
    category: "Economy Saver",
    departureTime: "07:15 AM",
    arrivalTime: "09:05 AM",
    duration: "1h 50m",
    amount: 4100,
    paymentStatus: "VERIFIED",
    paymentMethod: "UPI (Dynamic QR)",
    rewardPointsEarned: 328,
    status: "Confirmed",
    passengers: [{ name: "Dr. Rajesh Kumar", age: 32, seatNumber: "6F" }]
  },
  {
    id: "bkg-3",
    bookingId: "INV-19042",
    pnr: "PNR-11029481",
    originCity: "Chennai",
    destinationCity: "Kodaikanal",
    travelDate: "2026-07-15",
    type: "bus",
    operator: "IntrCity AC Multi-Axle Sleeper",
    category: "AC Sleeper Lower Berth",
    departureTime: "09:30 PM",
    arrivalTime: "06:30 AM (+1)",
    duration: "9h 00m",
    amount: 1100,
    paymentStatus: "VERIFIED",
    paymentMethod: "UPI (Google Pay)",
    rewardPointsEarned: 66,
    status: "Completed",
    passengers: [{ name: "Dr. Rajesh Kumar", age: 32, seatNumber: "L4" }]
  }
];

export const BookingHistoryView = ({ onSelectDestination, onStartNewSearch }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("inavist_all_bookings");
    return saved ? JSON.parse(saved) : SAMPLE_INITIAL_BOOKINGS;
  });

  // Firestore Real-Time Bookings Subscription
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    const unsubscribe = FirestoreService.subscribeUserBookings(
      user.id,
      (cloudBookings) => {
        setLoading(false);
        if (cloudBookings && cloudBookings.length > 0) {
          const normalized = cloudBookings.map((b) => ({
            id: b.id,
            bookingId: b.id ? `INV-${b.id.slice(-5).toUpperCase()}` : b.bookingId || "INV-CONF",
            pnr: b.pnr || `PNR-${Math.floor(10000000 + Math.random() * 90000000)}`,
            originCity: b.originCity || "Origin",
            destinationCity: b.destinationCity || "Destination",
            travelDate: b.travelDate || new Date().toISOString().split("T")[0],
            type: b.type || "train",
            operator: b.title || b.operator || "Indian Transit Network",
            category: b.category || "Reserved Standard",
            departureTime: b.departureTime || "08:00 AM",
            arrivalTime: b.arrivalTime || "04:30 PM",
            duration: b.duration || "8h 30m",
            amount: b.pricing?.totalAmount || b.amount || 650,
            paymentStatus: b.paymentDetails?.status || b.paymentStatus || "VERIFIED",
            paymentMethod: b.paymentDetails?.method || b.paymentMethod || "UPI (Direct)",
            rewardPointsEarned: b.rewardPointsEarned || Math.floor((b.amount || 650) * 0.08),
            status: b.status || "Confirmed",
            passengers: b.passengers || [{ name: user.name || "Traveller", age: 28, seatNumber: "Confirmed" }]
          }));

          setBookings((prev) => {
            const cloudIds = new Set(normalized.map((nb) => nb.id));
            const localOnly = prev.filter((b) => !cloudIds.has(b.id));
            const merged = [...normalized, ...localOnly];
            try {
              localStorage.setItem("inavist_all_bookings", JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      },
      (err) => {
        setLoading(false);
        console.warn("Firestore bookings sync notice:", err);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]);

  useEffect(() => {
    api.bookings.getAll().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setBookings((prev) => {
          const ids = new Set(res.data.map((b) => b.bookingId || b.pnr || b._id));
          const localOnly = prev.filter((b) => !ids.has(b.bookingId || b.pnr || b.id));
          const merged = [...res.data, ...localOnly];
          localStorage.setItem("inavist_all_bookings", JSON.stringify(merged));
          return merged;
        });
      }
    }).catch((err) => {
      console.warn("Could not fetch server bookings:", err);
    });
  }, []);

  const { cancelBooking, showToast } = usePlanner();
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancelBooking = async (bkg) => {
    const bId = bkg.id || bkg.bookingId;
    if (!window.confirm(`Are you sure you want to cancel booking #${bkg.bookingId || bId}?`)) {
      return;
    }
    setCancellingId(bId);
    try {
      await cancelBooking(bId);
      setBookings((prev) =>
        prev.map((b) => (b.id === bId || b.bookingId === bId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.warn("Cancel booking error:", err);
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter(
    (b) => filterType === "all" || b.type === filterType || (filterType === "active" && b.status === "Confirmed")
  );

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
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        padding: "16px 24px 80px",
        maxWidth: "1240px",
        margin: "0 auto",
        width: "100%"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase" }}>
            <Ticket size={14} />
            <span>My Verified Trips & Tickets</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0 0" }}>
            Booking History & E-Tickets
          </h1>
        </div>

        <button
          type="button"
          onClick={onStartNewSearch}
          style={{
            padding: "10px 22px",
            borderRadius: "var(--radius-xl, 14px)",
            background: "var(--brand-primary, #2563EB)",
            color: "#FFFFFF",
            border: "none",
            fontWeight: 800,
            fontSize: "0.86rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
          }}
        >
          <Search size={16} />
          <span>Book New Journey</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { id: "all", label: "All Bookings" },
          { id: "active", label: "Upcoming / Confirmed" },
          { id: "train", label: "Trains" },
          { id: "bus", label: "Buses" },
          { id: "flight", label: "Flights" },
          { id: "cab", label: "Cabs" }
        ].map((tab) => {
          const isSelected = filterType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: "7px 16px",
                borderRadius: "var(--radius-full, 9999px)",
                border: "1px solid",
                borderColor: isSelected ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                background: isSelected ? "var(--brand-primary, #2563EB)" : "var(--bg-tertiary)",
                color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: isSelected ? 800 : 600,
                fontSize: "0.80rem",
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredBookings.length === 0 ? (
          <div
            className="glass-card"
            style={{
              borderRadius: "var(--radius-xl, 18px)",
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <Ticket size={40} color="var(--text-muted)" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              No bookings found in this category
            </h3>
            <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", margin: 0 }}>
              Search for travel sectors and complete your booking with UPI.
            </p>
          </div>
        ) : (
          filteredBookings.map((bkg) => {
            const Icon = getModeIcon(bkg.type);
            const isCancelled = bkg.status?.toLowerCase() === "cancelled";
            return (
              <div
                key={bkg.id || bkg.bookingId}
                className="glass-card"
                style={{
                  borderRadius: "var(--radius-xl, 18px)",
                  padding: "22px 26px",
                  border: "1.5px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF",
                  opacity: isCancelled ? 0.7 : 1
                }}
              >
                {/* Top Strip */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isCancelled ? "rgba(220,38,38,0.15)" : "rgba(37, 99, 235, 0.15)",
                        color: isCancelled ? "#DC2626" : "#2563EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <div style={{ fontSize: "0.96rem", fontWeight: 900, color: "var(--text-primary)" }}>
                        Booking #{bkg.bookingId}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        PNR: <strong>{bkg.pnr}</strong> • {bkg.operator}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full, 9999px)",
                        background: isCancelled
                          ? "rgba(220,38,38,0.15)"
                          : bkg.status === "Confirmed"
                          ? "rgba(22,163,74,0.15)"
                          : "var(--bg-tertiary)",
                        color: isCancelled
                          ? "#DC2626"
                          : bkg.status === "Confirmed"
                          ? "#16A34A"
                          : "var(--text-muted)",
                        fontSize: "0.74rem",
                        fontWeight: 800
                      }}
                    >
                      {bkg.status}
                    </span>

                    {!isCancelled && (
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full, 9999px)",
                          background: "rgba(234, 88, 12, 0.12)",
                          color: "#EA580C",
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Sparkles size={11} />
                        <span>+{bkg.rewardPointsEarned || 50} Points</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Route specs */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-lg, 12px)",
                    background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                    border: "1px solid var(--border-subtle)"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "1.10rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {bkg.departureTime || "06:30 AM"}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>📍 {bkg.originCity}</div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "0.70rem", color: "var(--text-muted)", fontWeight: 700 }}>{bkg.duration || "4h 30m"}</span>
                    <div style={{ width: "70px", height: "2px", background: isCancelled ? "#DC2626" : "var(--brand-primary, #2563EB)", margin: "4px auto" }} />
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{bkg.travelDate}</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.10rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {bkg.arrivalTime || "11:00 AM"}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>📍 {bkg.destinationCity}</div>
                  </div>
                </div>

                {/* Bottom details & Download / Cancel Action */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", paddingTop: "4px" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Amount Paid: <strong style={{ color: "#16A34A", fontSize: "0.96rem" }}>₹{bkg.amount}</strong> via {bkg.paymentMethod || "Verified UPI"}
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForModal(bkg)}
                      style={{
                        padding: "7px 12px",
                        borderRadius: "var(--radius-lg, 10px)",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <FileText size={13} />
                      <span>View Details</span>
                    </button>

                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(bkg)}
                        disabled={cancellingId === (bkg.id || bkg.bookingId)}
                        style={{
                          padding: "7px 12px",
                          borderRadius: "var(--radius-lg, 10px)",
                          background: "rgba(220,38,38,0.1)",
                          border: "1px solid rgba(220,38,38,0.25)",
                          color: "#DC2626",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          cursor: cancellingId === (bkg.id || bkg.bookingId) ? "not-allowed" : "pointer",
                          opacity: cancellingId === (bkg.id || bkg.bookingId) ? 0.6 : 1
                        }}
                      >
                        {cancellingId === (bkg.id || bkg.bookingId) ? "Cancelling..." : "Cancel Booking"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{
                        padding: "7px 14px",
                        borderRadius: "var(--radius-lg, 10px)",
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Download size={13} />
                      <span>Download Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBookingForModal && (
        <div
          className="modal-backdrop animate-fade-in"
          onClick={() => setSelectedBookingForModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999
          }}
        >
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: "100%",
              maxWidth: "540px",
              background: "var(--bg-card-solid)",
              padding: "28px",
              borderRadius: "var(--radius-xl, 18px)",
              position: "relative",
              boxShadow: "var(--shadow-xl)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBookingForModal(null)}
              className="btn-ghost"
              style={{ position: "absolute", top: "16px", right: "16px", padding: "6px" }}
            >
              <X size={20} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-primary, #2563EB)", fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase", marginBottom: "6px" }}>
              <Ticket size={16} /> Official Transit E-Ticket
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 900, margin: "0 0 16px" }}>
              Booking #{selectedBookingForModal.bookingId}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.86rem" }}>
              <div style={{ padding: "12px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>PNR</span>
                <strong>{selectedBookingForModal.pnr}</strong>
              </div>
              <div style={{ padding: "12px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Operator / Carrier</span>
                <strong>{selectedBookingForModal.operator}</strong>
              </div>
              <div style={{ padding: "12px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Route</span>
                <strong>{selectedBookingForModal.originCity} ➔ {selectedBookingForModal.destinationCity}</strong>
              </div>
              <div style={{ padding: "12px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Travel Date</span>
                <strong>{selectedBookingForModal.travelDate}</strong>
              </div>
              <div style={{ padding: "12px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Status</span>
                <strong style={{ color: selectedBookingForModal.status === "Confirmed" ? "#16A34A" : selectedBookingForModal.status === "cancelled" ? "#DC2626" : "var(--text-primary)" }}>
                  {selectedBookingForModal.status}
                </strong>
              </div>
              <div style={{ padding: "12px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Total Paid</span>
                <strong style={{ color: "#16A34A", fontSize: "1.1rem" }}>₹{selectedBookingForModal.amount}</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedBookingForModal(null)}
              className="btn-primary"
              style={{ width: "100%", height: "42px", marginTop: "20px" }}
            >
              Close Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
