import React, { useState } from "react";
import {
  DownloadCloud,
  X,
  Check,
  CheckCircle2,
  HardDrive,
  MapPin,
  Compass,
  Utensils,
  Building,
  ShieldAlert,
  Train,
  FileText,
  Pause,
  Play,
  Sparkles,
  Layers,
  Info
} from "lucide-react";
import { useOfflineVault } from "../../context/OfflineVaultContext";
import { useTheme } from "../../context/ThemeContext";

export const OfflineDownloadModal = () => {
  const {
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    downloadTargetDestination,
    startDownloadPack,
    downloadTask,
    pauseDownload,
    resumeDownload,
    cancelDownload
  } = useOfflineVault();

  const { isDark } = useTheme();

  // Storage Quality tier: 'essential' (95 MB) | 'standard' (245 MB) | 'detailed' (480 MB)
  const [qualityTier, setQualityTier] = useState("standard");

  // Granular package customizer options
  const [selectedOptions, setSelectedOptions] = useState({
    guide: true,
    map: true,
    places: true,
    itinerary: true,
    food: true,
    hotels: true,
    emergency: true,
    transport: true,
    bookingDocs: true
  });

  if (!isDownloadModalOpen) return null;

  const destName = downloadTargetDestination?.name || "Kodaikanal";
  const destState = downloadTargetDestination?.state || "Tamil Nadu";
  const destImage =
    downloadTargetDestination?.images?.[0] ||
    "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80";

  // Calculate dynamic storage estimate
  const baseSize = qualityTier === "detailed" ? 440 : qualityTier === "essential" ? 80 : 220;
  const activeCount = Object.values(selectedOptions).filter(Boolean).length;
  const estimatedMB = Math.round(baseSize * (activeCount / 9) + 25);

  const toggleOption = (key) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartDownload = () => {
    startDownloadPack(downloadTargetDestination || { name: "Kodaikanal", state: "Tamil Nadu", id: "kodaikanal" }, {
      quality: qualityTier,
      customOptions: selectedOptions
    });
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "640px",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg, rgba(17, 24, 39, 0.96) 0%, rgba(10, 15, 26, 0.94) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 249, 250, 0.94) 100%)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Modal Header Bar */}
        <div
          style={{
            position: "relative",
            height: "140px",
            overflow: "hidden"
          }}
        >
          <img
            src={destImage}
            alt={destName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.65)"
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10, 15, 26, 0.9) 0%, transparent 60%)"
            }}
          />

          {/* Close button */}
          <button
            onClick={() => {
              if (downloadTask) cancelDownload();
              setIsDownloadModalOpen(false);
            }}
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>

          {/* Header Title */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "20px",
              color: "#FFFFFF"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", fontWeight: 800, color: "var(--brand-saffron)" }}>
              <DownloadCloud size={14} />
              <span>OFFLINE TRAVEL VAULT</span>
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "2px 0 0" }}>
              {destName} Offline Pack
            </h2>
            <span style={{ fontSize: "0.82rem", opacity: 0.85 }}>{destState}, India</span>
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ padding: "20px 24px" }}>
          {/* Active Download Progress State */}
          {downloadTask ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Preparing your {destName} trip...
                </span>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--brand-saffron)", margin: "4px 0" }}>
                  {downloadTask.progress}%
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  {downloadTask.currentStep}
                </p>
              </div>

              {/* Multi-stage Checklist Progress */}
              <div
                style={{
                  background: "var(--bg-tertiary)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.84rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    <Compass size={15} color="var(--brand-saffron)" /> Destination Guide & Culture
                  </span>
                  <span style={{ color: downloadTask.progress >= 25 ? "#16A34A" : "var(--text-muted)", fontWeight: 700 }}>
                    {downloadTask.progress >= 25 ? "Complete ✓" : "Queued"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.84rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    <MapPin size={15} color="#0E7490" /> Vector Map & POI Radar
                  </span>
                  <span style={{ color: downloadTask.progress >= 60 ? "#16A34A" : "var(--text-muted)", fontWeight: 700 }}>
                    {downloadTask.progress >= 60 ? "Complete ✓" : downloadTask.progress >= 25 ? "Downloading 68%..." : "Queued"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.84rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    <Utensils size={15} color="#D97706" /> Food, Stays & Itinerary
                  </span>
                  <span style={{ color: downloadTask.progress >= 85 ? "#16A34A" : "var(--text-muted)", fontWeight: 700 }}>
                    {downloadTask.progress >= 85 ? "Complete ✓" : "Queued"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.84rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    <ShieldAlert size={15} color="#DC2626" /> Emergency Numbers & Documents
                  </span>
                  <span style={{ color: downloadTask.progress >= 100 ? "#16A34A" : "var(--text-muted)", fontWeight: 700 }}>
                    {downloadTask.progress >= 100 ? "Complete ✓" : "Queued"}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "rgba(0, 0, 0, 0.1)",
                  borderRadius: "9999px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${downloadTask.progress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #EA580C 0%, #16A34A 100%)",
                    transition: "width 0.4s ease"
                  }}
                />
              </div>

              {/* Download Controls */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {downloadTask.isPaused ? (
                  <button
                    onClick={resumeDownload}
                    className="btn-secondary"
                    style={{ padding: "8px 18px", fontSize: "0.84rem" }}
                  >
                    <Play size={14} />
                    <span>Resume Download</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseDownload}
                    className="btn-secondary"
                    style={{ padding: "8px 18px", fontSize: "0.84rem" }}
                  >
                    <Pause size={14} />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={cancelDownload}
                  style={{
                    background: "transparent",
                    color: "var(--text-muted)",
                    border: "none",
                    fontSize: "0.84rem",
                    cursor: "pointer",
                    padding: "8px 14px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Configure Download Pack View */
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Storage Quality Tiers */}
              <div>
                <label style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
                  Map & Media Quality
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {[
                    { id: "essential", label: "Essential", size: "~95 MB", desc: "Guide & Key POIs" },
                    { id: "standard", label: "Standard", size: "~245 MB", desc: "Full Vector Map (Recommended)" },
                    { id: "detailed", label: "Detailed", size: "~480 MB", desc: "High-Res Photos & Terrain" }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setQualityTier(tier.id)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "var(--radius-md)",
                        border: "2px solid",
                        borderColor: qualityTier === tier.id ? "var(--brand-saffron)" : "var(--border-subtle)",
                        background: qualityTier === tier.id ? "var(--brand-saffron-light)" : "var(--bg-tertiary)",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all var(--transition-fast)"
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: "0.88rem", color: qualityTier === tier.id ? "var(--brand-saffron)" : "var(--text-primary)" }}>
                        {tier.label}
                      </div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginTop: "2px" }}>
                        {tier.size}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {tier.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Download Options Checkboxes */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Customize Offline Package
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--brand-saffron)", fontWeight: 700 }}>
                    Estimated Size: {estimatedMB} MB
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px"
                  }}
                >
                  {[
                    { key: "guide", label: "Destination Guide & Culture", icon: Compass },
                    { key: "map", label: "Offline Vector Map Grid", icon: MapPin },
                    { key: "places", label: "Tourist Spots & Timings", icon: Sparkles },
                    { key: "itinerary", label: "Day-by-Day Saved Itinerary", icon: Layers },
                    { key: "food", label: "Restaurants & Cafes", icon: Utensils },
                    { key: "hotels", label: "Hotels & Homestays", icon: Building },
                    { key: "emergency", label: "Hospitals & Police Numbers", icon: ShieldAlert },
                    { key: "transport", label: "Bus, Fuel & ATM Radar", icon: Train },
                    { key: "bookingDocs", label: "Booking Vouchers & PNR", icon: FileText }
                  ].map((opt) => {
                    const Icon = opt.icon;
                    const isChecked = selectedOptions[opt.key];
                    return (
                      <div
                        key={opt.key}
                        onClick={() => toggleOption(opt.key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          padding: "6px 8px",
                          borderRadius: "var(--radius-sm)",
                          background: isChecked ? "rgba(234, 88, 12, 0.08)" : "transparent"
                        }}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "4px",
                            border: "1px solid",
                            borderColor: isChecked ? "var(--brand-saffron)" : "var(--border-subtle)",
                            background: isChecked ? "var(--brand-saffron)" : "var(--input-bg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF",
                            flexShrink: 0
                          }}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <Icon size={14} color={isChecked ? "var(--brand-saffron)" : "var(--text-muted)"} />
                        <span style={{ fontSize: "0.80rem", fontWeight: isChecked ? 700 : 500, color: "var(--text-primary)" }}>
                          {opt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Network Warning Note */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  padding: "10px 14px",
                  background: isDark ? "rgba(217, 119, 6, 0.15)" : "rgba(217, 119, 6, 0.08)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(217, 119, 6, 0.2)",
                  fontSize: "0.78rem",
                  color: isDark ? "#FCD34D" : "#92400E"
                }}
              >
                <Info size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>
                  <strong>Weak Mobile Network Zone:</strong> Cell signals drop near Pillar Rocks, Berijam forest & Vattakanal trails. Downloading this pack allows 100% offline access.
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, height: "44px" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartDownload}
                  className="btn-primary"
                  style={{ flex: 2, height: "44px" }}
                >
                  <DownloadCloud size={17} />
                  <span>Download for Offline Use ({estimatedMB} MB)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
