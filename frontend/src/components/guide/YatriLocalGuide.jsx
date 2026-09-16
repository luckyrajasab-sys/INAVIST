import React, { useState, useEffect } from "react";
import {
  Compass,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Utensils,
  History,
  Footprints,
  Sparkles,
  BookOpen,
  Eye,
  Camera
} from "lucide-react";
import { destinationsData } from "../../data/destinationsData";
import { LocalPhrases } from "./LocalPhrases";

export const YatriLocalGuide = ({ onSelectDestination, onBackdropChange }) => {
  const [selectedDestId, setSelectedDestId] = useState(destinationsData[0]?.id || "ladakh-pangong");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const destination = destinationsData.find((d) => d.id === selectedDestId) || destinationsData[0];
  const heroBgImage = destination?.images?.[activePhotoIdx] || destination?.images?.[0] || "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=85";

  // Synchronize global page background picture with the active local guide destination photo
  useEffect(() => {
    if (heroBgImage && onBackdropChange) {
      onBackdropChange(heroBgImage);
    }
  }, [heroBgImage, onBackdropChange]);

  const handleToggleAudio = () => {
    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const text = `Welcome to ${destination.name} in ${destination.district}, ${destination.state}. ${destination.detailedDescription}`;
        const utter = new SpeechSynthesisUtterance(text);
        utter.onend = () => setIsPlayingAudio(false);
        utter.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utter);
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "20px 16px" }}>
      {/* Ultra-Transparent Floating Glass Header — Completely reveals the scenic page backdrop */}
      <div
        style={{
          position: "relative",
          padding: "32px 28px",
          borderRadius: "var(--radius-xl)",
          background: "rgba(9, 14, 23, 0.22)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          boxShadow: "inset 0 1px 1.5px rgba(255, 255, 255, 0.35), 0 12px 36px rgba(0, 0, 0, 0.25)",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <div style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(20, 184, 166, 0.25)",
                color: "#5EEAD4",
                border: "1px solid rgba(45, 212, 191, 0.4)",
                padding: "3px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.76rem",
                fontWeight: 800,
                backdropFilter: "blur(6px)"
              }}
            >
              <Compass size={13} />
              <span>YĀTRI Local • Digital Heritage Guide</span>
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(234, 88, 12, 0.25)",
                color: "#FDBA74",
                border: "1px solid rgba(251, 146, 60, 0.4)",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontWeight: 700,
                backdropFilter: "blur(6px)"
              }}
            >
              <MapPin size={12} />
              <span>{destination.district}, {destination.state}</span>
            </span>

            {destination.region && (
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "#FFFFFF",
                  padding: "3px 10px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  backdropFilter: "blur(6px)"
                }}
              >
                {destination.region} India
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: "8px",
              color: "#FFFFFF",
              textShadow: "0 2px 14px rgba(0, 0, 0, 0.8)"
            }}
          >
            {destination.name}
          </h1>

          <p
            style={{
              fontSize: "0.98rem",
              color: "rgba(255, 255, 255, 0.92)",
              lineHeight: 1.6,
              maxWidth: "720px",
              textShadow: "0 1px 8px rgba(0, 0, 0, 0.75)"
            }}
          >
            {destination.detailedDescription}
          </p>
        </div>

        {/* Action Controls & Destination Switcher */}
        <div
          style={{
            paddingTop: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px"
          }}
        >
          {/* Select Destination Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "260px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "rgba(255, 255, 255, 0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              Switch Spot:
            </span>
            <select
              className="select-field"
              value={selectedDestId}
              onChange={(e) => {
                if (isPlayingAudio && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                  setIsPlayingAudio(false);
                }
                setSelectedDestId(e.target.value);
                setActivePhotoIdx(0);
              }}
              style={{
                background: "rgba(9, 14, 23, 0.65)",
                backdropFilter: "blur(12px)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "8px 14px",
                fontSize: "0.86rem"
              }}
            >
              {destinationsData.map((d) => (
                <option key={d.id} value={d.id} style={{ background: "#090E17", color: "#FFFFFF" }}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Photos Switcher */}
          {destination.images && destination.images.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}>Views:</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {destination.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    style={{
                      width: "38px",
                      height: "28px",
                      borderRadius: "var(--radius-sm)",
                      overflow: "hidden",
                      border: activePhotoIdx === idx ? "2px solid #F97316" : "1px solid rgba(255, 255, 255, 0.35)",
                      cursor: "pointer",
                      padding: 0,
                      opacity: activePhotoIdx === idx ? 1 : 0.6,
                      transition: "all var(--transition-fast)"
                    }}
                    title={`View photo ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`Photo ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice Audio Guide Button */}
          <button
            onClick={handleToggleAudio}
            className="btn-primary"
            style={{
              padding: "9px 20px",
              fontSize: "0.88rem",
              background: isPlayingAudio ? "#DC2626" : "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
              boxShadow: isPlayingAudio ? "0 4px 16px rgba(220, 38, 38, 0.4)" : "0 4px 16px rgba(13, 148, 136, 0.35)"
            }}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX size={17} />
                <span>Pause Audio Guide</span>
              </>
            ) : (
              <>
                <Volume2 size={17} />
                <span>Listen to Audio Guide</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transparent Glass History & Timeline Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "22px" }}>
        {/* Left: History & Architectural Significance */}
        <div
          style={{
            padding: "24px",
            borderRadius: "var(--radius-xl)",
            background: "rgba(9, 14, 23, 0.22)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 8px 24px rgba(0, 0, 0, 0.18)",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-saffron)", fontWeight: 800, fontSize: "1.1rem" }}>
            <History size={20} />
            <span>Place History & Significance</span>
          </div>
          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {destination.detailedDescription}
          </p>

          <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "6px" }}>Key Architectural Facts</div>
            <ul style={{ paddingLeft: "18px", fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "4px" }}>
              <li>Region: <strong>{destination.region} India</strong> ({destination.district}, {destination.state})</li>
              <li>Estimated Visit Duration: <strong>3 to 4 Hours</strong></li>
              <li>Best Photography Hours: <strong>{destination.viewpointTimings?.bestTime || "Sunrise / Sunset"}</strong></li>
            </ul>
          </div>
        </div>

        {/* Right: Suggested Self-Guided Walking Route */}
        <div
          style={{
            padding: "24px",
            borderRadius: "var(--radius-xl)",
            background: "rgba(9, 14, 23, 0.22)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 8px 24px rgba(0, 0, 0, 0.18)",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#2DD4BF", fontWeight: 800, fontSize: "1.1rem" }}>
            <Footprints size={20} />
            <span>Suggested Walking Route</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--brand-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>1</span>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>Main Monument Entry & Audio Briefing</strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Inspect the outer stone ramparts and entrance gateway.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#0EA5E9", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>2</span>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>Inner Sanctum & Main Courtyard</strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Examine hand-carved pillars and historical frescoes.</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>3</span>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>Surrounding Secret Viewpoint & Local Dining</strong>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Head to nearby overlooks and sample regional cuisine.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Do's and Don'ts Cultural Guidelines */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
        <div style={{ background: "rgba(16, 185, 129, 0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "20px", borderRadius: "var(--radius-xl)" }}>
          <h4 style={{ color: "#10b981", fontWeight: 800, fontSize: "0.98rem", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <CheckCircle2 size={18} /> Cultural Do's
          </h4>
          <ul style={{ paddingLeft: "18px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Remove footwear before stepping onto sanctum floors or sacred platforms.</li>
            <li>Dress respectfully covering shoulders and knees when visiting heritage shrines.</li>
            <li>Carry a reusable water bottle and dispose of organic waste in designated bins.</li>
          </ul>
        </div>

        <div style={{ background: "rgba(239, 68, 68, 0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "20px", borderRadius: "var(--radius-xl)" }}>
          <h4 style={{ color: "#ef4444", fontWeight: 800, fontSize: "0.98rem", display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <AlertCircle size={18} /> Cultural Don'ts
          </h4>
          <ul style={{ paddingLeft: "18px", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>Do not use camera flash against ancient murals or petroglyphs.</li>
            <li>Do not touch, scratch, or lean heavily on ancient monolithic sculptures.</li>
            <li>Avoid loud audio devices inside natural sanctuaries and silent prayer areas.</li>
          </ul>
        </div>
      </div>

      {/* Local Phrasebook Integration */}
      <LocalPhrases />
    </div>
  );
};
