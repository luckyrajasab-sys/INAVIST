import React, { useState } from "react";
import {
  User,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Mail,
  Calendar,
  Bookmark,
  Ticket,
  LogOut,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Trash2,
  FileText,
  Plane,
  Phone,
  QrCode,
  Award,
  FolderDown,
  HeartPulse,
  Share2,
  Lock,
  Layers,
  Edit3,
  Palette,
  Check,
  Save,
  X,
  CreditCard,
  Receipt,
  Download,
  IndianRupee,
  MessageCircle,
  Send,
  Users,
  Search,
  RefreshCw,
  Navigation
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { usePlanner } from "../../context/PlannerContext";
import { useRewards } from "../../context/RewardsContext";
import { useOfflineVault } from "../../context/OfflineVaultContext";
import { destinationsData, getAllStates } from "../../data/destinationsData";
import { mockTravelCompanions } from "../../data/companionsData";

const SAMPLE_PAYMENTS = [
  {
    id: "TXN-YATRI-998821",
    title: "Heritage Stay: The Carlton Hotel (Kodaikanal)",
    category: "Hotel & Stay",
    amount: 5400,
    date: "24 Aug 2026",
    status: "Completed",
    method: "UPI (Google Pay)",
    invoiceNumber: "INV-2026-0881"
  },
  {
    id: "TXN-YATRI-998802",
    title: "IRCTC Vande Bharat Express (Chennai to Madurai Junction)",
    category: "Train Booking",
    amount: 1720,
    date: "22 Aug 2026",
    status: "Completed",
    method: "HDFC Credit Card",
    invoiceNumber: "INV-2026-0842"
  },
  {
    id: "TXN-YATRI-998744",
    title: "Travel Vault: Kodaikanal Offline Trip Pack License",
    category: "Offline Pack",
    amount: 299,
    date: "20 Aug 2026",
    status: "Completed",
    method: "UPI (PhonePe)",
    invoiceNumber: "INV-2026-0791"
  },
  {
    id: "TXN-YATRI-998610",
    title: "ASI Monument Entry & Heritage Pass (Brihadeeswarar Temple)",
    category: "Monuments & Entry",
    amount: 150,
    date: "15 Aug 2026",
    status: "Completed",
    method: "Debit Card",
    invoiceNumber: "INV-2026-0622"
  }
];

export const UserProfile = ({ onSelectDestination, onBackdropChange, initialTab = "idcard" }) => {
  const { user, isAuthenticated, logout, setIsAuthModalOpen, openAuthModal, updateProfile, updateRegisteredLocation } = useAuth();
  const { currentLang, languagesList, changeLanguage } = useLanguage();
  const { theme, toggleTheme, isDark, accentColor, changeAccentColor, ACCENT_PALETTES } = useTheme();
  const { bookmarkedIds, toggleBookmark, bookedTickets, showToast } = usePlanner();
  const { totalPoints, membershipTier } = useRewards();
  const { downloadedPacks } = useOfflineVault();

  const [activeProfileTab, setActiveProfileTab] = useState(initialTab); // 'idcard' | 'footprint' | 'bookmarks' | 'tickets' | 'payments' | 'collab' | 'emergency' | 'settings'
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    homeCity: user?.homeCity || "",
    phone: user?.phone || "",
    travelStyle: user?.travelStyle || "Spiritual & Heritage Exploration",
    avatarId: "default-avatar",
    passportNumber: user?.passportNumber || "",
    visaNumber: user?.visaNumber || ""
  });

  // Manual Location Selection State
  const [manualCity, setManualCity] = useState("Bengaluru");
  const [manualState, setManualState] = useState("Karnataka");

  // Collaboration Chat State
  const [selectedChatCompanion, setSelectedChatCompanion] = useState(mockTravelCompanions[0]);
  const [companionSearch, setCompanionSearch] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "them", text: "Hey! I saw you're visiting Kodaikanal this weekend. Are you looking to share a cab to Pillar Rocks? 😊", time: "10:30 AM" },
    { sender: "me", text: "Hi Priya! Yes, definitely. Sharing a 4x4 cab sounds great and saves money.", time: "10:32 AM" },
    { sender: "them", text: "Awesome! Let's sync up at Coaker's Walk viewpoint tomorrow at 9 AM.", time: "10:35 AM" }
  ]);
  const [inputChatText, setInputChatText] = useState("");

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!inputChatText.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "me", text: inputChatText, time: "Just now" }
    ]);
    const sentText = inputChatText;
    setInputChatText("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "them", text: `Sounds great! Looking forward to traveling together around ${selectedChatCompanion.destination}.`, time: "Just now" }
      ]);
    }, 1200);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditingProfile(false);
    showToast("Profile changes saved successfully! ✓");
  };

  const allIndianStates = getAllStates();
  const [visitedStates, setVisitedStates] = useState([
    "Rajasthan", "Kerala", "Himachal Pradesh", "Ladakh", "Goa", "Uttarakhand",
    "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Maharashtra", "Gujarat", "Delhi", "Punjab", "West Bengal"
  ]);

  const toggleStateVisited = (st) => {
    if (visitedStates.includes(st)) {
      setVisitedStates(visitedStates.filter((s) => s !== st));
    } else {
      setVisitedStates([...visitedStates, st]);
      if (onBackdropChange) {
        onBackdropChange(st);
      }
    }
  };

  const bookmarkedDestinations = destinationsData.filter((d) =>
    bookmarkedIds.includes(d.id)
  );

  const filteredCompanions = mockTravelCompanions.filter(
    (c) =>
      c.name.toLowerCase().includes(companionSearch.toLowerCase()) ||
      c.destination.toLowerCase().includes(companionSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "40px 20px", display: "flex", justifyContent: "center" }}>
        <div
          className="glass-panel"
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "40px 32px",
            textAlign: "center",
            borderRadius: "var(--radius-xl)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px"
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "var(--brand-primary-light)",
              color: "var(--brand-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <User size={34} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Sign in to View Digital YĀTRI Profile</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Access your verified ID, Indian States Footprint tracker, downloaded offline packs, and e-Visa international passes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "6px" }}>
            <button className="btn-primary" onClick={() => openAuthModal("signin")} style={{ height: "44px" }}>
              Sign In to Existing Account
            </button>
            <button className="btn-secondary" onClick={() => openAuthModal("foreigner")} style={{ height: "44px", color: "var(--brand-saffron)" }}>
              🌍 International / Foreigner Sign Up
            </button>
            <button className="btn-ghost" onClick={() => openAuthModal("signup")} style={{ height: "40px", fontSize: "0.85rem" }}>
              🇮🇳 Indian Citizen Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser. Please select manually.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const loc = {
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
          formattedAddress: "Bengaluru, Karnataka, India"
        };
        updateRegisteredLocation(loc);
        setIsLocationModalOpen(false);
        showToast("✓ Approximate location registered: Bengaluru, Karnataka, India");
      },
      (err) => {
        setIsLocating(false);
        showToast("Location access permission was denied. Please select your city manually below.");
      },
      { timeout: 8000 }
    );
  };

  const handleManualLocationSave = () => {
    const loc = {
      city: manualCity,
      state: manualState,
      country: "India",
      formattedAddress: `${manualCity}, ${manualState}, India`
    };
    updateRegisteredLocation(loc);
    setIsLocationModalOpen(false);
    showToast(`✓ Registered location set to: ${loc.formattedAddress}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
      {/* 1. Advanced Profile Header with Locked Default Avatar & Registered Location */}
      <div
        className="glass-panel"
        style={{
          padding: "32px",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          {/* Permanent Official Avatar Display */}
          <div style={{ position: "relative" }}>
            <img
              src="/default-avatar.png"
              alt={user.name}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border: user.isForeigner ? "3px solid var(--brand-saffron)" : "3px solid #16A34A",
                boxShadow: "var(--shadow-md)"
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{user.name}</h1>
              {user.isForeigner ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(249, 115, 22, 0.15)",
                    color: "var(--brand-saffron)",
                    padding: "3px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.78rem",
                    fontWeight: 800
                  }}
                >
                  <Globe size={12} /> {user.nationality} Tourist (e-Visa Active)
                </span>
              ) : (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#16A34A",
                    padding: "3px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.78rem",
                    fontWeight: 800
                  }}
                >
                  <ShieldCheck size={12} /> Verified Indian Citizen
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "8px", fontSize: "0.86rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Mail size={15} /> {user.email}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Phone size={15} /> {user.phone || "+91 98765 43210"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={15} /> Member since {user.joinedDate || "March 2024"}
              </span>
            </div>

            {/* Current Registered Location Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full, 9999px)",
                  background: isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.25)",
                  color: "var(--brand-primary, #2563EB)",
                  fontSize: "0.80rem",
                  fontWeight: 700
                }}
              >
                <MapPin size={13} />
                <span>Registered Location: <strong>{user?.registeredLocation?.formattedAddress || "Bengaluru, Karnataka, India"}</strong></span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setManualCity(user?.registeredLocation?.city || "Bengaluru");
                  setManualState(user?.registeredLocation?.state || "Karnataka");
                  setIsLocationModalOpen(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Update Location
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              setEditForm({
                name: user?.name || "",
                homeCity: user?.homeCity || "",
                phone: user?.phone || "",
                travelStyle: user?.travelStyle || "Spiritual & Heritage Exploration",
                avatarId: "default-avatar",
                passportNumber: user?.passportNumber || "",
                visaNumber: user?.visaNumber || ""
              });
              setIsEditingProfile(true);
            }}
            className="btn-secondary"
            style={{ fontSize: "0.84rem", gap: "6px" }}
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={logout}
            className="btn-ghost"
            style={{ fontSize: "0.84rem", color: "#DC2626", gap: "6px" }}
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 2. Travel Statistics Dashboard Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px"
        }}
      >
        {[
          { label: "Total Bookings", value: user.stats?.totalBookings || 12, icon: Ticket, color: "#2563EB" },
          { label: "Completed Trips", value: user.stats?.completedTrips || 10, icon: CheckCircle, color: "#16A34A" },
          { label: "Saved Destinations", value: bookmarkedDestinations.length || 6, icon: Bookmark, color: "#EA580C" },
          { label: "INAVIST Reward Points", value: `${totalPoints.toLocaleString("en-IN")} Pts`, icon: Sparkles, color: "#7C3AED" },
          { label: "Membership Tier", value: membershipTier || "Silver Traveller", icon: Award, color: "#D97706" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="glass-card"
              style={{
                borderRadius: "var(--radius-xl, 16px)",
                padding: "16px 18px",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF"
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `${stat.color}15`,
                  color: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: "1.20rem", fontWeight: 900, color: "var(--text-primary)" }}>{stat.value}</div>
                <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsEditingProfile(false)}>
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "var(--bg-card-solid)",
              padding: "32px 28px",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xl)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditingProfile(false)}
              className="btn-ghost"
              style={{ position: "absolute", top: "16px", right: "16px", padding: "6px" }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "6px" }}>
              Edit Traveler Profile
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Update your personal travel details and contact info.
            </p>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Home City / State
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.homeCity}
                    onChange={(e) => setEditForm({ ...editForm, homeCity: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Primary Travel Style
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={editForm.travelStyle}
                  onChange={(e) => setEditForm({ ...editForm, travelStyle: e.target.value })}
                  required
                />
              </div>

              {user?.isForeigner && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      Passport Number
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={editForm.passportNumber}
                      onChange={(e) => setEditForm({ ...editForm, passportNumber: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      e-Visa Number
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={editForm.visaNumber}
                      onChange={(e) => setEditForm({ ...editForm, visaNumber: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: "100%", height: "44px", marginTop: "8px" }}>
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Navigation Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          borderBottom: "1px solid var(--border-subtle)"
        }}
      >
        {[
          { id: "idcard", label: "Digital YĀTRI ID", icon: QrCode },
          { id: "footprint", label: `States Footprint (${visitedStates.length}/28)`, icon: Layers },
          { id: "payments", label: `Payments & Invoices (${SAMPLE_PAYMENTS.length})`, icon: CreditCard },
          { id: "collab", label: "Companion & Stranger Chat", icon: MessageCircle },
          { id: "bookmarks", label: `Bookmarks (${bookmarkedDestinations.length})`, icon: Bookmark },
          { id: "tickets", label: `Booked Passes (${bookedTickets.length})`, icon: Ticket },
          { id: "emergency", label: "Medical & ICE Profile", icon: HeartPulse },
          { id: "settings", label: "Theme Colors & App Settings", icon: Palette }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeProfileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id)}
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                border: "none",
                background: isActive ? "var(--bg-card-solid)" : "transparent",
                color: isActive ? "var(--brand-saffron)" : "var(--text-secondary)",
                fontWeight: isActive ? 800 : 600,
                fontSize: "0.86rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: isActive ? "2px solid var(--brand-saffron)" : "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "all var(--transition-fast)"
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DIGITAL YĀTRI ID CARD */}
      {activeProfileTab === "idcard" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          <div
            className="glass-card"
            style={{
              padding: "28px",
              borderRadius: "var(--radius-xl)",
              background: isDark
                ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)",
              border: user.isForeigner ? "2px solid rgba(249, 115, 22, 0.4)" : "2px solid rgba(22, 163, 74, 0.4)",
              boxShadow: "var(--shadow-xl)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: user.isForeigner ? "rgba(249, 115, 22, 0.08)" : "rgba(22, 163, 74, 0.08)",
                pointerEvents: "none"
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--brand-saffron)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Republic of India • Incredible India
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                  {user.isForeigner ? "International Tourist Pass" : "YĀTRI Digital Passport"}
                </h3>
              </div>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  background: user.isForeigner ? "#EA580C" : "#16A34A",
                  color: "#fff",
                  fontSize: "0.70rem",
                  fontWeight: 800
                }}
              >
                VERIFIED
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.70rem", textTransform: "uppercase" }}>Holder Name</span>
                  <strong>{user.name}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.70rem", textTransform: "uppercase" }}>Nationality & ID</span>
                  <strong>{user.nationality} • {user.isForeigner ? user.passportNumber : "DigiLocker / Aadhaar"}</strong>
                </div>
                {user.isForeigner && (
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.70rem", textTransform: "uppercase" }}>Indian e-Visa Reference</span>
                    <strong style={{ color: "#16A34A" }}>{user.visaNumber} ({user.visaType})</strong>
                  </div>
                )}
                <div>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.70rem", textTransform: "uppercase" }}>YĀTRI Member ID</span>
                  <code style={{ fontSize: "0.78rem", background: "var(--bg-tertiary)", padding: "2px 6px", borderRadius: "4px" }}>{user.id}</code>
                </div>
              </div>

              <div
                style={{
                  background: "#FFFFFF",
                  padding: "10px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <QrCode size={80} color="#090E17" />
                <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#090E17" }}>SCAN VERIFY</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "18px", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.74rem", color: "var(--text-muted)" }}>
              <span>Ministry of Tourism / FRRO Compliant</span>
              <span>Valid through 2027</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="glass-panel" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={18} color="var(--brand-saffron)" />
                <span>Travel Milestones & Badges</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(user.badges || []).map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: "var(--bg-tertiary)",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)"
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{b.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>{b.name}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" }}>
                  <FolderDown size={16} color="#16A34A" />
                  <span>Downloaded Offline Packs ({downloadedPacks.length})</span>
                </h3>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                Kodaikanal, Ladakh and other remote destinations saved for zero-connectivity journeys.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATES VISITED FOOTPRINT CHECKLIST */}
      {activeProfileTab === "footprint" && (
        <div className="glass-panel" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Indian States & UTs Visited</h2>
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                Track your journeys across all 28 Indian States & 8 Union Territories. Tap any state to toggle visit status and preview its backdrop!
              </p>
            </div>
            <div style={{ background: "var(--brand-saffron-light)", color: "var(--brand-saffron)", padding: "6px 14px", borderRadius: "var(--radius-full)", fontWeight: 800, fontSize: "0.88rem" }}>
              {visitedStates.length} of {allIndianStates.length} Explored ({Math.round((visitedStates.length / allIndianStates.length) * 100)}%)
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px" }}>
            {allIndianStates.map((st) => {
              const isVisited = visitedStates.includes(st);
              return (
                <div
                  key={st}
                  onClick={() => toggleStateVisited(st)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    background: isVisited ? "rgba(22, 163, 74, 0.12)" : "var(--bg-tertiary)",
                    border: isVisited ? "1px solid rgba(22, 163, 74, 0.4)" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <span style={{ fontSize: "0.84rem", fontWeight: isVisited ? 800 : 500, color: isVisited ? "#16A34A" : "var(--text-primary)" }}>
                    {st}
                  </span>
                  <CheckCircle size={15} color={isVisited ? "#16A34A" : "var(--text-muted)"} fill={isVisited ? "#16A34A" : "none"} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PAYMENTS & TRANSACTIONS HISTORY */}
      {activeProfileTab === "payments" && (
        <div className="glass-panel" style={{ padding: "28px", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Receipt size={22} color="var(--brand-saffron)" />
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Payment & Transaction History</h2>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                View all your verified hotel bookings, train fares, offline pack licenses, and entry pass payments with downloadable GST invoices.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Spent</span>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--brand-saffron)" }}>
                ₹{SAMPLE_PAYMENTS.reduce((acc, p) => acc + p.amount, 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SAMPLE_PAYMENTS.map((payment) => (
              <div
                key={payment.id}
                className="glass-card"
                style={{
                  padding: "18px 20px",
                  borderRadius: "var(--radius-lg)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)) auto",
                  gap: "16px",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.70rem", fontWeight: 800, background: "var(--brand-saffron-light)", color: "var(--brand-saffron)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                      {payment.category}
                    </span>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{payment.date}</span>
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: "0.95rem" }}>{payment.title}</h4>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginTop: "3px" }}>
                    Txn ID: <code style={{ background: "var(--bg-tertiary)", padding: "1px 5px", borderRadius: "4px" }}>{payment.id}</code> • via {payment.method}
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 700, background: "rgba(22, 163, 74, 0.12)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                      ✓ {payment.status}
                    </span>
                    <button
                      onClick={() => showToast(`Downloading Invoice ${payment.invoiceNumber}...`)}
                      className="btn-ghost"
                      style={{ padding: "4px 8px", fontSize: "0.74rem", gap: "4px", color: "var(--brand-saffron)" }}
                      title="Download GST Invoice"
                    >
                      <Download size={13} />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMPANION CONNECT & STRANGER CHAT */}
      {activeProfileTab === "collab" && (
        <div className="glass-panel" style={{ padding: "24px", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageCircle size={22} color="#0EA5E9" />
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Travel Companion & Stranger Collaboration Chat</h2>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              Chat securely with verified travelers heading to the same destinations. Plan joint treks, split mountain cab costs, and share local food trails!
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "18px", minHeight: "440px" }}>
            {/* Sidebar list of active travelers */}
            <div style={{ background: "var(--bg-tertiary)", borderRadius: "var(--radius-lg)", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search companion / destination..."
                  value={companionSearch}
                  onChange={(e) => setCompanionSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 30px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-card)",
                    fontSize: "0.78rem",
                    color: "var(--text-primary)"
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", maxHeight: "360px" }}>
                {filteredCompanions.map((comp) => {
                  const isSelected = selectedChatCompanion?.id === comp.id;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => {
                        setSelectedChatCompanion(comp);
                        setChatMessages([
                          { sender: "them", text: `Hi! I saw you're also exploring ${comp.destination}. Are you looking to team up? 😊`, time: "Just now" }
                        ]);
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: "var(--radius-md)",
                        background: isSelected ? "var(--brand-saffron-light)" : "transparent",
                        border: isSelected ? "1px solid var(--brand-saffron)" : "1px solid transparent",
                        cursor: "pointer",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      <img src={comp.avatar} alt={comp.name} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: "0.84rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {comp.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--brand-saffron)", fontWeight: 600 }}>
                          📍 {comp.destination}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Box */}
            <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column" }}>
              {/* Chat Header */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={selectedChatCompanion.avatar} alt={selectedChatCompanion.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <h4 style={{ fontWeight: 800, fontSize: "0.92rem" }}>{selectedChatCompanion.name}</h4>
                    <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 600 }}>● Online • Traveling to {selectedChatCompanion.destination}</span>
                  </div>
                </div>

                <span style={{ fontSize: "0.72rem", background: "rgba(22, 163, 74, 0.12)", color: "#16A34A", padding: "3px 10px", borderRadius: "var(--radius-full)", fontWeight: 800 }}>
                  <ShieldCheck size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                  Identity Verified
                </span>
              </div>

              {/* Chat Message Stream */}
              <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", minHeight: "260px" }}>
                {chatMessages.map((msg, idx) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                        background: isMe ? "var(--brand-saffron)" : "var(--bg-tertiary)",
                        color: isMe ? "#FFFFFF" : "var(--text-primary)",
                        padding: "10px 14px",
                        borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                        fontSize: "0.85rem",
                        lineHeight: 1.4,
                        boxShadow: "var(--shadow-sm)"
                      }}
                    >
                      <div>{msg.text}</div>
                      <div style={{ fontSize: "0.65rem", marginTop: "4px", opacity: 0.75, textAlign: "right" }}>
                        {msg.time}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} style={{ padding: "12px 16px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder={`Message ${selectedChatCompanion.name} about ${selectedChatCompanion.destination}...`}
                  value={inputChatText}
                  onChange={(e) => setInputChatText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-tertiary)",
                    fontSize: "0.84rem",
                    color: "var(--text-primary)"
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: "0 16px" }}>
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 5. BOOKMARKED DESTINATIONS */}
      {activeProfileTab === "bookmarks" && (
        <div>
          {bookmarkedDestinations.length === 0 ? (
            <div className="glass-panel" style={{ padding: "40px", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
              <Bookmark size={36} color="var(--text-muted)" style={{ margin: "0 auto 10px" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>No bookmarks saved yet</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Browse 170+ destinations and tap the bookmark icon to save places for your future trips.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {bookmarkedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => onSelectDestination && onSelectDestination(dest)}
                  className="glass-card"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <img src={dest.images[0]} alt={dest.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                  <div style={{ padding: "14px" }}>
                    <h4 style={{ fontWeight: 800, fontSize: "0.95rem" }}>{dest.name}</h4>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {dest.district}, {dest.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. BOOKED PASSES & TICKETS */}
      {activeProfileTab === "tickets" && (
        <div className="glass-panel" style={{ padding: "28px", borderRadius: "var(--radius-xl)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "14px" }}>Active Travel Passes & Vouchers</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {bookedTickets.length > 0
              ? `You have ${bookedTickets.length} active bookings across Indian Rail, Volvos, and heritage stays.`
              : "No active bookings. Book trains, flights, or hotels in the Transport Hub & Hotels tab to see your e-vouchers here."}
          </p>
        </div>
      )}

      {/* 7. EMERGENCY MEDICAL & ICE PROFILE */}
      {activeProfileTab === "emergency" && (
        <div className="glass-panel" style={{ padding: "28px", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <HeartPulse size={22} color="#DC2626" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>In Case of Emergency (ICE) & Medical Record</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
            <div style={{ background: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Blood Group</span>
              <div style={{ fontWeight: 800, fontSize: "1rem", marginTop: "2px" }}>O+ (Universal Donor)</div>
            </div>
            <div style={{ background: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Emergency Contact</span>
              <div style={{ fontWeight: 800, fontSize: "1rem", marginTop: "2px" }}>{user.homeCountryContact || user.phone}</div>
            </div>
            <div style={{ background: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-md)" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Medical Conditions / Allergies</span>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", marginTop: "2px" }}>None Reported (NIL)</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. APP SETTINGS & THEME COLOR CUSTOMIZER */}
      {activeProfileTab === "settings" && (
        <div className="glass-panel" style={{ padding: "32px", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <Palette size={22} color="var(--brand-saffron)" />
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>App Settings & Theme Color Customizer</h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Personalize the visual identity of YĀTRI. Change your primary theme accent color, toggle light/dark modes, and set regional languages.
            </p>
          </div>

          <div style={{ background: "var(--bg-tertiary)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px", display: "block" }}>
              Select Website Accent Color
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
              {ACCENT_PALETTES.map((pal) => {
                const isSelected = accentColor.toLowerCase() === pal.hex.toLowerCase();
                return (
                  <div
                    key={pal.id}
                    onClick={() => {
                      changeAccentColor(pal.hex);
                      showToast(`Accent theme updated to ${pal.name}! 🎨`);
                    }}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      background: isSelected ? "var(--bg-card)" : "transparent",
                      border: isSelected ? `2px solid ${pal.hex}` : "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: pal.hex,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        flexShrink: 0
                      }}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: isSelected ? 800 : 600 }}>
                      {pal.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
            <div style={{ background: "var(--bg-tertiary)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px", display: "block" }}>
                Theme Mode
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => !isDark && toggleTheme()}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    border: isDark ? "2px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                    background: isDark ? "var(--bg-card)" : "transparent",
                    color: "var(--text-primary)",
                    fontWeight: isDark ? 800 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Moon size={16} />
                  <span>Dark Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => isDark && toggleTheme()}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    border: !isDark ? "2px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                    background: !isDark ? "var(--bg-card)" : "transparent",
                    color: "var(--text-primary)",
                    fontWeight: !isDark ? 800 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Sun size={16} color="#EA580C" />
                  <span>Bright Mode</span>
                </button>
              </div>
            </div>

            <div style={{ background: "var(--bg-tertiary)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px", display: "block" }}>
                Language
              </label>
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="select-field"
                style={{ padding: "10px 14px" }}
              >
                {languagesList.map((l) => (
                  <option key={l.code} value={l.code}>{l.name} ({l.nativeName})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
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
          onClick={() => setIsEditingProfile(false)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "520px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "var(--radius-2xl, 24px)",
              background: isDark
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 29, 0.98) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
              border: "1.5px solid var(--border-subtle)",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit3 size={20} color="#2563EB" />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Edit Traveler Profile
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
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

            <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Update your personal travel details, emergency contact numbers, and preferred travel style.
            </p>

            <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    fontWeight: 600
                  }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Home City / State
                  </label>
                  <input
                    type="text"
                    value={editForm.homeCity}
                    onChange={(e) => setEditForm({ ...editForm, homeCity: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                      color: "var(--text-primary)",
                      fontSize: "0.88rem",
                      fontWeight: 600
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                      color: "var(--text-primary)",
                      fontSize: "0.88rem",
                      fontWeight: 600
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Primary Travel Style
                </label>
                <input
                  type="text"
                  value={editForm.travelStyle}
                  onChange={(e) => setEditForm({ ...editForm, travelStyle: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.88rem",
                    fontWeight: 600
                  }}
                  required
                />
              </div>

              {user?.isForeigner && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={editForm.passportNumber}
                      onChange={(e) => setEditForm({ ...editForm, passportNumber: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                      e-Visa Number
                    </label>
                    <input
                      type="text"
                      value={editForm.visaNumber}
                      onChange={(e) => setEditForm({ ...editForm, visaNumber: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        fontWeight: 600
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: "var(--radius-lg, 10px)",
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: "11px",
                    borderRadius: "var(--radius-lg, 10px)",
                    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    border: "none",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
                  }}
                >
                  <Save size={16} />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOCATION UPDATE MODAL */}
      {isLocationModalOpen && (
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
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "500px",
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
                <MapPin size={20} color="#2563EB" />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  Update Registered Location
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
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

            <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              INAVIST respects your privacy: only approximate city/state is stored to recommend relevant transport terminals and nearby regional hubs. Exact GPS coordinates are never displayed publicly.
            </p>

            {/* Option 1: Browser Geolocation Auto-detect */}
            <button
              type="button"
              disabled={isLocating}
              onClick={handleDetectLocation}
              style={{
                padding: "12px",
                borderRadius: "var(--radius-xl, 14px)",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                color: "#FFFFFF",
                border: "none",
                fontWeight: 800,
                fontSize: "0.88rem",
                cursor: isLocating ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)"
              }}
            >
              {isLocating ? <RefreshCw size={16} className="animate-spin" /> : <Navigation size={16} />}
              <span>{isLocating ? "Requesting Approximate Location..." : "Auto-Detect via Browser Geolocation"}</span>
            </button>

            <div style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
              — Or Select Manually —
            </div>

            {/* Option 2: Manual Selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>City / District Hub</label>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="e.g. Bengaluru, Chennai, Mumbai, Jaipur"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC",
                    color: "var(--text-primary)",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    marginTop: "4px"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.70rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>State / Union Territory</label>
                <select
                  value={manualState}
                  onChange={(e) => setManualState(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "#0F172A" : "#FFFFFF",
                    color: "var(--text-primary)",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    marginTop: "4px"
                  }}
                >
                  {allIndianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleManualLocationSave}
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-lg, 10px)",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                  marginTop: "4px"
                }}
              >
                Save Selected Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
