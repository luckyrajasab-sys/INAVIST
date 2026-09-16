import React from "react";
import {
  Compass,
  ShieldCheck,
  Globe,
  WifiOff,
  MapPin,
  Sparkles,
  Award,
  Heart,
  Users,
  Building,
  Train,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export const AboutPage = ({ onNavigateTab }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "28px 20px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      {/* Hero Banner */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          padding: "48px 36px",
          borderRadius: "var(--radius-2xl)",
          background: "linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(22, 163, 74, 0.12) 50%, rgba(14, 165, 233, 0.15) 100%), var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: "750px", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--brand-saffron-light)",
              color: "var(--brand-saffron)",
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.82rem",
              fontWeight: 800,
              marginBottom: "16px"
            }}
          >
            <Sparkles size={14} />
            <span>India • Travel • Tourism</span>
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "14px" }}>
            About <span style={{ color: "var(--brand-saffron)" }}>INAVIST</span>
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "var(--text-secondary)", marginBottom: "24px" }}>
            INAVIST is India's flagship smart travel companion platform designed to transform how millions of citizens and international travelers discover sacred heritage, misty hill stations, and hidden valleys — seamlessly online and completely offline.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={() => onNavigateTab("vault")}
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: "0.92rem", gap: "8px" }}
            >
              <WifiOff size={18} />
              <span>Explore Travel Vault Offline</span>
            </button>
            <button
              onClick={() => onNavigateTab("explore")}
              className="btn-secondary"
              style={{ padding: "12px 24px", fontSize: "0.92rem", gap: "8px" }}
            >
              <Compass size={18} />
              <span>Browse 170+ Destinations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Mission & Pillars Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Pillar 1 */}
        <div className="glass-card" style={{ padding: "28px", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(22, 163, 74, 0.15)", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WifiOff size={24} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Travel Vault — Zero-Network Tech</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Never get stranded in remote locations like Kodaikanal, Spiti, or dense Western Ghats. Download comprehensive offline packs with vector maps, emergency SOS grids, and stay contacts.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-card" style={{ padding: "28px", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(234, 88, 12, 0.15)", color: "var(--brand-saffron)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Globe size={24} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>All 28 States & UTs Heritage</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            From the grand Dravidian gopurams of Tamil Nadu to the snowy passes of Ladakh, INAVIST curates living cultural stories, sacred temple idols, local folklore, and state-level photo backdrops.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-card" style={{ padding: "28px", borderRadius: "var(--radius-xl)", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(14, 165, 233, 0.15)", color: "#0EA5E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>FRRO & e-Visa Friendly</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Designed for international globetrotters with dedicated Foreigner Registration, Passport & e-Visa tracking, verified safety ratings, and Tourist Police direct hotlines.
          </p>
        </div>
      </div>

      {/* Platform Statistics */}
      <div
        className="glass-panel"
        style={{
          padding: "36px",
          borderRadius: "var(--radius-xl)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
          textAlign: "center"
        }}
      >
        <div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "var(--brand-saffron)" }}>174+</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Curated Destinations</div>
        </div>
        <div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#16A34A" }}>28/28</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>States & UTs Covered</div>
        </div>
        <div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#0EA5E9" }}>500+</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Verified Stays & Havelis</div>
        </div>
        <div>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#7C3AED" }}>100%</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Offline Vault Ready</div>
        </div>
      </div>

      {/* Made with Pride Footer Card */}
      <div
        style={{
          padding: "24px",
          background: "var(--bg-tertiary)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          border: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.4rem" }}>🇮🇳</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>INAVIST • India • Travel • Tourism</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Designed with advanced AI and deep reverence for Indian culture and heritage.</div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab("explore")}
          className="btn-ghost"
          style={{ color: "var(--brand-saffron)", fontSize: "0.85rem", gap: "6px" }}
        >
          <span>Start Exploring</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
