import React, { useState } from "react";
import {
  X,
  User,
  Ticket,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Calendar,
  Clock,
  Train,
  Plane,
  Bus,
  Car,
  AlertCircle
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRewards } from "../../context/RewardsContext";
import { UPIPaymentSection } from "./UPIPaymentSection";

export const MultiStepBookingModal = ({
  isOpen,
  onClose,
  route,
  travelDate,
  initialPassengers = 1,
  onBookingConfirmed
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { totalPoints, availableCoupons } = useRewards();

  // Current Step: 1 = Journey, 2 = Passenger Details, 3 = Seat / Class, 4 = Review & Fare, 5 = Payment
  const [currentStep, setCurrentStep] = useState(1);

  // Passengers State
  const [passengerCount, setPassengerCount] = useState(initialPassengers || 1);
  const [passengers, setPassengers] = useState([
    {
      id: 1,
      name: user?.name || "Dr. Rajesh Kumar",
      age: 32,
      gender: "Male",
      mobile: user?.phone || "+91 98450 12345",
      email: user?.email || "rajesh.kumar@example.com",
      idType: "Aadhaar",
      idNumber: "4589 1234 8921",
      seatPreference: "Window / Lower Berth",
      seatNumber: "14A"
    }
  ]);

  // Selected Class & Seat Details
  const [selectedClass, setSelectedClass] = useState(
    route?.classes?.[0]?.className || route?.category || "Standard Class"
  );
  const [selectedBerthPreference, setSelectedBerthPreference] = useState("Lower Berth");
  const [selectedSeatChoice, setSelectedSeatChoice] = useState("14A");

  // Reward Discount Selection
  const [selectedDiscountCoupon, setSelectedDiscountCoupon] = useState(null);

  // Form Validation
  const [validationError, setValidationError] = useState(null);

  if (!isOpen || !route) return null;

  const firstMileFee = route.firstMileSelection?.price || 0;
  const deboardFee = route.deboardSelection?.price || 0;
  const baseFare = route.price || 650;
  const taxes = Math.round(baseFare * 0.05 * passengerCount);
  const convenienceFee = 49;
  const discountAmount = selectedDiscountCoupon?.discountValue || 0;
  const finalPayable = Math.max(0, baseFare * passengerCount + firstMileFee + deboardFee + taxes + convenienceFee - discountAmount);

  const handleAddPassenger = () => {
    if (passengers.length >= 6) return;
    const newPax = {
      id: Date.now(),
      name: "",
      age: 25,
      gender: "Female",
      mobile: passengers[0]?.mobile || "+91 98765 43210",
      email: passengers[0]?.email || "traveller@example.com",
      idType: "Aadhaar",
      idNumber: "",
      seatPreference: "Window",
      seatNumber: `1${passengers.length + 4}B`
    };
    setPassengers([...passengers, newPax]);
    setPassengerCount(passengers.length + 1);
  };

  const handleRemovePassenger = (id) => {
    if (passengers.length <= 1) return;
    const filtered = passengers.filter((p) => p.id !== id);
    setPassengers(filtered);
    setPassengerCount(filtered.length);
  };

  const handlePassengerChange = (id, field, val) => {
    setPassengers(
      passengers.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
    setValidationError(null);
  };

  const handleValidateStep2 = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.name.trim()) {
        setValidationError(`Please enter passenger ${i + 1}'s full name.`);
        return false;
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        setValidationError(`Please enter a valid age for passenger ${i + 1}.`);
        return false;
      }
      if (!p.idNumber || !p.idNumber.trim()) {
        setValidationError(`Please enter ${p.idType} number for passenger ${i + 1}.`);
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      if (!handleValidateStep2()) return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setValidationError(null);
  };

  const handlePaymentCompleted = (paymentReceipt) => {
    // Mask IDs before passing to confirmation
    const maskedPassengers = passengers.map((p) => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      idType: p.idType,
      idNumberMasked: `XXXX-XXXX-${(p.idNumber || "8921").slice(-4)}`,
      seatNumber: selectedSeatChoice,
      berthPreference: selectedBerthPreference
    }));

    if (onBookingConfirmed) {
      onBookingConfirmed({
        route,
        travelDate: travelDate || "2026-08-30",
        passengers: maskedPassengers,
        passengerCount,
        selectedClass,
        pricing: {
          baseFare: baseFare * passengerCount,
          taxes,
          convenienceFee,
          discountAmount,
          totalAmount: finalPayable
        },
        paymentReceipt
      });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "800px",
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: "var(--radius-2xl, 24px)",
          padding: "28px",
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 29, 0.98) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
          border: "1.5px solid var(--border-subtle)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Steps Breadcrumb */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase" }}>
              Step {currentStep} of 5 • {currentStep === 1 ? "Journey Review" : currentStep === 2 ? "Passenger Details" : currentStep === 3 ? "Seat & Class" : currentStep === 4 ? "Fare Review" : "UPI Payment"}
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", margin: "2px 0 0" }}>
              {currentStep === 1 && "Confirm Your Selected Journey"}
              {currentStep === 2 && "Enter Passenger Information"}
              {currentStep === 3 && "Select Seats, Berths & Class"}
              {currentStep === 4 && "Review Booking & Apply Rewards"}
              {currentStep === 5 && "Complete UPI Payment"}
            </h2>
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

        {/* Stepper Progress Bar */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: "5px",
                borderRadius: "3px",
                background: s <= currentStep ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                transition: "background 0.3s ease"
              }}
            />
          ))}
        </div>

        {/* Validation Banner */}
        {validationError && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(220, 38, 38, 0.12)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              color: "#DC2626",
              fontSize: "0.82rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: JOURNEY SUMMARY */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                padding: "18px 20px",
                borderRadius: "var(--radius-xl, 16px)",
                background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                border: "1.5px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.10rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {route.operator || route.title}
                </span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, padding: "3px 10px", borderRadius: "var(--radius-full, 9999px)", background: "rgba(37,99,235,0.12)", color: "#2563EB" }}>
                  {route.category || "AC Service"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>{route.departureTime}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>📍 {route.fromLocation || route.from}</div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)" }}>{route.duration}</span>
                  <div style={{ width: "80px", height: "2px", background: "var(--border-subtle)", margin: "4px auto" }} />
                  <span style={{ fontSize: "0.68rem", color: "#16A34A", fontWeight: 700 }}>Direct Sector</span>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>{route.arrivalTime}</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>📍 {route.toLocation || route.to}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)", fontSize: "0.78rem" }}>
                <span>Travel Date: <strong>{travelDate || "2026-08-30"}</strong></span>
                <span>Base Transit Fare: <strong style={{ color: "#16A34A" }}>₹{baseFare} / pax</strong></span>
              </div>
            </div>

            {/* End-to-End Legs Breakdown in Booking Modal */}
            {(route.firstMileSelection || route.deboardSelection) && (
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--radius-xl, 16px)",
                  background: isDark ? "rgba(37,99,235,0.12)" : "rgba(239,246,255,0.9)",
                  border: "1.5px solid rgba(37,99,235,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
                  Door-to-Door Connected Inclusions
                </div>
                {route.firstMileSelection && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.80rem" }}>
                    <div>
                      <span>🚕 Leg 1: <strong>{route.firstMileSelection.appName}</strong> ({route.firstMileSelection.durationFormatted})</span>
                      <div style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>
                        {route.pickupLocation || "Home"} ➔ {route.departureHub || route.fromLocation || route.from}
                      </div>
                    </div>
                    <strong style={{ color: "#16A34A" }}>₹{route.firstMileSelection.price}</strong>
                  </div>
                )}
                {route.deboardSelection && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.80rem" }}>
                    <div>
                      <span>🏨 Leg 3: <strong>{route.deboardSelection.name}</strong> ({route.deboardSelection.durationFormatted})</span>
                      <div style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>
                        {route.arrivalHub || route.toLocation || route.to} ➔ {route.deboardDropLocation || "Hotel Stay"}
                      </div>
                    </div>
                    <strong style={{ color: "#16A34A" }}>₹{route.deboardSelection.price}</strong>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <ShieldCheck size={16} color="#16A34A" />
              <span>Free instant cancellation available up to 4 hours prior to departure.</span>
            </div>
          </div>
        )}

        {/* STEP 2: PASSENGER DETAILS */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
                Total Passengers: {passengers.length} (Max 6)
              </span>
              <button
                type="button"
                onClick={handleAddPassenger}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full, 9999px)",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  color: "#2563EB",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  cursor: "pointer"
                }}
              >
                + Add Passenger
              </button>
            </div>

            {passengers.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-xl, 16px)",
                  background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    Passenger #{idx + 1}
                  </span>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePassenger(p.id)}
                      style={{ background: "none", border: "none", color: "#DC2626", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Full Name</label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => handlePassengerChange(p.id, "name", e.target.value)}
                      placeholder="As per Aadhaar/Govt ID"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.2)" : "#FFFFFF",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Age</label>
                    <input
                      type="number"
                      min="1"
                      max="110"
                      value={p.age}
                      onChange={(e) => handlePassengerChange(p.id, "age", Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.2)" : "#FFFFFF",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Gender</label>
                    <select
                      value={p.gender}
                      onChange={(e) => handlePassengerChange(p.id, "gender", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "#0F172A" : "#FFFFFF",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        fontWeight: 600
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>ID Type</label>
                    <select
                      value={p.idType}
                      onChange={(e) => handlePassengerChange(p.id, "idType", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "#0F172A" : "#FFFFFF",
                        color: "var(--text-primary)",
                        fontSize: "0.86rem",
                        fontWeight: 600
                      }}
                    >
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>ID Number (Encrypted & Masked)</label>
                    <input
                      type="text"
                      value={p.idNumber}
                      onChange={(e) => handlePassengerChange(p.id, "idNumber", e.target.value)}
                      placeholder="e.g. 4589 1234 8921"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.2)" : "#FFFFFF",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: SEAT / CLASS SELECTION */}
        {currentStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Available Classes */}
            <div>
              <label style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
                Select Travel Class / Coach
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                {(route.classes && route.classes.length > 0
                  ? route.classes
                  : [
                      { className: "AC Chair Car (CC)", price: baseFare },
                      { className: "Executive Class (EC)", price: Math.round(baseFare * 1.5) }
                    ]
                ).map((cls, idx) => {
                  const isSelected = selectedClass === cls.className;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedClass(cls.className)}
                      style={{
                        padding: "14px",
                        borderRadius: "var(--radius-lg, 12px)",
                        border: `2px solid ${isSelected ? "#2563EB" : "var(--border-subtle)"}`,
                        background: isSelected ? (isDark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.08)") : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                      }}
                    >
                      <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {cls.className}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#16A34A", fontWeight: 700 }}>
                        ₹{cls.price} / seat
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Berth / Seat Preference */}
            <div>
              <label style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
                Berth / Seat Location Preference
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Lower Berth", "Upper Berth", "Side Lower", "Window Seat", "Aisle Seat"].map((b) => {
                  const isSel = selectedBerthPreference === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBerthPreference(b)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "var(--radius-full, 9999px)",
                        border: `1.5px solid ${isSel ? "#2563EB" : "var(--border-subtle)"}`,
                        background: isSel ? (isDark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.1)") : "transparent",
                        color: isSel ? "#2563EB" : "var(--text-secondary)",
                        fontWeight: isSel ? 800 : 600,
                        fontSize: "0.80rem",
                        cursor: "pointer"
                      }}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Seat Matrix Simulation */}
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--radius-xl, 16px)",
                background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-muted)", marginBottom: "10px" }}>
                Select Seat Number (Coach C1)
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["12A", "12B", "14A (Selected)", "14B", "15A", "15B", "18A", "18B"].map((seat) => {
                  const isSel = selectedSeatChoice === seat.split(" ")[0];
                  return (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => setSelectedSeatChoice(seat.split(" ")[0])}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: `1.5px solid ${isSel ? "#16A34A" : "var(--border-subtle)"}`,
                        background: isSel ? "#16A34A" : "var(--bg-tertiary)",
                        color: isSel ? "#FFFFFF" : "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        cursor: "pointer"
                      }}
                    >
                      💺 {seat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & FARE BREAKDOWN */}
        {currentStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Journey & Passengers Quick Summary */}
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--radius-xl, 16px)",
                background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ fontSize: "0.96rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {route.operator || route.title}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {route.fromLocation || route.from} ➔ {route.toLocation || route.to} • {travelDate}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                Passengers: {passengers.map((p) => p.name).join(", ")} • Seat {selectedSeatChoice} ({selectedClass})
              </div>
            </div>

            {/* Redeem INAVIST Reward Points Section */}
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--radius-xl, 16px)",
                background: isDark ? "rgba(37,99,235,0.12)" : "rgba(239,246,255,0.9)",
                border: "1.5px solid rgba(37,99,235,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 800, color: "#2563EB" }}>
                  <Sparkles size={16} />
                  <span>INAVIST Rewards & Points ({totalPoints} Pts Available)</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedDiscountCoupon(
                      selectedDiscountCoupon?.code === "TRAVEL100"
                        ? null
                        : { code: "TRAVEL100", discountValue: 100, pointsCost: 500 }
                    )
                  }
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full, 9999px)",
                    border: `1.5px solid ${selectedDiscountCoupon?.code === "TRAVEL100" ? "#16A34A" : "var(--border-subtle)"}`,
                    background: selectedDiscountCoupon?.code === "TRAVEL100" ? "rgba(22,163,74,0.18)" : "var(--bg-tertiary)",
                    color: selectedDiscountCoupon?.code === "TRAVEL100" ? "#16A34A" : "var(--text-primary)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Use 500 Points for ₹100 Off
                </button>
              </div>
            </div>

            {/* Final Price Breakdown */}
            <div
              style={{
                padding: "16px",
                borderRadius: "var(--radius-xl, 16px)",
                background: isDark ? "rgba(0,0,0,0.2)" : "#F1F5F9",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                <span>Base Transit Fare ({passengerCount} Pax)</span>
                <span style={{ fontWeight: 700 }}>₹{(baseFare * passengerCount).toLocaleString("en-IN")}</span>
              </div>
              {firstMileFee > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                  <span>1. First-Mile Cab ({route.firstMileSelection?.appName || "Cab from Home"})</span>
                  <span style={{ fontWeight: 700 }}>₹{firstMileFee}</span>
                </div>
              )}
              {deboardFee > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                  <span>3. Last-Mile Deboarding ({route.deboardSelection?.name || "Prepaid Taxi"})</span>
                  <span style={{ fontWeight: 700 }}>₹{deboardFee}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                <span>Taxes & GST</span>
                <span style={{ fontWeight: 700 }}>₹{taxes}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                <span>Convenience Fee</span>
                <span style={{ fontWeight: 700 }}>₹{convenienceFee}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", color: "#16A34A" }}>
                  <span>Reward Points Discount</span>
                  <span style={{ fontWeight: 800 }}>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)", fontSize: "1.10rem" }}>
                <span style={{ fontWeight: 900 }}>Final Payable Amount</span>
                <span style={{ fontWeight: 900, color: "#16A34A", fontSize: "1.30rem" }}>₹{finalPayable.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: UPI PAYMENT SECTION */}
        {currentStep === 5 && (
          <UPIPaymentSection
            amount={finalPayable}
            bookingId={`INV-${Math.floor(100000 + Math.random() * 900000)}`}
            onPaymentSuccess={handlePaymentCompleted}
            onPaymentFailure={(err) => setValidationError(err?.message || "Payment failed. Please retry.")}
          />
        )}

        {/* Navigation Actions */}
        {currentStep < 5 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: "10px 20px",
                  borderRadius: "var(--radius-xl, 14px)",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              style={{
                padding: "12px 30px",
                borderRadius: "var(--radius-xl, 14px)",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 900,
                fontSize: "0.94rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)"
              }}
            >
              <span>{currentStep === 4 ? "Proceed to UPI Payment" : "Next Step"}</span>
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
