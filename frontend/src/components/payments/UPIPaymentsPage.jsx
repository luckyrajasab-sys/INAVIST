import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
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
  ChevronRight,
  Receipt,
  Download,
  Printer,
  Sparkles,
  Ticket,
  Building,
  Car,
  Plane,
  Train,
  X
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRewards } from "../../context/RewardsContext";
import { PaymentService } from "../../services/PaymentService";
import { api } from "../../api/client";

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

const INITIAL_TRANSACTIONS = [
  {
    id: "UPI/INV/2026/90218491",
    bookingId: "INV-28451",
    serviceName: "IRCTC Vande Bharat Express (Chennai ➔ Bengaluru)",
    category: "train",
    amount: 650,
    paidVia: "arjun.verma@okhdfcbank",
    paidAt: "28 Aug 2026, 04:30 PM",
    bankRef: "NPCI-781920381029",
    status: "VERIFIED"
  },
  {
    id: "UPI/INV/2026/89401923",
    bookingId: "INV-71934",
    serviceName: "IndiGo Express Flight (Chennai ➔ Goa)",
    category: "flight",
    amount: 4100,
    paidVia: "Dynamic UPI QR (Scan & Pay)",
    paidAt: "22 Aug 2026, 11:15 AM",
    bankRef: "NPCI-881920491024",
    status: "VERIFIED"
  },
  {
    id: "UPI/INV/2026/78102941",
    bookingId: "INV-19042",
    serviceName: "IntrCity AC Sleeper Bus (Chennai ➔ Kodaikanal)",
    category: "bus",
    amount: 1100,
    paidVia: "Google Pay UPI Intent",
    paidAt: "14 Aug 2026, 08:45 PM",
    bankRef: "NPCI-551920849102",
    status: "VERIFIED"
  }
];

const PAYMENT_PURPOSES = [
  { id: "train", label: "Train Ticket (IRCTC)", icon: Train, defaultAmount: 650 },
  { id: "hotel", label: "Hotel / Resort Stay", icon: Building, defaultAmount: 2800 },
  { id: "flight", label: "Domestic Flight", icon: Plane, defaultAmount: 4200 },
  { id: "cab", label: "Outstation / City Cab", icon: Car, defaultAmount: 1450 },
  { id: "package", label: "Tour Package & Pass", icon: Ticket, defaultAmount: 3200 }
];

