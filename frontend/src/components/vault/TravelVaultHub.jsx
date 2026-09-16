import React, { useState } from "react";
import {
  FolderDown,
  HardDriveDownload,
  MapPin,
  Calendar,
  Utensils,
  Building,
  ShieldAlert,
  FileText,
  Wifi,
  WifiOff,
  Radio,
  Sparkles,
  Phone,
  Clock,
  Navigation,
  Compass,
  CheckCircle,
  Plus,
  Trash2,
  RefreshCw,
  Info,
  QrCode,
  Heart,
  Award,
  AlertTriangle,
  ChevronRight,
  Filter
} from "lucide-react";
import { useOfflineVault } from "../../context/OfflineVaultContext";
import { useTheme } from "../../context/ThemeContext";
import { OFFLINE_DESTINATIONS } from "../../data/offlineSamplePacks";

export const TravelVaultHub = () => {
  const {
    isOnline,
    isOffline,
    isLimited,
    networkMode,
    setNetworkMode,
    downloadedPacks,
    activeTripId,
    setActiveTripId,
    activeOfflinePack,
    openDownloadModalForDestination,
    deleteOfflinePack,
    updateOfflinePack,
    toggleItineraryActivity,
    addActivityNote,
    totalStorageMB
  } = useOfflineVault();

  const { isDark } = useTheme();

  // Active Tab inside Vault Workspace: 'map' | 'itinerary' | 'aroundMe' | 'emergency' | 'documents'
  const [vaultTab, setVaultTab] = useState("map");

  // Map Filter: 'all' | 'tourist' | 'hotel' | 'food' | 'hospital' | 'police' | 'petrol' | 'atm'
  const [mapCategory, setMapCategory] = useState("all");
  const [selectedMapPOI, setSelectedMapPOI] = useState(null);

  // New Note Input state for Itinerary activities
  const [activeNoteInputId, setActiveNoteInputId] = useState(null);
  const [noteText, setNoteText] = useState("");

  const pack = activeOfflinePack || OFFLINE_DESTINATIONS[0];

  // Filtered POIs for Offline Map & Around Me
  const filteredPOIs =
    mapCategory === "all"
      ? pack.offlinePOIs || []
      : (pack.offlinePOIs || []).filter((poi) => poi.category === mapCategory);

  const handleSaveNote = (dayNum, actId) => {
    if (noteText.trim()) {
      addActivityNote(dayNum, actId, noteText);
    }
    setActiveNoteInputId(null);
    setNoteText("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "16px 24px", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>
      {/* 1. Header & Network Simulation Controller */}
      <div
        className="glass-panel"
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 800, color: "var(--brand-saffron)", marginBottom: "4px" }}>
            <FolderDown size={14} />
            <span>OFFLINE TRAVEL VAULT</span>
          </div>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Travel Vault — Offline Trip Companion 🎒
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "2px" }}>
            Access downloaded maps, itineraries, food spots & emergency guides in remote hill stations & no-network zones.
          </p>
        </div>

        {/* Network Mode Simulator Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--bg-tertiary)",
            padding: "6px 10px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)"
          }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Network:
          </span>
          {[
            { id: "online", label: "Online 🟢", icon: Wifi },
            { id: "limited", label: "2G/3G 🟡", icon: Radio },
            { id: "offline", label: "Offline 🔴", icon: WifiOff }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setNetworkMode(mode.id)}
              style={{
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: networkMode === mode.id ? (isDark ? "#FFFFFF" : "#090E17") : "transparent",
                color: networkMode === mode.id ? (isDark ? "#090E17" : "#FFFFFF") : "var(--text-secondary)",
                fontWeight: networkMode === mode.id ? 800 : 600,
                fontSize: "0.78rem",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. My Offline Trips Horizontal Carousel */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 800 }}>My Offline Trips</h2>
            <span style={{ fontSize: "0.74rem", fontWeight: 700, padding: "2px 8px", background: "var(--brand-saffron-light)", color: "var(--brand-saffron)", borderRadius: "var(--radius-full)" }}>
              {downloadedPacks.length} Downloaded ({totalStorageMB} MB used)
            </span>
          </div>

          <button
            className="btn-primary"
            onClick={() => openDownloadModalForDestination(OFFLINE_DESTINATIONS[0])}
            style={{ padding: "7px 16px", fontSize: "0.82rem" }}
          >
            <HardDriveDownload size={14} />
            <span>Download New Pack</span>
          </button>
        </div>

        {/* Trips Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
          {downloadedPacks.map((item) => {
            const isActive = item.id === pack.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTripId(item.id)}
                className="glass-card"
                style={{
                  padding: "14px",
                  cursor: "pointer",
                  borderRadius: "var(--radius-lg)",
                  border: isActive ? "2px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                  background: isActive
                    ? (isDark ? "rgba(234, 88, 12, 0.12)" : "rgba(234, 88, 12, 0.05)")
                    : "var(--bg-card)",
                  display: "flex",
                  gap: "12px",
                  position: "relative"
                }}
              >
                <img
                  src={item.heroImage}
                  alt={item.name}
                  style={{ width: "70px", height: "70px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ fontSize: "0.98rem", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </h3>
                    <span style={{ fontSize: "0.72rem", color: "#16A34A", fontWeight: 800 }}>✓ Downloaded</span>
                  </div>
                  <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", display: "block" }}>
                    {item.district}, {item.state}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                    <span>📦 {item.downloadSizeMB || 245} MB</span>
                    <span>•</span>
                    <span>🕒 {item.lastUpdated || "Cached prior to trip"}</span>
                  </div>
                </div>

                {/* Update & Delete Actions */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOfflinePack(item.id);
                    }}
                    title="Update offline pack"
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                  >
                    <RefreshCw size={13} />
                  </button>
                  {downloadedPacks.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOfflinePack(item.id);
                      }}
                      title="Delete offline pack"
                      style={{ background: "transparent", border: "none", color: "#DC2626", cursor: "pointer", padding: "4px" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Active Offline Trip Workspace */}
      <div
        className="glass-panel"
        style={{
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          border: "1px solid var(--border-subtle)"
        }}
      >
        {/* Workspace Destination Hero Banner */}
        <div
          style={{
            position: "relative",
            height: "180px",
            overflow: "hidden"
          }}
        >
          <img
            src={pack.heroImage}
            alt={pack.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,15,26,0.92) 0%, transparent 70%)" }} />

          <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "#16A34A", padding: "2px 8px", borderRadius: "var(--radius-full)", color: "#fff" }}>
                  OFFLINE PACK ACTIVE
                </span>
                <span style={{ fontSize: "0.78rem", opacity: 0.85 }}>Elevation: {pack.elevation}</span>
              </div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "3px 0 0" }}>
                {pack.name} — {pack.title}
              </h2>
              <p style={{ fontSize: "0.82rem", opacity: 0.9, maxWidth: "600px" }}>
                {pack.overview}
              </p>
            </div>

            {/* Offline Pre-cached Weather Widget */}
            {pack.cachedWeather && (
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(10px)",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "0.82rem"
                }}
              >
                <div style={{ fontWeight: 800, color: "#FCD34D", fontSize: "0.95rem" }}>
                  {pack.cachedWeather.temp} • {pack.cachedWeather.condition}
                </div>
                <div style={{ fontSize: "0.72rem", opacity: 0.8 }}>
                  Downloaded prior to departure • Humidity: {pack.cachedWeather.humidity}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            overflowX: "auto",
            padding: "10px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-tertiary)"
          }}
        >
          {[
            { id: "map", label: "Offline Map & POI Radar", icon: MapPin, badge: "Vector" },
            { id: "itinerary", label: "Day Itinerary & Notes", icon: Calendar, badge: `${pack.itinerary?.length || 3} Days` },
            { id: "aroundMe", label: "Around Me (Cached)", icon: Utensils, badge: `${pack.offlinePOIs?.length || 15} Places` },
            { id: "emergency", label: "Emergency & First Aid", icon: ShieldAlert, badge: "SOS", badgeColor: "#DC2626" },
            { id: "documents", label: "Offline Tickets & Vouchers", icon: FileText, badge: `${pack.storedDocuments?.length || 2}` }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = vaultTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setVaultTab(tab.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid",
                  borderColor: isActive ? (isDark ? "#FFFFFF" : "#090E17") : "transparent",
                  background: isActive ? (isDark ? "#FFFFFF" : "#090E17") : "transparent",
                  color: isActive ? (isDark ? "#090E17" : "#FFFFFF") : "var(--text-secondary)",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  whiteSpace: "nowrap",
                  transition: "all var(--transition-fast)"
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      background: tab.badgeColor ? tab.badgeColor : isActive ? "rgba(234, 88, 12, 0.25)" : "rgba(0,0,0,0.08)",
                      color: tab.badgeColor ? "#fff" : isActive ? "var(--brand-saffron)" : "var(--text-muted)"
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Offline Map & Vector POI Radar */}
        {vaultTab === "map" && (
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Map Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "rgba(22, 163, 74, 0.15)", color: "#16A34A", padding: "3px 10px", borderRadius: "var(--radius-full)", border: "1px solid rgba(22, 163, 74, 0.3)" }}>
                  ✓ Offline Map Available (No Internet Required)
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Center: {pack.coordinates.lat}° N, {pack.coordinates.lng}° E
                </span>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
                {[
                  { id: "all", label: "All POIs" },
                  { id: "tourist", label: "Attractions 🏔️" },
                  { id: "hotel", label: "Stays 🏨" },
                  { id: "food", label: "Cafes & Food ☕" },
                  { id: "hospital", label: "Hospitals 🏥" },
                  { id: "police", label: "Police 👮" },
                  { id: "petrol", label: "Fuel ⛽" },
                  { id: "atm", label: "ATMs 🏧" }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setMapCategory(c.id)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      border: "1px solid",
                      borderColor: mapCategory === c.id ? "var(--brand-saffron)" : "var(--border-subtle)",
                      background: mapCategory === c.id ? "var(--brand-saffron-light)" : "var(--bg-tertiary)",
                      color: mapCategory === c.id ? "var(--brand-saffron)" : "var(--text-secondary)",
                      fontSize: "0.75rem",
                      fontWeight: mapCategory === c.id ? 800 : 600,
                      cursor: "pointer"
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Offline Vector Map Canvas Simulation */}
            <div
              style={{
                position: "relative",
                height: "400px",
                width: "100%",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                background: isDark
                  ? "radial-gradient(ellipse at 50% 50%, #152238 0%, #0A101C 100%)"
                  : "radial-gradient(ellipse at 50% 50%, #E2E8F0 0%, #CBD5E1 100%)",
                border: "1px solid var(--border-subtle)"
              }}
            >
              {/* Grid Topography lines */}
              <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
                <defs>
                  <pattern id="offline-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#offline-grid)" />
                {/* Contour Hill Rings */}
                <circle cx="30%" cy="40%" r="90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="30%" cy="40%" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="75%" cy="65%" r="110" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
                <path d="M 50 150 Q 200 180 350 140 T 700 280" fill="none" stroke="#0E7490" strokeWidth="2.5" />
              </svg>

              {/* Watermark Label */}
              <div style={{ position: "absolute", top: "12px", left: "14px", pointerEvents: "none" }}>
                <span style={{ fontSize: "0.70rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                  CACHED VECTOR TOPOGRAPHY • PALANI HILLS GRID
                </span>
              </div>

              {/* Interactive POI Pins */}
              {filteredPOIs.map((poi, idx) => {
                // Scatter calculation for mock map grid
                const leftPos = `${15 + ((idx * 27) % 70)}%`;
                const topPos = `${20 + ((idx * 33) % 65)}%`;
                const isSelected = selectedMapPOI?.id === poi.id;

                let pinColor = "var(--brand-saffron)";
                if (poi.category === "hospital") pinColor = "#DC2626";
                if (poi.category === "police") pinColor = "#2563EB";
                if (poi.category === "food") pinColor = "#D97706";
                if (poi.category === "hotel") pinColor = "#0E7490";
                if (poi.category === "petrol") pinColor = "#7C3AED";

                return (
                  <div
                    key={poi.id}
                    onClick={() => setSelectedMapPOI(poi)}
                    style={{
                      position: "absolute",
                      left: leftPos,
                      top: topPos,
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      zIndex: isSelected ? 10 : 2,
                      transition: "transform 0.2s ease"
                    }}
                  >
                    <div
                      style={{
                        background: pinColor,
                        color: "#FFFFFF",
                        padding: "6px",
                        borderRadius: "50%",
                        boxShadow: isSelected ? "0 0 0 4px rgba(255,255,255,0.8), 0 4px 14px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.3)",
                        transform: isSelected ? "scale(1.25)" : "scale(1)"
                      }}
                    >
                      <MapPin size={16} />
                    </div>
                    <span
                      style={{
                        background: isDark ? "rgba(10, 15, 26, 0.85)" : "rgba(255, 255, 255, 0.9)",
                        color: "var(--text-primary)",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        marginTop: "2px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.15)"
                      }}
                    >
                      {poi.name.split(" ")[0]}
                    </span>
                  </div>
                );
              })}

              {/* Selected POI Floating Detail Card */}
              {selectedMapPOI && (
                <div
                  className="glass-card"
                  style={{
                    position: "absolute",
                    bottom: "14px",
                    left: "14px",
                    right: "14px",
                    maxWidth: "480px",
                    padding: "14px 18px",
                    borderRadius: "var(--radius-md)",
                    background: isDark ? "rgba(13, 19, 31, 0.95)" : "rgba(255, 255, 255, 0.95)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 20
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.70rem", fontWeight: 800, textTransform: "uppercase", color: "var(--brand-saffron)" }}>
                        {selectedMapPOI.category} • {selectedMapPOI.distanceKm} km from town center
                      </span>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, margin: "2px 0 4px" }}>
                        {selectedMapPOI.name}
                      </h4>
                      <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                        {selectedMapPOI.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedMapPOI(null)}
                      style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "10px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {selectedMapPOI.timings && <span>🕒 {selectedMapPOI.timings}</span>}
                    {selectedMapPOI.fee && <span>🎟️ {selectedMapPOI.fee}</span>}
                    {selectedMapPOI.phone && (
                      <a
                        href={`tel:${selectedMapPOI.phone}`}
                        style={{ color: "var(--brand-teal)", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Phone size={12} /> {selectedMapPOI.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Day-by-Day Saved Itinerary & Offline Reminders */}
        {vaultTab === "itinerary" && (
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Saved 3-Day Trip Itinerary</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Check completed places & add personal offline notes during your journey.
                </p>
              </div>

              <span style={{ fontSize: "0.75rem", color: "var(--brand-saffron)", fontWeight: 700 }}>
                100% Cached for Offline Use
              </span>
            </div>

            {pack.itinerary?.map((dayObj) => (
              <div
                key={dayObj.day}
                className="glass-card"
                style={{
                  padding: "16px 20px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span style={{ background: "var(--brand-saffron)", color: "#fff", fontWeight: 800, fontSize: "0.75rem", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
                    {dayObj.date}
                  </span>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800 }}>{dayObj.title}</h4>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {dayObj.activities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 14px",
                        background: act.checked ? "rgba(22, 163, 74, 0.06)" : "var(--bg-tertiary)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid",
                        borderColor: act.checked ? "rgba(22, 163, 74, 0.3)" : "transparent"
                      }}
                    >
                      <button
                        onClick={() => toggleItineraryActivity(dayObj.day, act.id)}
                        style={{
                          background: act.checked ? "#16A34A" : "var(--input-bg)",
                          border: "1px solid",
                          borderColor: act.checked ? "#16A34A" : "var(--border-subtle)",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          cursor: "pointer",
                          marginTop: "2px",
                          flexShrink: 0
                        }}
                      >
                        {act.checked && <CheckCircle size={14} />}
                      </button>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--brand-saffron)" }}>
                            {act.time}
                          </span>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, textDecoration: act.checked ? "line-through" : "none", color: act.checked ? "var(--text-muted)" : "var(--text-primary)" }}>
                            {act.title}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            📍 {act.location}
                          </span>
                        </div>

                        {/* Existing Note or Note Form */}
                        {act.note && (
                          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px", background: "rgba(0,0,0,0.04)", padding: "4px 8px", borderRadius: "4px" }}>
                            📝 Note: {act.note}
                          </div>
                        )}

                        {activeNoteInputId === act.id ? (
                          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                            <input
                              type="text"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Add personal offline reminder or tip..."
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.80rem", borderRadius: "4px", border: "1px solid var(--border-subtle)", background: "var(--input-bg)", color: "var(--input-text)" }}
                            />
                            <button
                              onClick={() => handleSaveNote(dayObj.day, act.id)}
                              className="btn-primary"
                              style={{ padding: "4px 12px", fontSize: "0.75rem" }}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveNoteInputId(act.id);
                              setNoteText(act.note || "");
                            }}
                            style={{ background: "transparent", border: "none", color: "var(--brand-teal)", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", marginTop: "4px", padding: 0 }}
                          >
                            + Edit / Add Note
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Around Me (Offline Food & Essential Services) */}
        {vaultTab === "aroundMe" && (
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Around Me — Offline Directory</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Previously cached restaurants, hotels, pharmacies, fuel stations & ATMs with offline phone numbers.
                </p>
              </div>

              <span style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", padding: "4px 10px", borderRadius: "var(--radius-full)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}>
                🕒 Last updated before your trip
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
              {pack.offlinePOIs?.map((poi) => (
                <div
                  key={poi.id}
                  className="glass-card"
                  style={{
                    padding: "16px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "0.70rem", fontWeight: 800, textTransform: "uppercase", color: "var(--brand-saffron)" }}>
                      {poi.category}
                    </span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)" }}>
                      {poi.distanceKm} km away
                    </span>
                  </div>

                  <h4 style={{ fontSize: "0.98rem", fontWeight: 800 }}>{poi.name}</h4>
                  <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {poi.desc}
                  </p>

                  <div style={{ marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                    {poi.timings && <span>🕒 {poi.timings}</span>}
                    {poi.phone && (
                      <a
                        href={`tel:${poi.phone}`}
                        style={{
                          color: "var(--brand-teal)",
                          fontWeight: 800,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Phone size={12} /> Call: {poi.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Emergency Mode & First Aid */}
        {vaultTab === "emergency" && (
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Emergency Action Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                color: "#FFFFFF",
                padding: "20px 24px",
                borderRadius: "var(--radius-lg)",
                boxShadow: "0 8px 24px rgba(220, 38, 38, 0.35)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  <ShieldAlert size={18} />
                  <span>OFFLINE EMERGENCY ASSISTANCE</span>
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "4px 0" }}>
                  {pack.name} Emergency Helplines
                </h3>
                <p style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                  Direct phone numbers work over standard GSM cell towers even when internet data is zero.
                </p>
              </div>

              <a
                href="tel:112"
                style={{
                  background: "#FFFFFF",
                  color: "#DC2626",
                  padding: "10px 22px",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Phone size={16} />
                <span>Call 112 (National SOS)</span>
              </a>
            </div>

            {/* Emergency Contacts List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
              {pack.emergencyGuide?.contacts?.map((c, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    padding: "14px 18px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: "0.92rem", fontWeight: 800 }}>{c.title}</h4>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{c.type} Helpline</span>
                  </div>
                  <a
                    href={`tel:${c.number}`}
                    className="btn-primary"
                    style={{ padding: "6px 14px", fontSize: "0.78rem", background: "#DC2626" }}
                  >
                    <Phone size={12} /> {c.number}
                  </a>
                </div>
              ))}
            </div>

            {/* Offline First Aid Handbook */}
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px" }}>
                Offline Hill Station First Aid Handbook 🩹
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px" }}>
                {pack.emergencyGuide?.firstAid?.map((fa, i) => (
                  <div
                    key={i}
                    className="glass-card"
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)"
                    }}
                  >
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--brand-saffron)", marginBottom: "8px" }}>
                      {fa.title}
                    </h4>
                    <ul style={{ paddingLeft: "18px", fontSize: "0.80rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                      {fa.steps.map((step, sIdx) => (
                        <li key={sIdx} style={{ marginBottom: "4px" }}>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Profile Card */}
            <div
              className="glass-card"
              style={{
                padding: "16px 20px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: isDark ? "rgba(14, 116, 144, 0.12)" : "rgba(14, 116, 144, 0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-teal)", fontWeight: 800, fontSize: "0.85rem" }}>
                <Heart size={16} />
                <span>Voluntary Traveler Medical Card (Offline Stored)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "10px", fontSize: "0.80rem" }}>
                <div><strong>Blood Group:</strong> O+ (Positive)</div>
                <div><strong>Allergies:</strong> None reported</div>
                <div><strong>Primary Emergency:</strong> Dr. Ramesh Verma (+91 98110 45220)</div>
                <div><strong>Insurance Policy:</strong> ICICI Lombard #TRV-881920</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Stored Offline Travel Documents & Booking Vouchers */}
        {vaultTab === "documents" && (
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Offline Travel Documents & Vouchers</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Encrypted local vouchers & verification QR codes accessible with zero internet.
                </p>
              </div>

              <span style={{ fontSize: "0.72rem", background: "rgba(22, 163, 74, 0.12)", color: "#16A34A", padding: "4px 10px", borderRadius: "var(--radius-full)", fontWeight: 700 }}>
                🔒 Secure Local Storage
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
              {pack.storedDocuments?.map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card"
                  style={{
                    padding: "20px",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.70rem", fontWeight: 800, color: "var(--brand-saffron)", textTransform: "uppercase" }}>
                        {doc.type === "hotel" ? "🏨 Hotel Voucher" : doc.type === "transport" ? "🚌 Bus E-Ticket" : "📜 Permit Voucher"}
                      </span>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, marginTop: "2px" }}>
                        {doc.title}
                      </h4>
                    </div>

                    <div
                      style={{
                        padding: "8px",
                        background: "#FFFFFF",
                        borderRadius: "6px",
                        border: "1px solid #E2E8F0"
                      }}
                    >
                      <QrCode size={40} color="#090E17" />
                    </div>
                  </div>

                  <div style={{ fontSize: "0.80rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div><strong>Booking Ref:</strong> <span style={{ fontFamily: "monospace" }}>{doc.bookingRef}</span></div>
                    {doc.confirmationCode && <div><strong>Confirmation Code:</strong> <span style={{ fontFamily: "monospace", color: "var(--brand-saffron)", fontWeight: 800 }}>{doc.confirmationCode}</span></div>}
                    {doc.dates && <div><strong>Dates:</strong> {doc.dates}</div>}
                    {doc.guestName && <div><strong>Guest:</strong> {doc.guestName}</div>}
                    {doc.route && <div><strong>Route:</strong> {doc.route}</div>}
                    {doc.pnr && <div><strong>PNR:</strong> <span style={{ fontFamily: "monospace" }}>{doc.pnr}</span></div>}
                  </div>

                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", background: "rgba(0,0,0,0.04)", padding: "8px 10px", borderRadius: "6px", marginTop: "auto" }}>
                    ℹ️ {doc.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
