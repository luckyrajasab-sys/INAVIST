import React from "react";
import { Sparkles, ExternalLink, ShieldCheck, CheckCircle2, Bookmark, Info } from "lucide-react";
import { seedGovTourism, seedTravelAlerts } from "../../data/seedData";

export const GovTourismHub = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px" }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(14, 116, 144, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(139, 92, 246, 0.15)",
              color: "var(--status-gem)",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "10px"
            }}
          >
            <ShieldCheck size={14} />
            <span>Official Government Tourism Schemes & Travel Advisories</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Government Tourism Hub
          </h1>
          <p style={{ fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Verified initiatives, pilgrimage rejuvenation schemes (PRASHAD), integrated tourism circuits (Swadesh Darshan), and official state tourism subsidies.
          </p>
        </div>
      </div>

      {/* Official Schemes Directory */}
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Verified Central & State Initiatives ({seedGovTourism.length})
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
          {seedGovTourism.map((scheme) => (
            <div
              key={scheme.id}
              className="glass-card"
              style={{
                padding: "24px",
                borderRadius: "var(--radius-xl)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                borderLeft: "4px solid #8B5CF6"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase" }}>
                    {scheme.category}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Verified: {scheme.lastVerified}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: "2px" }}>{scheme.name}</h3>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {scheme.ministry}
                </div>
              </div>

              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {scheme.description}
              </p>

              <div style={{ background: "var(--bg-tertiary)", padding: "12px 14px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>
                  ELIGIBILITY & BENEFITS
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {scheme.eligibility}
                </div>
                <ul style={{ paddingLeft: "16px", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {scheme.benefits?.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <a
                  href={scheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--brand-ocean)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none"
                  }}
                >
                  <span>Official Government Portal</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