export const UPIPaymentsPage = ({ onStartSearch }) => {
  const { isDark } = useTheme();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { addRewardPoints } = useRewards();

  // Active Tab: 'simulator' | 'saved_vpa' | 'qr_code' | 'history'
  const [activeTab, setActiveTab] = useState("simulator");

  // Saved Handles state
  const [savedUpiList, setSavedUpiList] = useState(() => {
    const local = localStorage.getItem("inavist_saved_upi_list");
    return local ? JSON.parse(local) : INITIAL_SAVED_UPI_IDS;
  });

  // Transactions State
  const [transactions, setTransactions] = useState(() => {
    const local = localStorage.getItem("inavist_recent_transactions");
    return local ? JSON.parse(local) : INITIAL_TRANSACTIONS;
  });

  // Add UPI Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUpiId, setNewUpiId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Selected Receipt Modal state
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // QR & Simulator state
  const [isCopied, setIsCopied] = useState(false);
  const merchantVPA = "inavist.travel@okhdfcbank";

  // Sandbox Live Checkout State
  const [payPurpose, setPayPurpose] = useState(PAYMENT_PURPOSES[0]);
  const [payAmount, setPayAmount] = useState(650);
  const [selectedPayVPA, setSelectedPayVPA] = useState(savedUpiList[0]?.upiId || "arjun.verma@okhdfcbank");
  const [payMethodType, setPayMethodType] = useState("vpa"); // 'vpa' | 'qr' | 'intent'
  const [selectedApp, setSelectedApp] = useState("gpay");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStepText, setPaymentStepText] = useState("");
  const [completedPaymentResult, setCompletedPaymentResult] = useState(null);

  // Synchronize saved handles with localStorage
  useEffect(() => {
    localStorage.setItem("inavist_saved_upi_list", JSON.stringify(savedUpiList));
  }, [savedUpiList]);

  // Synchronize transactions with localStorage
  useEffect(() => {
    localStorage.setItem("inavist_recent_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Load saved UPI handles and merge live bookings on mount
  useEffect(() => {
    api.payments.getSavedUpiIds().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSavedUpiList(res.data);
      }
    }).catch(() => {});

    // Merge recent bookings from localStorage/backend into transaction history
    try {
      const savedBookings = JSON.parse(localStorage.getItem("inavist_all_bookings") || "[]");
      if (savedBookings.length > 0) {
        setTransactions((prev) => {
          const prevTxnIds = new Set(prev.map((t) => t.bookingId || t.id));
          const newFromBookings = savedBookings
            .filter((b) => !prevTxnIds.has(b.bookingId || b.id))
            .map((b) => ({
              id: b.paymentDetails?.transactionId || `UPI/INV/2026/${Math.floor(100000000 + Math.random() * 900000000)}`,
              bookingId: b.bookingId || "INV-000",
              serviceName: b.title || `${b.originCity} ➔ ${b.destinationCity}`,
              category: b.type || "travel",
              amount: b.pricing?.totalAmount || b.amount || 1000,
              paidVia: b.paymentDetails?.method || "UPI Dynamic Clearance",
              paidAt: b.travelDate ? `${b.travelDate}, Confirmed` : "Recent",
              bankRef: b.paymentDetails?.gatewayRef || `NPCI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
              status: "VERIFIED"
            }));
          return [...newFromBookings, ...prev];
        });
      }
    } catch (e) {}
  }, []);

  // Update default VPA selection if saved list changes
  useEffect(() => {
    if (savedUpiList.length > 0 && !savedUpiList.some((s) => s.upiId === selectedPayVPA)) {
      setSelectedPayVPA(savedUpiList[0].upiId);
    }
  }, [savedUpiList]);

  // Single-Click Verify & Save UPI Handle
  const handleVerifyAndSaveUpi = async () => {
    const cleanId = newUpiId.trim().toLowerCase();
    if (!cleanId) {
      setValidationError("Please enter a valid UPI ID (e.g. username@bank).");
      return;
    }

    setIsVerifying(true);
    setValidationError(null);

    try {
      const res = await PaymentService.validateUPIId(cleanId);
      if (res.isValid) {
        const newItem = {
          id: `upi-${Date.now()}`,
          upiId: cleanId,
          bankHandle: res.bankHandle ? res.bankHandle.toUpperCase() + " Bank" : "Verified UPI Bank",
          isDefault: savedUpiList.length === 0,
          maskedName: res.maskedName || `${cleanId.slice(0, 2)}*** Verified Account`,
          addedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          status: "VERIFIED"
        };

        const updated = [...savedUpiList, newItem];
        setSavedUpiList(updated);
        setSelectedPayVPA(newItem.upiId);

        // Sync with backend API
        api.payments.saveUpiId(newItem).catch(() => {});

        setNewUpiId("");
        setValidationResult(null);
        setIsAddModalOpen(false);
      } else {
        setValidationError(res.message || "Invalid UPI address format. Standard is username@bank.");
      }
    } catch (e) {
      setValidationError("Failed to verify UPI address with bank server. Please check your network.");
    } finally {
      setIsVerifying(false);
    }
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
    const target = savedUpiList.find((item) => item.id === id);
    const filtered = savedUpiList.filter((item) => item.id !== id);
    if (filtered.length > 0 && !filtered.some((i) => i.isDefault)) {
      filtered[0].isDefault = true;
    }
    setSavedUpiList(filtered);
    if (target?.upiId) {
      api.payments.removeUpiId(target.upiId).catch(() => {});
    }
  };

  const handleCopyVPA = () => {
    navigator.clipboard.writeText(merchantVPA);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Simulate Instant UPI Checkout Flow
  const handleExecutePayment = async () => {
    if (!payAmount || Number(payAmount) <= 0) {
      alert("Please enter a valid payment amount greater than ₹0.");
      return;
    }

    setIsProcessingPayment(true);
    setCompletedPaymentResult(null);
    setPaymentStepText("Initializing secure 256-bit encrypted NPCI session...");

    try {
      const bookingId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

      await new Promise((r) => setTimeout(r, 600));
      setPaymentStepText("Requesting authorization from bank server...");

      await new Promise((r) => setTimeout(r, 600));
      setPaymentStepText("NPCI clearance verified • Securing travel reservation...");

      const activeVpa = payMethodType === "qr" ? "Dynamic UPI QR" : (payMethodType === "intent" ? `${selectedApp.toUpperCase()} UPI Intent` : selectedPayVPA);

      const verificationRes = await PaymentService.verifyUPIPayment({
        bookingId,
        amount: Number(payAmount),
        upiId: activeVpa
      });

      const newTxn = {
        id: verificationRes.transactionId || `UPI/INV/2026/${Math.floor(100000000 + Math.random() * 900000000)}`,
        bookingId,
        serviceName: `${payPurpose.label} (Instant Clearance)`,
        category: payPurpose.id,
        amount: Number(payAmount),
        paidVia: activeVpa,
        paidAt: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        bankRef: verificationRes.bankReferenceNumber || `NPCI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        status: "VERIFIED"
      };

      setTransactions((prev) => [newTxn, ...prev]);
      setCompletedPaymentResult(newTxn);

      // Award loyalty points
      const pointsEarned = Math.floor(Number(payAmount) * 0.08);
      addRewardPoints?.({
        points: pointsEarned,
        bookingId,
        description: `Earned on ${payPurpose.label} via UPI`
      });

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      alert("Payment simulation error: " + err.message);
    } finally {
      setIsProcessingPayment(false);
      setPaymentStepText("");
    }
  };

  const dynamicUPIUrl = `upi://pay?pa=${encodeURIComponent(merchantVPA)}&pn=INAVIST%20India%20Tourism&am=${Number(payAmount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Travel Booking #${payPurpose.label}`)}`;

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
      {/* Top Header Banner */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-2xl, 24px)",
          padding: "30px 32px",
          background: isDark
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.22) 0%, rgba(16, 185, 129, 0.16) 100%)"
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
            <span>NPCI Unified Payments Interface (UPI 2.0 Live Network)</span>
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
            UPI Payments & Checkout Center
          </h1>

          <p style={{ fontSize: "0.90rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Instant, zero-fee travel checkout powered by official NPCI UPI protocols. Test real-time payments, generate dynamic QR codes, and manage your verified VPAs.
          </p>
        </div>

        {/* Quick Action Navigation Bar */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-xl, 14px)",
              background: activeTab === "simulator" ? "var(--brand-primary, #2563EB)" : "var(--bg-tertiary)",
              color: activeTab === "simulator" ? "#FFFFFF" : "var(--text-primary)",
              border: `1.5px solid ${activeTab === "simulator" ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)"}`,
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Zap size={16} />
            <span>Pay & Test Sandbox</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAddModalOpen(true);
              setNewUpiId("");
              setValidationError(null);
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(22, 163, 74, 0.35)"
            }}
          >
            <Plus size={16} />
            <span>Add UPI Handle</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Strip */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "4px",
          overflowX: "auto"
        }}
      >
        {[
          { id: "simulator", label: "Instant Payment Sandbox", icon: Zap },
          { id: "saved_vpa", label: `Saved VPAs (${savedUpiList.length})`, icon: Smartphone },
          { id: "qr_code", label: "Merchant Dynamic QR", icon: QrCode },
          { id: "history", label: `Transaction History (${transactions.length})`, icon: Receipt }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "var(--radius-full, 9999px)",
                background: isActive ? "var(--brand-primary, #2563EB)" : "transparent",
                color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                border: "none",
                fontWeight: isActive ? 800 : 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease"
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: INSTANT PAYMENT SANDBOX (REAL CHECKOUT TESTING) */}
      {activeTab === "simulator" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
          {/* Left: Configure Checkout */}
          <div
            className="glass-card"
            style={{
              borderRadius: "var(--radius-2xl, 24px)",
              padding: "26px",
              border: "1.5px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <Zap size={18} color="var(--brand-primary, #2563EB)" />
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  Step 1: Select Purpose & Amount
                </h2>
              </div>
              <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", margin: 0 }}>
                Test end-to-end checkout with instant NPCI gateway verification and points crediting.
              </p>
            </div>

            {/* Purpose Select */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {PAYMENT_PURPOSES.map((p) => {
                const Icon = p.icon;
                const isSelected = payPurpose.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPayPurpose(p);
                      setPayAmount(p.defaultAmount);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "var(--radius-lg, 12px)",
                      border: `1.5px solid ${isSelected ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)"}`,
                      background: isSelected ? "rgba(37, 99, 235, 0.12)" : "var(--bg-tertiary)",
                      color: isSelected ? "var(--brand-primary, #2563EB)" : "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}
                  >
                    <Icon size={14} />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Amount Presets & Custom Input */}
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Payment Amount (₹ INR)
              </label>

              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                {[250, 650, 1450, 2800, 4200].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPayAmount(preset)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "8px",
                      background: payAmount === preset ? "var(--brand-primary, #2563EB)" : "var(--bg-tertiary)",
                      color: payAmount === preset ? "#FFFFFF" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "14px", fontWeight: 800, fontSize: "1.2rem", color: "var(--text-primary)" }}>₹</span>
                <input
                  type="number"
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Math.max(1, Number(e.target.value) || 0))}
                  style={{
                    width: "100%",
                    padding: "12px 14px 12px 34px",
                    borderRadius: "var(--radius-lg, 12px)",
                    border: "1.5px solid var(--border-subtle)",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    outline: "none"
                  }}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Step 2: Choose Payment Method
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[
                  { id: "vpa", label: "Saved VPA", icon: Smartphone },
                  { id: "qr", label: "Dynamic QR", icon: QrCode },
                  { id: "intent", label: "UPI App", icon: Zap }
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = payMethodType === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethodType(m.id)}
                      style={{
                        padding: "10px",
                        borderRadius: "var(--radius-lg, 12px)",
                        border: `1.5px solid ${isSelected ? "#16A34A" : "var(--border-subtle)"}`,
                        background: isSelected ? "rgba(22, 163, 74, 0.12)" : "var(--bg-tertiary)",
                        color: isSelected ? "#16A34A" : "var(--text-primary)",
                        fontWeight: 800,
                        fontSize: "0.80rem",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Icon size={18} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Option Details */}
            {payMethodType === "vpa" && (
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Select Verified Handle
                </label>
                <select
                  value={selectedPayVPA}
                  onChange={(e) => setSelectedPayVPA(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "var(--radius-lg, 12px)",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  {savedUpiList.map((s) => (
                    <option key={s.id} value={s.upiId}>
                      {s.upiId} ({s.bankHandle}) {s.isDefault ? "★ Default" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {payMethodType === "intent" && (
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Select Target UPI Application
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "8px" }}>
                  {[
                    { id: "gpay", name: "Google Pay", color: "#4285F4" },
                    { id: "phonepe", name: "PhonePe", color: "#5F259F" },
                    { id: "paytm", name: "Paytm", color: "#00B9F5" },
                    { id: "cred", name: "CRED", color: "#111111" },
                    { id: "bhim", name: "BHIM", color: "#00796B" }
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedApp(app.id)}
                      style={{
                        padding: "8px 4px",
                        borderRadius: "8px",
                        border: `1.5px solid ${selectedApp === app.id ? app.color : "var(--border-subtle)"}`,
                        background: selectedApp === app.id ? `${app.color}15` : "var(--bg-tertiary)",
                        color: selectedApp === app.id ? app.color : "var(--text-primary)",
                        fontWeight: 800,
                        fontSize: "0.74rem",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Execute Payment Button */}
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={handleExecutePayment}
              style={{
                padding: "16px",
                borderRadius: "var(--radius-xl, 14px)",
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 900,
                fontSize: "1.05rem",
                cursor: isProcessingPayment ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 6px 20px rgba(22, 163, 74, 0.4)",
                marginTop: "6px"
              }}
            >
              {isProcessingPayment ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Authorizing via NPCI...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>Pay ₹{Number(payAmount).toLocaleString("en-IN")} via UPI</span>
                </>
              )}
            </button>

            {paymentStepText && (
              <div style={{ textAlign: "center", fontSize: "0.80rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700 }}>
                {paymentStepText}
              </div>
            )}
          </div>

          {/* Right: Real-Time Dynamic Confirmation / Live QR Display */}
          <div
            className="glass-card"
            style={{
              borderRadius: "var(--radius-2xl, 24px)",
              padding: "26px",
              border: "1.5px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: isDark ? "rgba(15, 23, 42, 0.6)" : "#FFFFFF",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center"
            }}
          >
            {completedPaymentResult ? (
              /* Success Receipt View */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(22, 163, 74, 0.15)",
                    color: "#16A34A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <CheckCircle2 size={38} />
                </div>

                <div>
                  <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "#16A34A", textTransform: "uppercase" }}>
                    NPCI Payment Verified ✓
                  </span>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0" }}>
                    ₹{completedPaymentResult.amount.toLocaleString("en-IN")} Paid
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {completedPaymentResult.serviceName}
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-lg, 12px)",
                    padding: "16px",
                    textAlign: "left",
                    fontSize: "0.80rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  <div><strong>Transaction ID:</strong> {completedPaymentResult.id}</div>
                  <div><strong>NPCI Reference:</strong> {completedPaymentResult.bankRef}</div>
                  <div><strong>Paid Via:</strong> {completedPaymentResult.paidVia}</div>
                  <div><strong>Timestamp:</strong> {completedPaymentResult.paidAt}</div>
                  <div style={{ color: "#16A34A", fontWeight: 800, marginTop: "4px" }}>
                    🎉 +{Math.floor(completedPaymentResult.amount * 0.08)} INAVIST Loyalty Points Earned!
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(completedPaymentResult)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    <Receipt size={14} />
                    <span>View GST Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompletedPaymentResult(null)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "10px",
                      background: "var(--brand-primary, #2563EB)",
                      color: "#FFFFFF",
                      border: "none",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}
                  >
                    New Payment
                  </button>
                </div>
              </div>
            ) : (
              /* Live QR Preview */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", width: "100%" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "#FFFFFF",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
                  }}
                >
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
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "#2563EB",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "1.1rem"
                      }}
                    >
                      ₹
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-primary)" }}>
                    ₹{Number(payAmount).toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: "0.80rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Scan with BHIM, Google Pay, PhonePe, or Paytm
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                  {["BHIM", "GPay", "PhonePe", "Paytm", "CRED"].map((a) => (
                    <span
                      key={a}
                      style={{
                        fontSize: "0.70rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        background: "var(--bg-tertiary)",
                        color: "var(--text-secondary)"
                      }}
                    >
                      ✓ {a}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", maxWidth: "280px" }}>
                  Merchant VPA: <strong>{merchantVPA}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SAVED VPAs & HANDLES */}
      {activeTab === "saved_vpa" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Verified Bank Virtual Payment Addresses ({savedUpiList.length})
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(true);
                setNewUpiId("");
                setValidationError(null);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-lg, 12px)",
                background: "var(--brand-primary, #2563EB)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Plus size={15} />
              <span>Add New VPA</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {savedUpiList.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  borderRadius: "var(--radius-xl, 18px)",
                  padding: "20px",
                  border: item.isDefault ? "2px solid #2563EB" : "1.5px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "rgba(37, 99, 235, 0.12)",
                        color: "#2563EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Smartphone size={22} />
                    </div>

                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                        {item.upiId}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
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
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full, 9999px)",
                        background: "rgba(37, 99, 235, 0.15)",
                        color: "#2563EB",
                        fontSize: "0.72rem",
                        fontWeight: 800
                      }}
                    >
                      <Star size={12} fill="#2563EB" />
                      <span>Default</span>
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

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)", fontSize: "0.76rem" }}>
                  <span style={{ color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} />
                    <span>NPCI Verified & Active</span>
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
                      fontSize: "0.76rem",
                      fontWeight: 700
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MERCHANT DYNAMIC QR */}
      {activeTab === "qr_code" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "center" }}>
          <div
            className="glass-card"
            style={{
              borderRadius: "var(--radius-2xl, 24px)",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textAlign: "center"
            }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "20px",
                background: "#FFFFFF",
                boxShadow: "0 10px 35px rgba(0,0,0,0.14)"
              }}
            >
              <div
                style={{
                  width: "200px",
                  height: "200px",
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
                    fontSize: "1.2rem"
                  }}
                >
                  ₹
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                INAVIST India Tourism Pvt Ltd
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Official Merchant VPA: <strong>{merchantVPA}</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyVPA}
              style={{
                padding: "8px 18px",
                borderRadius: "var(--radius-full, 9999px)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-subtle)",
                color: "#2563EB",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {isCopied ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
              <span>{isCopied ? "Copied to Clipboard!" : "Copy Merchant VPA"}</span>
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="glass-card" style={{ padding: "20px", borderRadius: "16px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                How QR Payments Work:
              </h3>
              <ul style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "8px" }}>
                <li>Open any authorized UPI application on your smartphone.</li>
                <li>Tap <strong>Scan QR</strong> and aim your camera at the travel code.</li>
                <li>Verify payee name: <em>INAVIST India Tourism</em>.</li>
                <li>Enter your UPI secret PIN inside your bank's encrypted interface.</li>
                <li>The server acknowledges the webhook within <strong>2 seconds</strong> and issues your travel confirmation voucher.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTION HISTORY & INVOICES */}
      {activeTab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              Live Payment Ledger & GST Invoices ({transactions.length})
            </h2>
          </div>

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
                key={tx.id + idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 8px",
                  borderBottom: idx < transactions.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "rgba(22, 163, 74, 0.12)",
                      color: "#16A34A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ArrowUpRight size={20} />
                  </div>

                  <div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {tx.serviceName}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                      Txn Ref: <strong>{tx.id}</strong> • Booking #{tx.bookingId} • {tx.paidAt}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#16A34A" }}>
                      ₹{Number(tx.amount).toLocaleString("en-IN")}
                    </div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        background: "rgba(22, 163, 74, 0.15)",
                        color: "#16A34A"
                      }}
                    >
                      {tx.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(tx)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-subtle)",
                      color: "#2563EB",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Receipt size={13} />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Architecture Guarantees */}
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

      {/* SINGLE-CLICK ADD UPI ID MODAL */}
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
              <div style={{ marginTop: "6px" }}>
                <input
                  type="text"
                  value={newUpiId}
                  onChange={(e) => {
                    setNewUpiId(e.target.value);
                    setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleVerifyAndSaveUpi();
                    }
                  }}
                  placeholder="e.g. traveller@okhdfcbank, mobile@upi"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    outline: "none"
                  }}
                />
              </div>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                Supports HDFC, SBI, ICICI, Axis, PhonePe, Google Pay, Paytm, CRED, etc.
              </span>
            </div>

            <button
              type="button"
              disabled={isVerifying || !newUpiId.trim()}
              onClick={handleVerifyAndSaveUpi}
              style={{
                padding: "13px",
                borderRadius: "var(--radius-xl, 14px)",
                background: "linear-gradient(135deg, #16A34A 0%, #15803D 100%)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 900,
                fontSize: "0.92rem",
                cursor: isVerifying || !newUpiId.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(22, 163, 74, 0.4)"
              }}
            >
              {isVerifying ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verifying with Bank...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Verify & Save VPA</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* OFFICIAL GST UPI RECEIPT MODAL */}
      {selectedReceipt && (
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
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "520px",
              borderRadius: "var(--radius-2xl, 24px)",
              background: isDark
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 29, 0.98) 100%)"
                : "#FFFFFF",
              border: "2px solid #16A34A",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Receipt size={22} color="#16A34A" />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                  Tax Invoice & Payment Receipt
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
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

            <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px", display: "flex", justifyContent: "space-between", fontSize: "0.80rem" }}>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>INAVIST India Tourism Pvt Ltd</strong>
                <div style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>GSTIN: 07AABCY8910M1Z2 • New Delhi</div>
              </div>
              <div style={{ textAlign: "right", color: "#16A34A", fontWeight: 800 }}>
                VERIFIED PAID ✓
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Service Description:</span>
                <strong style={{ color: "var(--text-primary)" }}>{selectedReceipt.serviceName}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Booking ID:</span>
                <span>{selectedReceipt.bookingId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>NPCI Txn Reference:</span>
                <span>{selectedReceipt.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Bank Approval Ref:</span>
                <span>{selectedReceipt.bankRef}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Paid Via VPA:</span>
                <span>{selectedReceipt.paidVia}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Date & Time:</span>
                <span>{selectedReceipt.paidAt}</span>
              </div>
            </div>

            <div style={{ background: "var(--bg-tertiary)", padding: "12px 16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Total Amount Paid (Incl. GST):</span>
              <span style={{ fontWeight: 900, fontSize: "1.3rem", color: "#16A34A" }}>
                ₹{Number(selectedReceipt.amount).toLocaleString("en-IN")}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  background: "var(--brand-primary, #2563EB)",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
