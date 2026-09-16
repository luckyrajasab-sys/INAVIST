import React, { useState, useEffect } from "react";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Lock,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { PaymentService } from "../../services/PaymentService";

export const UPIPaymentSection = ({
  amount = 1250,
  bookingId = "INV-28451",
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const { isDark } = useTheme();

  // Mode: 'qr' | 'upi_id' | 'apps'
  const [paymentMode, setPaymentMode] = useState("upi_id");

  // UPI ID input state
  const [upiId, setUpiId] = useState("");
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiValidationResult, setUpiValidationResult] = useState(null);
  const [upiError, setUpiError] = useState(null);

  // Selected App
  const [selectedApp, setSelectedApp] = useState("gpay");

  // Payment Status: 'idle' | 'processing' | 'verified' | 'failed'
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [transactionId, setTransactionId] = useState(null);

  // QR Timer countdown (300 seconds = 5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  const handleVerifyUPI = async () => {
    if (!upiId || !upiId.trim()) {
      setUpiError("Please enter a valid UPI ID (e.g. yourname@okhdfcbank).");
      return;
    }

    setIsVerifyingUpi(true);
    setUpiError(null);

    try {
      const result = await PaymentService.validateUPIId(upiId);
      if (result.isValid) {
        setUpiValidationResult(result);
        setUpiError(null);
      } else {
        setUpiValidationResult(null);
        setUpiError(result.message || "Invalid UPI ID.");
      }
    } catch (err) {
      setUpiError("Verification failed. Please check your connection.");
    } finally {
      setIsVerifyingUpi(false);
    }
  };

  const handlePayNow = async () => {
    if (paymentMode === "upi_id" && !upiValidationResult?.isValid) {
      // Auto verify if not clicked yet
      const res = await PaymentService.validateUPIId(upiId);
      if (!res.isValid) {
        setUpiError(res.message);
        return;
      }
      setUpiValidationResult(res);
    }

    setPaymentStatus("processing");

    // Secure server-side verification abstraction
    try {
      const result = await PaymentService.verifyUPIPayment({
        bookingId,
        amount,
        upiId: paymentMode === "upi_id" ? upiId : `${selectedApp}@upi`,
        transactionId: `UPI/INV/${new Date().getFullYear()}/${Math.floor(100000000 + Math.random() * 900000000)}`
      });

      if (result.success && result.status === "VERIFIED") {
        setTransactionId(result.transactionId);
        setPaymentStatus("verified");

        setTimeout(() => {
          if (onPaymentSuccess) {
            onPaymentSuccess({
              transactionId: result.transactionId,
              amountPaid: amount,
              paidVia: paymentMode === "upi_id" ? upiId : `${selectedApp.toUpperCase()} App`,
              paidAt: result.verifiedAt
            });
          }
        }, 1200);
      } else {
        setPaymentStatus("failed");
        if (onPaymentFailure) onPaymentFailure(result);
      }
    } catch (err) {
      setPaymentStatus("failed");
      if (onPaymentFailure) onPaymentFailure(err);
    }
  };

  const merchantVPA = "inavist.travel@okhdfcbank";

  const handleCopyVPA = () => {
    navigator.clipboard.writeText(merchantVPA);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        padding: "24px",
        borderRadius: "var(--radius-2xl, 20px)",
        background: isDark
          ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.95) 100%)"
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
        border: "1.5px solid var(--border-subtle)",
        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.12)"
      }}
    >
      {/* Header with Amount & Security Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 800, color: "#16A34A", textTransform: "uppercase" }}>
            <ShieldCheck size={14} />
            <span>100% Secure UPI Payment (NPCI Standard)</span>
          </div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.30rem", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0 0" }}>
            Pay securely with UPI
          </h3>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Amount Payable</span>
          <div style={{ fontSize: "1.50rem", fontWeight: 900, color: "#16A34A" }}>
            ₹{amount.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Payment Method Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          padding: "4px",
          borderRadius: "var(--radius-xl, 14px)",
          background: "var(--bg-tertiary)"
        }}
      >
        {[
          { id: "upi_id", label: "Enter UPI ID", icon: Smartphone },
          { id: "qr", label: "Scan & Pay QR", icon: QrCode },
          { id: "apps", label: "UPI Apps", icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = paymentMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPaymentMode(tab.id)}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-lg, 10px)",
                border: "none",
                background: isSelected ? (isDark ? "#2563EB" : "#FFFFFF") : "transparent",
                color: isSelected ? (isDark ? "#FFFFFF" : "#2563EB") : "var(--text-secondary)",
                fontWeight: isSelected ? 800 : 600,
                fontSize: "0.80rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer",
                boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all var(--transition-fast)"
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode 1: UPI ID Input */}
      {paymentMode === "upi_id" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Virtual Payment Address (VPA) / UPI ID
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setUpiValidationResult(null);
                  setUpiError(null);
                }}
                placeholder="example@upi, yourname@okhdfcbank"
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 38px",
                  borderRadius: "var(--radius-lg, 12px)",
                  border: upiValidationResult?.isValid
                    ? "1.5px solid #16A34A"
                    : isDark
                    ? "1.5px solid rgba(255,255,255,0.12)"
                    : "1.5px solid #CBD5E1",
                  background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                  color: "var(--text-primary)",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  outline: "none"
                }}
              />
              <Smartphone size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--text-muted)" }} />
            </div>

            <button
              type="button"
              onClick={handleVerifyUPI}
              disabled={isVerifyingUpi || !upiId.trim()}
              style={{
                padding: "0 18px",
                borderRadius: "var(--radius-lg, 12px)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-subtle)",
                color: "var(--brand-primary, #2563EB)",
                fontWeight: 800,
                fontSize: "0.82rem",
                cursor: upiId.trim() ? "pointer" : "not-allowed",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {isVerifyingUpi ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              <span>Verify UPI</span>
            </button>
          </div>

          {/* Validation Feedback */}
          {upiValidationResult?.isValid && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#16A34A", fontWeight: 700 }}>
              <CheckCircle2 size={14} />
              <span>Verified Account: {upiValidationResult.maskedName} ({upiValidationResult.bankHandle})</span>
            </div>
          )}

          {upiError && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#DC2626", fontWeight: 700 }}>
              <AlertCircle size={14} />
              <span>{upiError}</span>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Dynamic QR Code */}
      {paymentMode === "qr" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "10px 0" }}>
          <div
            style={{
              padding: "16px",
              borderRadius: "16px",
              background: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {/* High-res SVG QR Simulation with central Indian Rupee badge */}
            <div
              style={{
                width: "180px",
                height: "180px",
                background: "#000000",
                borderRadius: "8px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px"
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: "radial-gradient(#FFFFFF 30%, transparent 35%), radial-gradient(#FFFFFF 30%, transparent 35%)",
                  backgroundSize: "12px 12px",
                  backgroundPosition: "0 0, 6px 6px",
                  borderRadius: "6px"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#2563EB",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "1.10rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
                }}
              >
                ₹
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#0F172A" }}>
                Scan with any UPI App
              </div>
              <div style={{ fontSize: "0.68rem", color: "#64748B" }}>
                GPay, PhonePe, Paytm, CRED, BHIM
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", color: "#EA580C", fontWeight: 700 }}>
            <Clock size={13} />
            <span>QR Code expires in <strong>{formatTimer(timeLeft)}</strong></span>
          </div>

          {/* Copy Merchant VPA */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.76rem", color: "var(--text-muted)" }}>
            <span>Merchant VPA: <strong>{merchantVPA}</strong></span>
            <button
              type="button"
              onClick={handleCopyVPA}
              style={{
                background: "none",
                border: "none",
                color: "#2563EB",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px"
              }}
            >
              {isCopied ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
              <span>{isCopied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Quick UPI Apps */}
      {paymentMode === "apps" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px" }}>
          {[
            { id: "gpay", name: "Google Pay", icon: "GPay", color: "#4285F4" },
            { id: "phonepe", name: "PhonePe", icon: "PhonePe", color: "#5F259F" },
            { id: "paytm", name: "Paytm UPI", icon: "Paytm", color: "#00B9F5" },
            { id: "cred", name: "CRED UPI", icon: "CRED", color: "#111111" },
            { id: "bhim", name: "BHIM UPI", icon: "BHIM", color: "#00796B" }
          ].map((app) => {
            const isSelected = selectedApp === app.id;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app.id)}
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-lg, 12px)",
                  border: `2px solid ${isSelected ? app.color : "var(--border-subtle)"}`,
                  background: isSelected ? (isDark ? `${app.color}25` : `${app.color}10`) : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: app.color,
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.72rem"
                  }}
                >
                  {app.icon.slice(0, 2)}
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {app.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Processing or Verified State Banner */}
      {paymentStatus === "processing" && (
        <div
          style={{
            padding: "14px",
            borderRadius: "var(--radius-lg, 12px)",
            background: "rgba(37, 99, 235, 0.12)",
            border: "1.5px solid rgba(37, 99, 235, 0.35)",
            color: "#2563EB",
            fontSize: "0.86rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <RefreshCw size={18} className="animate-spin" />
          <span>Awaiting NPCI UPI Server-Side Confirmation...</span>
        </div>
      )}

      {paymentStatus === "verified" && (
        <div
          style={{
            padding: "14px",
            borderRadius: "var(--radius-lg, 12px)",
            background: "rgba(22, 163, 74, 0.15)",
            border: "1.5px solid rgba(22, 163, 74, 0.4)",
            color: "#16A34A",
            fontSize: "0.86rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <CheckCircle2 size={20} />
          <span>Payment Verified! Transaction Ref: {transactionId}</span>
        </div>
      )}

      {/* Main Action Button */}
      <button
        type="button"
        onClick={handlePayNow}
        disabled={paymentStatus === "processing" || paymentStatus === "verified"}
        style={{
          padding: "15px",
          borderRadius: "var(--radius-xl, 16px)",
          border: "none",
          background: paymentStatus === "verified"
            ? "#16A34A"
            : "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
          color: "#FFFFFF",
          fontFamily: "var(--font-heading)",
          fontSize: "1.08rem",
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          boxShadow: "0 6px 20px rgba(22, 163, 74, 0.4)",
          cursor: paymentStatus === "processing" ? "not-allowed" : "pointer",
          transition: "all var(--transition-fast)"
        }}
      >
        <Lock size={18} />
        <span>
          {paymentStatus === "processing"
            ? "Verifying Payment..."
            : paymentStatus === "verified"
            ? "Payment Confirmed"
            : `Pay Now • ₹${amount.toLocaleString("en-IN")}`}
        </span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
