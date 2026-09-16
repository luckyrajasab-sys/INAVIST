import React, { useState, useEffect } from "react";
import {
  Smartphone,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Star,
  Copy,
  Check,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Zap,
  Lock,
  RefreshCw,
  Info,
  Layers,
  ArrowUpRight,
  ChevronRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { PaymentService } from "../../services/PaymentService";

const INITIAL_SAVED_UPI_IDS = [
  {
    id: "upi-1",
    upiId: "arjun.verma@okhdfcbank",
    bankHandle: "HDFC Bank",
    isDefault: true,
    maskedName: "Ar*** Ve***",
    addedAt: "12 May 2026",
    status: "VERIFIED"
  },
  {
    id: "upi-2",
    upiId: "traveler.yatri@ybl",
    bankHandle: "Yes Bank / PhonePe",
    isDefault: false,
    maskedName: "Tr*** Ya***",
    addedAt: "20 June 2026",
    status: "VERIFIED"
  }
];

const SAMPLE_UPI_TRANSACTIONS = [
  {
    id: "UPI/INV/2026/90218491",
    bookingId: "INV-28451",
    serviceName: "IRCTC Vande Bharat Express (Chennai ➔ Bengaluru)",
    amount: 650,
    paidVia: "arjun.verma@okhdfcbank",
    paidAt: "28 Aug 2026, 04:30 PM",
    status: "VERIFIED"
  },
  {
    id: "UPI/INV/2026/89401923",
    bookingId: "INV-71934",
    serviceName: "IndiGo Express Flight (Chennai ➔ Goa)",
    amount: 4100,
    paidVia: "Dynamic UPI QR (Scan & Pay)",
    paidAt: "22 Aug 2026, 11:15 AM",
    status: "VERIFIED"
  },
  {
    id: "UPI/INV/2026/78102941",
    bookingId: "INV-19042",
    serviceName: "IntrCity AC Sleeper Bus (Chennai ➔ Kodaikanal)",
    amount: 1100,
    paidVia: "Google Pay UPI Intent",
    paidAt: "14 Aug 2026, 08:45 PM",
    status: "VERIFIED"
  }
];

export const UPIPaymentsPage = ({ onStartSearch }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [savedUpiList, setSavedUpiList] = useState(() => {
    const local = localStorage.getItem("inavist_saved_upi_list");
    return local ? JSON.parse(local) : INITIAL_SAVED_UPI_IDS;
  });

  const [transactions, setTransactions] = useState(SAMPLE_UPI_TRANSACTIONS);

  // Add UPI Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUpiId, setNewUpiId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // QR Simulator state
  const [isCopied, setIsCopied] = useState(false);
  const merchantVPA = "inavist.travel@okhdfcbank";

  useEffect(() => {
    localStorage.setItem("inavist_saved_upi_list", JSON.stringify(savedUpiList));
  }, [savedUpiList]);

  const handleVerifyNewUpi = async () => {
    if (!newUpiId.trim()) {
      setValidationError("Please enter a valid UPI ID (e.g. username@bank).");
      return;
    }
    setIsVerifying(true);
    setValidationError(null);

    try {
      const res = await PaymentService.validateUPIId(newUpiId.trim());
      if (res.isValid) {
        setValidationResult(res);
        setValidationError(null);
      } else {
        setValidationResult(null);
        setValidationError(res.message);
      }
    } catch (e) {
      setValidationError("Failed to verify UPI account with bank server.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveUpiId = () => {
    if (!validationResult?.isValid) {
      handleVerifyNewUpi();
      return;
    }

    const newItem = {
      id: `upi-${Date.now()}`,
      upiId: newUpiId.trim().toLowerCase(),
      bankHandle: validationResult.bankHandle || "UPI",
      isDefault: savedUpiList.length === 0,
      maskedName: validationResult.maskedName || "Verified Account",
      addedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "VERIFIED"
    };

    setSavedUpiList([...savedUpiList, newItem]);
    setNewUpiId("");
    setValidationResult(null);
    setIsAddModalOpen(false);
  };

  const handleSetDefault = (id) => {
    setSavedUpiList(
      savedUpiList.map((item) => ({
        ...item,
        isDefault: item.id === id
      }))
    );
  };

  const handleRemoveUpi = (id) => {
    const filtered = savedUpiList.filter((item) => item.id !== id);
    if (filtered.length > 0 && !filtered.some((i) => i.isDefault)) {
      filtered[0].isDefault = true;
    }
    setSavedUpiList(filtered);
  };

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
        gap: "28px",
        padding: "16px 24px 80px",
        maxWidth: "1240px",
        margin: "0 auto",
        width: "100%"
      }}
    >
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-2xl, 24px)",
          padding: "30px 32px",
          background: isDark
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)"
            : "linear-gradient(135deg, rgba(239, 246, 255, 0.98) 0%, rgba(240, 253, 244, 0.98) 100%)",
          border: "2px solid rgba(37, 99, 235, 0.35)",
          boxShadow: "0 20px 45px -10px rgba(37, 99, 235, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "680px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "#16A34A",
              color: "#FFFFFF",
              fontSize: "0.74rem",
              fontWeight: 800,
              width: "fit-content"
            }}
          >
            <ShieldCheck size={14} />
            <span>NPCI Unified Payments Interface (UPI 2.0)</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.3rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
              margin: 0
            }}
          >
            UPI Payments & Saved Handles
          </h1>

          <p style={{ fontSize: "0.90rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Manage verified Virtual Payment Addresses (VPAs), set your default checkout handle, and view instant server-verified travel transactions with zero stored payment PINs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAddModalOpen(true);
            setNewUpiId("");
            setValidationResult(null);
            setValidationError(null);
          }}
          style={{
            padding: "12px 24px",
            borderRadius: "var(--radius-xl, 14px)",
            background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            color: "#FFFFFF",
            border: "none",
            fontWeight: 800,
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 16px rgba(37, 99, 235, 0.4)"
          }}
        >
          <Plus size={18} />
          <span>Add New UPI ID</span>
        </button>
      </div>

      {/* Grid: Saved Handles & Merchant QR Info */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
        {/* Left: Saved UPI IDs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Saved UPI Addresses ({savedUpiList.length})
            </h2>
          </div>

          {savedUpiList.length === 0 ? (
            <div
              className="glass-card"
              style={{
                borderRadius: "var(--radius-xl, 18px)",
                padding: "36px 20px",
                textAlign: "center",
                color: "var(--text-muted)"
              }}
            >
              No saved UPI IDs. Add a verified VPA to enable 1-click booking checkouts.
            </div>
          ) : (
            savedUpiList.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  borderRadius: "var(--radius-xl, 18px)",
                  padding: "18px 20px",
                  border: item.isDefault ? "2px solid #2563EB" : "1.5px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(37, 99, 235, 0.12)",
                        color: "#2563EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Smartphone size={20} />
                    </div>

                    <div>
                      <div style={{ fontSize: "0.96rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {item.upiId}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                        {item.bankHandle} • Account: {item.maskedName}
                      </div>
                    </div>
                  </div>

                  {item.isDefault ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full, 9999px)",
                        background: "rgba(37, 99, 235, 0.15)",
                        color: "#2563EB",
                        fontSize: "0.72rem",
                        fontWeight: 800
                      }}
                    >
                      <Star size={12} fill="#2563EB" />
                      <span>Default Handle</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2563EB",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)", fontSize: "0.74rem" }}>
                  <span style={{ color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={13} />
                    <span>Bank Verified (Active)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveUpi(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#DC2626",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.74rem",
                      fontWeight: 700
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Quick Merchant QR & Security Certified */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Dynamic Travel QR Code
          </h2>

          <div
            className="glass-card"
            style={{
              borderRadius: "var(--radius-xl, 18px)",
              padding: "24px",
              border: "1.5px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF",
              textAlign: "center"
            }}
          >
            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                background: "#FFFFFF",
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)"
              }}
            >
              <div
                style={{
                  width: "160px",
                  height: "160px",
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
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#2563EB",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "1rem"
                  }}
                >
                  ₹
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-primary)" }}>
                Official Merchant VPA
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                {merchantVPA}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyVPA}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full, 9999px)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-subtle)",
                color: "#2563EB",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              {isCopied ? <Check size={13} color="#16A34A" /> : <Copy size={13} />}
              <span>{isCopied ? "Copied to Clipboard" : "Copy Merchant VPA"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security & NPCI Architecture Banner */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-xl, 18px)",
          padding: "20px 24px",
          border: "1px solid var(--border-subtle)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "18px"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <ShieldCheck size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-primary)" }}>Zero PIN Storage</div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
              INAVIST never requests, logs, or stores your secret UPI MPIN. All authorization happens inside your trusted bank app.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <Lock size={20} color="#2563EB" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-primary)" }}>256-Bit SSL Encryption</div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
              End-to-end encrypted intent requests complying with RBI and NPCI Unified Payment standards.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <Zap size={20} color="#EA580C" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--text-primary)" }}>Instant Server-Side Webhooks</div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Real-time payment verification ensuring immediate ticket issuance and points accreditation.
            </div>
          </div>
        </div>
      </div>

      {/* Verified UPI Transactions History */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
          Recent UPI Payment Transactions
        </h2>

        <div
          className="glass-card"
          style={{
            borderRadius: "var(--radius-xl, 18px)",
            padding: "8px 16px",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 8px",
                borderBottom: idx < transactions.length - 1 ? "1px solid var(--border-subtle)" : "none",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "rgba(22, 163, 74, 0.12)",
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ArrowUpRight size={18} />
                </div>

                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    {tx.serviceName}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Txn Ref: <strong>{tx.id}</strong> • Booking #{tx.bookingId} • {tx.paidAt}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.10rem", fontWeight: 900, color: "#16A34A" }}>
                  ₹{tx.amount.toLocaleString("en-IN")}
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    padding: "2px 7px",
                    borderRadius: "var(--radius-full, 9999px)",
                    background: "rgba(22, 163, 74, 0.15)",
                    color: "#16A34A"
                  }}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD UPI ID MODAL */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "480px",
              borderRadius: "var(--radius-2xl, 24px)",
              background: isDark
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 29, 0.98) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
              border: "1.5px solid var(--border-subtle)",
              padding: "26px",
              display: "flex",
              flexDirection: "column",
              gap: "18px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Smartphone size={20} color="#2563EB" />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Add Virtual Payment Address (UPI ID)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  width: "32px",
                  height: "32px",
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
                <X size={15} />
              </button>
            </div>

            {validationError && (
              <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(220,38,38,0.12)", color: "#DC2626", fontSize: "0.78rem", fontWeight: 700 }}>
                {validationError}
              </div>
            )}

            <div>
              <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>UPI ID / VPA</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <input
                  type="text"
                  value={newUpiId}
                  onChange={(e) => {
                    setNewUpiId(e.target.value);
                    setValidationResult(null);
                    setValidationError(null);
                  }}
                  placeholder="yourname@okhdfcbank, mobile@upi"
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: validationResult?.isValid ? "1.5px solid #16A34A" : "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    fontWeight: 600
                  }}
                />

                <button
                  type="button"
                  disabled={isVerifying || !newUpiId.trim()}
                  onClick={handleVerifyNewUpi}
                  style={{
                    padding: "0 14px",
                    borderRadius: "8px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    color: "#2563EB",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    cursor: newUpiId.trim() ? "pointer" : "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {isVerifying ? <RefreshCw size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
                  <span>Verify</span>
                </button>
              </div>

              {validationResult?.isValid && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", color: "#16A34A", fontWeight: 700, marginTop: "6px" }}>
                  <CheckCircle2 size={13} />
                  <span>Verified Account: {validationResult.maskedName} ({validationResult.bankHandle})</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveUpiId}
              disabled={!newUpiId.trim()}
              style={{
                padding: "12px",
                borderRadius: "var(--radius-xl, 14px)",
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 900,
                fontSize: "0.90rem",
                cursor: newUpiId.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <Check size={16} />
              <span>Save & Verify UPI Handle</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
