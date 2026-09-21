import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Compass,
  ShieldCheck,
  Sparkles,
  Check,
  ArrowRight,
  User,
  Globe,
  FileText,
  Plane,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { getAllStates } from "../../data/destinationsData";
import { api } from "../../api/client";

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "Singapore", "United Arab Emirates", "Russia",
  "Italy", "Spain", "Netherlands", "Switzerland", "South Korea",
  "Brazil", "South Africa", "New Zealand", "Sweden", "Other"
];

const ARRIVAL_AIRPORTS = [
  "Indira Gandhi Int'l Airport, New Delhi (DEL)",
  "Chhatrapati Shivaji Maharaj Int'l Airport, Mumbai (BOM)",
  "Kempegowda Int'l Airport, Bengaluru (BLR)",
  "Chennai Int'l Airport, Chennai (MAA)",
  "Rajiv Gandhi Int'l Airport, Hyderabad (HYD)",
  "Netaji Subhash Chandra Bose Int'l Airport, Kolkata (CCU)",
  "Cochin Int'l Airport, Kochi (COK)",
  "Dabolim / Mopa Airport, Goa (GOI/GOX)",
  "Sardar Vallabhbhai Patel Int'l Airport, Ahmedabad (AMD)"
];

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authInitialTab,
    login,
    loginWithGoogle,
    loginWithDemo,
    loginWithSocial,
    sendPhoneOtp,
    verifyPhoneOtp,
    registerIndianUser,
    registerForeignerUser,
    resetPassword
  } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  // Current view: 'signin' | 'phone' | 'signup' | 'foreigner' | 'forgot'
  const [activeTab, setActiveTab] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Phone OTP Authentication States
  const [phoneInput, setPhoneInput] = useState("+91 ");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Show/Hide Password States
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem("inavist_remember_me") === "true");

  useEffect(() => {
    if (authInitialTab) {
      setActiveTab(authInitialTab);
    }
  }, [authInitialTab]);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState(() => localStorage.getItem("inavist_saved_email") || "");
  const [signInPassword, setSignInPassword] = useState("");

  // Forgot Password Email
  const [forgotEmail, setForgotEmail] = useState("");

  // Indian Citizen Registration Form State
  const [indianForm, setIndianForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "Delhi",
    city: "New Delhi",
    travelStyle: "Spiritual & Heritage",
    password: "",
    avatarId: "avatar-train-exp"
  });

  // Foreigner Registration Form State
  const [foreignerForm, setForeignerForm] = useState({
    passportName: "",
    email: "",
    phone: "",
    nationality: "United States",
    passportNumber: "",
    passportExpiry: "2030-12-31",
    visaNumber: "",
    visaType: "e-Tourist Visa (30 Days)",
    visaExpiry: "2027-08-31",
    arrivalPort: ARRIVAL_AIRPORTS[0],
    emergencyContact: "",
    homeCity: "New York",
    travelStyle: "Monuments, Culture & Photography",
    hasInsurance: true,
    password: "",
    avatarId: "avatar-flight-jet"
  });

  // Active Password for Validation
  const activePassword = activeTab === "signup" ? indianForm.password : activeTab === "foreigner" ? foreignerForm.password : "";

  // Password Pattern Requirements Validation Logic
  const passwordChecks = useMemo(() => {
    const p = activePassword || "";
    return {
      hasMinLength: p.length >= 8,
      hasUpper: /[A-Z]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasNumber: /[0-9]/.test(p),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-\/+=~`\[\]\\;']/.test(p)
    };
  }, [activePassword]);

  const passwordScore = useMemo(() => {
    const count = Object.values(passwordChecks).filter(Boolean).length;
    if (count <= 2) return { score: 1, label: "Weak", color: "#EF4444" };
    if (count <= 4) return { score: 2, label: "Medium", color: "#F59E0B" };
    return { score: 3, label: "Strong", color: "#10B981" };
  }, [passwordChecks]);

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!signInEmail || !signInPassword) {
      setAuthError("Please enter your registered email address and password.");
      return;
    }

    setLoading(true);
    if (rememberMe) {
      localStorage.setItem("inavist_remember_me", "true");
      localStorage.setItem("inavist_saved_email", signInEmail);
    } else {
      localStorage.removeItem("inavist_remember_me");
      localStorage.removeItem("inavist_saved_email");
    }

    const res = await login(signInEmail, signInPassword);
    setLoading(false);
    if (!res?.success) {
      setAuthError(res?.message || "Invalid email or password. Please verify credentials.");
    }
  };

  const handleIndianSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!isPasswordValid) {
      setAuthError("Please satisfy all password security requirements before signing up.");
      return;
    }

    setLoading(true);
    const res = await registerIndianUser(indianForm);
    setLoading(false);
    if (res && !res.success) {
      setAuthError(res.message || "Registration failed. Please check your details.");
    }
  };

  const handleForeignerSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!isPasswordValid) {
      setAuthError("Please satisfy all password security requirements before signing up.");
      return;
    }

    setLoading(true);
    const res = await registerForeignerUser(foreignerForm);
    setLoading(false);
    if (res && !res.success) {
      setAuthError(res.message || "Foreigner registration failed. Please check your details.");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setAuthError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    setAuthError(null);
    const res = await resetPassword(forgotEmail);
    setLoading(false);
    if (res.success) {
      setForgotSuccess(true);
    } else {
      setAuthError(res.message || "Could not send password reset email. Please verify the address.");
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const cleaned = phoneInput.trim();
    if (!cleaned || cleaned.length < 9) {
      setAuthError("Please enter a valid mobile number with country code (e.g. +91 98765 43210).");
      return;
    }
    setLoading(true);
    const res = await sendPhoneOtp(cleaned);
    setLoading(false);
    if (res.success) {
      setOtpSent(true);
    } else {
      setAuthError(res.message || "Failed to send SMS code. Please verify the mobile number or try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const code = otpInput.trim();
    if (!code || code.length < 6) {
      setAuthError("Please enter the complete 6-digit SMS verification code.");
      return;
    }
    setLoading(true);
    const res = await verifyPhoneOtp(code, { phone: phoneInput.trim() });
    setLoading(false);
    if (!res.success) {
      setAuthError(res.message || "SMS verification code was invalid or expired.");
    }
  };

  const states = getAllStates();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: activeTab === "foreigner" ? "680px" : "520px",
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: "var(--radius-2xl, 24px)",
          background: isDark
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 29, 0.98) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
          border: "1.5px solid var(--border-subtle)",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.5)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.74rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase" }}>
              <ShieldCheck size={14} />
              <span>INAVIST Verified Identity & Pass</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.45rem", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0 0" }}>
              {activeTab === "signin" && "Sign In to Your Account"}
              {activeTab === "phone" && "Mobile SMS OTP Sign-In"}
              {activeTab === "signup" && "Create Indian Citizen Account"}
              {activeTab === "foreigner" && "International Tourist Registration"}
              {activeTab === "forgot" && "Reset Your Password"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
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

        {/* Tab Navigation Switcher (when not in forgot password) */}
        {activeTab !== "forgot" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1.15fr",
              gap: "4px",
              padding: "4px",
              borderRadius: "var(--radius-xl, 14px)",
              background: "var(--bg-tertiary)"
            }}
          >
            {[
              { id: "signin", label: "Email" },
              { id: "phone", label: "Phone OTP 📱" },
              { id: "signup", label: "Indian Citizen" },
              { id: "foreigner", label: "Int'l Tourist 🌍" }
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setAuthError(null);
                  }}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "var(--radius-lg, 10px)",
                    border: "none",
                    background: isSelected ? (isDark ? "#2563EB" : "#FFFFFF") : "transparent",
                    color: isSelected ? (isDark ? "#FFFFFF" : "#2563EB") : "var(--text-secondary)",
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    transition: "all var(--transition-fast)",
                    whiteSpace: "nowrap"
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Error Alert Banner */}
        {authError && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(220, 38, 38, 0.12)",
              border: "1px solid rgba(220, 38, 38, 0.35)",
              color: "#DC2626",
              fontSize: "0.80rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        {/* VIEW 1: SIGN IN */}
        {activeTab === "signin" && (
          <form onSubmit={handleSignInSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</label>
              <div style={{ position: "relative", marginTop: "4px" }}>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 12px 11px 36px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.90rem",
                    fontWeight: 600
                  }}
                />
                <Mail size={16} style={{ position: "absolute", left: "12px", top: "13px", color: "var(--text-muted)" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("forgot");
                    setAuthError(null);
                    setForgotSuccess(false);
                  }}
                  style={{ background: "none", border: "none", color: "#2563EB", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: "relative", marginTop: "4px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 38px 11px 36px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.90rem",
                    fontWeight: 600
                  }}
                />
                <Lock size={16} style={{ position: "absolute", left: "12px", top: "13px", color: "var(--text-muted)" }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "10px", top: "11px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              <input
                type="checkbox"
                id="rememberMeCheckbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: "pointer" }}
              />
              <label htmlFor="rememberMeCheckbox" style={{ cursor: "pointer", fontWeight: 600 }}>
                Remember me on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px",
                borderRadius: "var(--radius-xl, 14px)",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 900,
                fontSize: "0.92rem",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                marginTop: "4px"
              }}
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
              <span>{loading ? "Verifying Credentials..." : "Sign In to INAVIST"}</span>
            </button>

            {/* Social Logins & Demo Quick Access */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", fontWeight: 700, textTransform: "uppercase" }}>
                Or continue with instant login
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.80rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithSocial("Apple")}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.80rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span>Apple ID</span>
                </button>
              </div>

              <button
                type="button"
                onClick={loginWithDemo}
                style={{
                  padding: "9px 12px",
                  borderRadius: "10px",
                  background: isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.08)",
                  border: "1px dashed rgba(37,99,235,0.35)",
                  color: "#2563EB",
                  fontWeight: 800,
                  fontSize: "0.80rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <Sparkles size={14} />
                <span>1-Click Verified Demo Traveler Login</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW: PHONE NUMBER SMS OTP */}
        {activeTab === "phone" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Sign in or create your INAVIST account instantly using your mobile number and SMS verification code.
            </div>

            {/* Invisible reCAPTCHA Anchor */}
            <div id="recaptcha-container"></div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Mobile Number (With Country Code)
                  </label>
                  <div style={{ position: "relative", marginTop: "4px" }}>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      style={{
                        width: "100%",
                        padding: "11px 12px 11px 36px",
                        borderRadius: "10px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                        color: "var(--text-primary)",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        letterSpacing: "0.03em"
                      }}
                    />
                    <Phone size={16} style={{ position: "absolute", left: "12px", top: "13px", color: "var(--text-muted)" }} />
                  </div>
                  <div style={{ fontSize: "0.70rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    Include country code, e.g. <code>+91</code> for India, <code>+1</code> for USA.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-xl, 14px)",
                    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 900,
                    fontSize: "0.92rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
                  }}
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <Phone size={16} />}
                  <span>{loading ? "Sending SMS OTP..." : "Send Verification Code"}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ padding: "10px 14px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>Code sent to</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>{phoneInput}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpInput(""); }}
                    style={{ background: "none", border: "none", color: "#2563EB", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    Change Number
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    6-Digit SMS Verification Code
                  </label>
                  <div style={{ position: "relative", marginTop: "4px" }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      autoFocus
                      required
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 36px",
                        borderRadius: "10px",
                        border: "1.5px solid #2563EB",
                        background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                        color: "var(--text-primary)",
                        fontSize: "1.2rem",
                        fontWeight: 900,
                        letterSpacing: "0.3em",
                        textAlign: "center"
                      }}
                    />
                    <KeyRound size={16} style={{ position: "absolute", left: "12px", top: "16px", color: "var(--text-muted)" }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpInput.length < 6}
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius-xl, 14px)",
                    background: otpInput.length === 6 ? "linear-gradient(135deg, #10B981 0%, #059669 100%)" : "var(--bg-tertiary)",
                    color: otpInput.length === 6 ? "#FFFFFF" : "var(--text-muted)",
                    border: "none",
                    fontWeight: 900,
                    fontSize: "0.92rem",
                    cursor: otpInput.length === 6 && !loading ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: otpInput.length === 6 ? "0 4px 14px rgba(16, 185, 129, 0.35)" : "none"
                  }}
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  <span>{loading ? "Verifying Code..." : "Verify & Sign In"}</span>
                </button>
              </form>
            )}

            {/* Alternative Quick Logins */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", fontWeight: 700, textTransform: "uppercase" }}>
                Or continue with Google or Demo
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.80rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={loginWithDemo}
                  style={{
                    padding: "9px 12px",
                    borderRadius: "10px",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.80rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Sparkles size={14} />
                  <span>Demo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SIGN UP (INDIAN CITIZEN) */}
        {activeTab === "signup" && (
          <form onSubmit={handleIndianSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Full Name</label>
                <input
                  type="text"
                  value={indianForm.name}
                  onChange={(e) => setIndianForm({ ...indianForm, name: e.target.value })}
                  placeholder="Arjun Verma"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.86rem",
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Phone (Aadhaar Linked)</label>
                <input
                  type="tel"
                  value={indianForm.phone}
                  onChange={(e) => setIndianForm({ ...indianForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.86rem",
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</label>
              <input
                type="email"
                value={indianForm.email}
                onChange={(e) => setIndianForm({ ...indianForm, email: e.target.value })}
                placeholder="name@example.com"
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                  color: "var(--text-primary)",
                  fontSize: "0.86rem",
                  fontWeight: 600
                }}
              />
            </div>

            {/* Password with Live Checklist & Strength Meter */}
            <div>
              <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Password</label>
              <div style={{ position: "relative", marginTop: "4px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={indianForm.password}
                  onChange={(e) => setIndianForm({ ...indianForm, password: e.target.value })}
                  placeholder="Create strong password"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 38px 10px 12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${isPasswordValid ? "#10B981" : "var(--border-subtle)"}`,
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    fontWeight: 600
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "10px", top: "10px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {indianForm.password.length > 0 && (
                <div style={{ marginTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontWeight: 700 }}>
                    <span>Strength: <strong style={{ color: passwordScore.color }}>{passwordScore.label}</strong></span>
                  </div>
                  <div style={{ height: "4px", width: "100%", background: "var(--bg-tertiary)", borderRadius: "2px", marginTop: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: passwordScore.score === 1 ? "33%" : passwordScore.score === 2 ? "66%" : "100%",
                        background: passwordScore.color,
                        transition: "all 0.3s ease"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Dynamic Requirements Checklist */}
              <div
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: "8px",
                  background: isDark ? "rgba(0,0,0,0.2)" : "#F1F5F9",
                  border: "1px solid var(--border-subtle)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                  fontSize: "0.70rem"
                }}
              >
                {[
                  { label: "8+ characters", passed: passwordChecks.hasMinLength },
                  { label: "Uppercase letter (A-Z)", passed: passwordChecks.hasUpper },
                  { label: "Lowercase letter (a-z)", passed: passwordChecks.hasLower },
                  { label: "Number (0-9)", passed: passwordChecks.hasNumber },
                  { label: "Special character (!@#$)", passed: passwordChecks.hasSpecial }
                ].map((chk, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", color: chk.passed ? "#10B981" : "var(--text-muted)", fontWeight: chk.passed ? 800 : 500 }}>
                    {chk.passed ? <Check size={12} strokeWidth={3} /> : <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "1px solid var(--border-subtle)" }} />}
                    <span>{chk.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              style={{
                padding: "11px",
                borderRadius: "var(--radius-xl, 14px)",
                background: isPasswordValid ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "var(--bg-tertiary)",
                color: isPasswordValid ? "#FFFFFF" : "var(--text-muted)",
                border: "none",
                fontWeight: 900,
                fontSize: "0.90rem",
                cursor: isPasswordValid && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px"
              }}
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              <span>Create Account</span>
            </button>
          </form>
        )}

        {/* VIEW 3: INTERNATIONAL TOURIST REGISTRATION */}
        {activeTab === "foreigner" && (
          <form onSubmit={handleForeignerSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Name (As per Passport)</label>
                <input
                  type="text"
                  value={foreignerForm.passportName}
                  onChange={(e) => setForeignerForm({ ...foreignerForm, passportName: e.target.value })}
                  placeholder="Jane Elizabeth Doe"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.84rem",
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Country / Nationality</label>
                <select
                  value={foreignerForm.nationality}
                  onChange={(e) => setForeignerForm({ ...foreignerForm, nationality: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontSize: "0.84rem",
                    fontWeight: 600
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Passport Number</label>
                <input
                  type="text"
                  value={foreignerForm.passportNumber}
                  onChange={(e) => setForeignerForm({ ...foreignerForm, passportNumber: e.target.value })}
                  placeholder="e.g. PASS-998877"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.84rem",
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Indian e-Visa Number</label>
                <input
                  type="text"
                  value={foreignerForm.visaNumber}
                  onChange={(e) => setForeignerForm({ ...foreignerForm, visaNumber: e.target.value })}
                  placeholder="e.g. IN-EVSA-2026-8899"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.84rem",
                    fontWeight: 600
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Email Address</label>
              <input
                type="email"
                value={foreignerForm.email}
                onChange={(e) => setForeignerForm({ ...foreignerForm, email: e.target.value })}
                placeholder="traveler@example.com"
                required
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                  color: "var(--text-primary)",
                  fontSize: "0.84rem",
                  fontWeight: 600
                }}
              />
            </div>

            {/* Password with Live Requirements */}
            <div>
              <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Password</label>
              <div style={{ position: "relative", marginTop: "3px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={foreignerForm.password}
                  onChange={(e) => setForeignerForm({ ...foreignerForm, password: e.target.value })}
                  placeholder="Create secure password"
                  required
                  style={{
                    width: "100%",
                    padding: "9px 38px 9px 12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${isPasswordValid ? "#10B981" : "var(--border-subtle)"}`,
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.84rem",
                    fontWeight: 600
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "10px", top: "8px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Dynamic Requirements Checklist */}
              <div
                style={{
                  marginTop: "6px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  background: isDark ? "rgba(0,0,0,0.2)" : "#F1F5F9",
                  border: "1px solid var(--border-subtle)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                  fontSize: "0.68rem"
                }}
              >
                {[
                  { label: "8+ characters", passed: passwordChecks.hasMinLength },
                  { label: "Uppercase (A-Z)", passed: passwordChecks.hasUpper },
                  { label: "Lowercase (a-z)", passed: passwordChecks.hasLower },
                  { label: "Number (0-9)", passed: passwordChecks.hasNumber },
                  { label: "Special char (!@#$)", passed: passwordChecks.hasSpecial }
                ].map((chk, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", color: chk.passed ? "#10B981" : "var(--text-muted)", fontWeight: chk.passed ? 800 : 500 }}>
                    {chk.passed ? <Check size={11} strokeWidth={3} /> : <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "1px solid var(--border-subtle)" }} />}
                    <span>{chk.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              style={{
                padding: "11px",
                borderRadius: "var(--radius-xl, 14px)",
                background: isPasswordValid ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "var(--bg-tertiary)",
                color: isPasswordValid ? "#FFFFFF" : "var(--text-muted)",
                border: "none",
                fontWeight: 900,
                fontSize: "0.88rem",
                cursor: isPasswordValid && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px"
              }}
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Globe size={16} />}
              <span>Register International Tourist Pass</span>
            </button>
          </form>
        )}

        {/* VIEW 4: FORGOT PASSWORD */}
        {activeTab === "forgot" && (
          <form onSubmit={handleForgotPasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {forgotSuccess ? (
              <div
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1.5px solid rgba(16, 185, 129, 0.35)",
                  color: "#10B981",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, fontSize: "0.94rem" }}>
                  <CheckCircle2 size={18} />
                  <span>Password Reset Dispatched</span>
                </div>
                <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>
                  If an account exists for <strong>{forgotEmail}</strong>, we have dispatched a secure password recovery link valid for 30 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setForgotSuccess(false);
                  }}
                  style={{
                    alignSelf: "flex-start",
                    marginTop: "6px",
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full, 9999px)",
                    background: "#10B981",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 800,
                    fontSize: "0.76rem",
                    cursor: "pointer"
                  }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                  Enter your registered email address below. We'll send a secure password recovery link with instructions.
                </p>

                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Registered Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-subtle)",
                      background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                      color: "var(--text-primary)",
                      fontSize: "0.90rem",
                      fontWeight: 600,
                      marginTop: "4px"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "var(--radius-xl, 14px)",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                      fontWeight: 700,
                      fontSize: "0.86rem",
                      cursor: "pointer"
                    }}
                  >
                    Back to Sign In
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1.5,
                      padding: "11px",
                      borderRadius: "var(--radius-xl, 14px)",
                      background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                      color: "#FFFFFF",
                      border: "none",
                      fontWeight: 900,
                      fontSize: "0.88rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    {loading ? <RefreshCw size={16} className="animate-spin" /> : <KeyRound size={16} />}
                    <span>Send Reset Link</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
