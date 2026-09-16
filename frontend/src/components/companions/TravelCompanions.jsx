import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Calendar,
  MessageCircle,
  AlertOctagon,
  EyeOff,
  Search,
  Sparkles,
  Info,
  X,
  Send
} from "lucide-react";
import { mockTravelCompanions, safetyGuidelines } from "../../data/companionsData";
import { usePlanner } from "../../context/PlannerContext";

export const TravelCompanions = () => {
  const { showToast } = usePlanner();

  const [companions, setCompanions] = useState(mockTravelCompanions);
  const [search, setSearch] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [activeChatCompanion, setActiveChatCompanion] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessagesList, setChatMessagesList] = useState([]);

  const filteredCompanions = companions.filter((comp) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      comp.name.toLowerCase().includes(q) ||
      comp.destination.toLowerCase().includes(q) ||
      comp.city.toLowerCase().includes(q) ||
      comp.interests.some((i) => i.toLowerCase().includes(q))
    );
  });

  const handleReport = (comp) => {
    if (window.confirm(`Report profile for ${comp.name}? Our trust & safety team will review this report.`)) {
      showToast(`Report filed for ${comp.name}. Thank you for keeping Yatra safe.`);
    }
  };

  const handleBlock = (comp) => {
    if (window.confirm(`Block ${comp.name}? You will no longer see each other's profiles.`)) {
      setCompanions((prev) => prev.filter((c) => c.id !== comp.id));
      showToast(`Blocked ${comp.name}`);
    }
  };

  const handleStartChat = (comp) => {
    setActiveChatCompanion(comp);
    setChatMessagesList([
      { sender: "them", text: `Hi! I saw you're also planning to travel to ${comp.destination}. Are you looking to share transport? 😊`, time: "Just now" }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatMessagesList((prev) => [
      ...prev,
      { sender: "me", text: chatMessage, time: "Just now" }
    ]);
    setChatMessage("");

    setTimeout(() => {
      setChatMessagesList((prev) => [
        ...prev,
        { sender: "them", text: "Sounds great! Let's connect on Yatra and align on dates and itinerary.", time: "Just now" }
      ]);
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px" }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(14, 165, 233, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(139, 92, 246, 0.25)"
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
            <span>Verified Travel Companion Network</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Travel With Verified Companions
          </h1>
          <p style={{ fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "18px" }}>
            Find trusted travel partners to explore India, split cab costs to remote valleys, and share homestays with complete peace of mind.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              className="btn-secondary"
              onClick={() => setShowGuidelines(true)}
              style={{ padding: "8px 18px", fontSize: "0.85rem" }}
            >
              <Info size={16} color="var(--status-gem)" />
              <span>Safety & Privacy Guidelines</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div
        style={{
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "var(--radius-lg)",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "0.85rem",
          color: "var(--text-secondary)"
        }}
      >
        <ShieldCheck size={20} color="#10b981" style={{ flexShrink: 0 }} />
        <span>
          <strong>Privacy First:</strong> Government IDs and personal identity documents are never displayed publicly. All profiles undergo simulated background verification.
        </span>
      </div>

      {/* Search Input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--bg-card-solid)",
          padding: "10px 18px",
          borderRadius: "var(--radius-full)",
          border: "1px solid var(--border-subtle)",
          maxWidth: "480px"
        }}
      >
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by destination, hometown, or interests..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "0.92rem",
            color: "var(--text-primary)",
            width: "100%"
          }}
        />
      </div>

      {/* Companions Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "22px"
        }}
      >
        {filteredCompanions.map((comp) => (
          <div
            key={comp.id}
            className="glass-card"
            style={{
              padding: "24px",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            {/* Header with Avatar and Verification Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <img
                src={comp.avatar}
                alt={comp.name}
                style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-subtle)" }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                  {comp.name}, {comp.age}
                </h3>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  {comp.city}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#10b981",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.7rem",
                    fontWeight: 700
                  }}
                >
                  <CheckCircle size={11} />
                  <span>{comp.verificationBadge}</span>
                </div>
              </div>
            </div>

            {/* Target Destination & Dates */}
            <div
              style={{
                background: "var(--bg-tertiary)",
                borderRadius: "var(--radius-md)",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700 }}>
                <MapPin size={14} color="#f97316" />
                <span>Destination: {comp.destination}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <Calendar size={14} color="var(--brand-primary)" />
                <span>Dates: {comp.travelDates}</span>
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              "{comp.bio}"
            </p>

            {/* Interest Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {comp.interests.map((interest, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: "0.72rem",
                    background: "var(--bg-tertiary)",
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-primary)",
                    fontWeight: 600
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* Actions: Connect, Report, Block */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: "12px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <button
                className="btn-primary"
                onClick={() => handleStartChat(comp)}
                style={{ padding: "8px 18px", fontSize: "0.85rem" }}
              >
                <MessageCircle size={15} />
                <span>Connect</span>
              </button>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => handleReport(comp)}
                  className="btn-ghost"
                  style={{ padding: "6px", color: "var(--text-muted)" }}
                  title="Report Profile"
                >
                  <AlertOctagon size={16} />
                </button>

                <button
                  onClick={() => handleBlock(comp)}
                  className="btn-ghost"
                  style={{ padding: "6px", color: "var(--text-muted)" }}
                  title="Block User"
                >
                  <EyeOff size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Guidelines Modal */}
      {showGuidelines && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowGuidelines(false)}>
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: "100%",
              maxWidth: "540px",
              background: "var(--bg-card-solid)",
              padding: "28px",
              borderRadius: "var(--radius-xl)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuidelines(false)}
              className="btn-ghost"
              style={{ position: "absolute", top: "14px", right: "14px", padding: "6px", borderRadius: "50%" }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px" }}>
              Travel Companion Safety Guidelines
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Please review these essential safety rules before traveling with new companions across India.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {safetyGuidelines.map((guide, idx) => (
                <div key={idx} style={{ background: "var(--bg-tertiary)", padding: "12px 14px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--brand-primary)", marginBottom: "4px" }}>
                    {guide.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                    {guide.detail}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => setShowGuidelines(false)}
              style={{ width: "100%", marginTop: "20px", padding: "10px" }}
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* Direct Messaging Simulator */}
      {activeChatCompanion && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setActiveChatCompanion(null)}>
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "var(--bg-card-solid)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              height: "520px",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={activeChatCompanion.avatar}
                  alt={activeChatCompanion.name}
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{activeChatCompanion.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 600 }}>● Online (Verified Companion)</div>
                </div>
              </div>

              <button
                onClick={() => setActiveChatCompanion(null)}
                className="btn-ghost"
                style={{ padding: "6px", borderRadius: "50%" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {chatMessagesList.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    background: msg.sender === "me" ? "var(--brand-gradient)" : "var(--bg-tertiary)",
                    color: msg.sender === "me" ? "#fff" : "var(--text-primary)",
                    padding: "10px 14px",
                    borderRadius: msg.sender === "me" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                    fontSize: "0.88rem",
                    lineHeight: 1.4
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: "12px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                gap: "8px"
              }}
            >
              <input
                type="text"
                className="input-field"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={`Message ${activeChatCompanion.name}...`}
                style={{ padding: "10px 14px" }}
              />
              <button type="submit" className="btn-primary" style={{ padding: "10px 16px" }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
