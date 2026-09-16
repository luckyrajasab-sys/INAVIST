import React, { useState } from "react";
import {
  Award,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  CheckCircle,
  Sparkles,
  Plus,
  Trash2,
  Image,
  Compass
} from "lucide-react";
import { usePlanner } from "../../context/PlannerContext";
import { destinationsData } from "../../data/destinationsData";

export const TravelPassport = ({ onSelectDestination }) => {
  const { visitedDestinations, toggleVisited, showToast } = usePlanner();
  const [showAddVisitedModal, setShowAddVisitedModal] = useState(false);
  const [selectedDestId, setSelectedDestId] = useState(destinationsData[0]?.id);
  const [memoryNote, setMemoryNote] = useState("");
  const [spending, setSpending] = useState(6500);

  // Derive Statistics
  const uniqueStates = new Set(visitedDestinations.map((d) => d.state));
  const uniqueDistricts = new Set(visitedDestinations.map((d) => d.district));
  const totalSpent = visitedDestinations.reduce((acc, d) => acc + (d.spending || 0), 0);

  const handleAddVisitedSubmit = (e) => {
    e.preventDefault();
    const dest = destinationsData.find((d) => d.id === selectedDestId);
    if (dest) {
      toggleVisited(dest, memoryNote, spending);
      setShowAddVisitedModal(false);
      setMemoryNote("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px" }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(245, 158, 11, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--brand-primary-light)",
              color: "var(--brand-primary)",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "10px"
            }}
          >
            <Award size={14} />
            <span>Digital India Travel Passport & Memory Log</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
            My Travel Passport
          </h1>
          <p style={{ fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Track your footprints across Indian states and districts, stamp visited heritage sites, and record travel memories.
          </p>

          <button
            className="btn-primary"
            onClick={() => setShowAddVisitedModal(true)}
            style={{ marginTop: "18px", padding: "10px 22px" }}
          >
            <Plus size={16} />
            <span>Stamp New Destination</span>
          </button>
        </div>
      </div>

      {/* Explorer Statistics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px"
        }}
      >
        <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            States & UTs Explored
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brand-primary)", marginTop: "4px" }}>
            {uniqueStates.size} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ 28+</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Districts Stamped
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0ea5e9", marginTop: "4px" }}>
            {uniqueDistricts.size}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Destinations Visited
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981", marginTop: "4px" }}>
            {visitedDestinations.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            Total Travel Spend
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
            ₹{totalSpent.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Visited Stamps Timeline */}
      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "16px" }}>
          Passport Stamps & Memories ({visitedDestinations.length})
        </h2>

        {visitedDestinations.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px"
            }}
          >
            {visitedDestinations.map((record) => {
              const original = destinationsData.find((d) => d.id === record.id);
              return (
                <div
                  key={record.id}
                  className="glass-card"
                  style={{
                    padding: "22px",
                    borderRadius: "var(--radius-xl)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Passport Stamp Visual Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      border: "2px dashed #10b981",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      color: "#10b981",
                      fontSize: "0.75rem",
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      transform: "rotate(-4deg)",
                      userSelect: "none"
                    }}
                  >
                    PASSPORT STAMP ✓
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {record.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      <MapPin size={13} color="#f97316" />
                      <span>{record.district}, {record.state}</span>
                    </div>
                  </div>

                  {original && (
                    <img
                      src={original.images[0]}
                      alt={record.name}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-md)"
                      }}
                    />
                  )}

                  {/* Visit Date & Spend */}
                  <div
                    style={{
                      background: "var(--bg-tertiary)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.82rem"
                    }}
                  >
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={13} /> {record.visitDate || "2025"}
                    </span>
                    <span>Approx Spend: <strong>₹{record.spending?.toLocaleString("en-IN")}</strong></span>
                  </div>

                  {/* Memory Note */}
                  {record.memoryNote && (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: 1.4 }}>
                      "{record.memoryNote}"
                    </p>
                  )}

                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
                    <button
                      className="btn-ghost"
                      onClick={() => original && onSelectDestination(original)}
                      style={{ fontSize: "0.8rem", padding: "4px 8px", color: "var(--brand-primary)" }}
                    >
                      View Destination
                    </button>

                    <button
                      onClick={() => original && toggleVisited(original)}
                      className="btn-ghost"
                      style={{ color: "#ef4444", fontSize: "0.8rem", padding: "4px 8px" }}
                    >
                      <Trash2 size={14} /> Remove Stamp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px",
              borderRadius: "var(--radius-xl)"
            }}
          >
            <Award size={36} color="var(--text-muted)" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Your Passport is Blank</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Explore destinations and click the <strong>Mark Visited</strong> checkmark to start stamping your digital Indian passport!
            </p>
          </div>
        )}
      </div>

      {/* Add Visited Modal */}
      {showAddVisitedModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddVisitedModal(false)}>
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: "100%",
              maxWidth: "440px",
              background: "var(--bg-card-solid)",
              padding: "28px",
              borderRadius: "var(--radius-xl)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "16px" }}>
              Add Destination to Passport
            </h3>

            <form onSubmit={handleAddVisitedSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Select Visited Destination
                </label>
                <select
                  className="select-field"
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                >
                  {destinationsData.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.district}, {d.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Approximate Spending (₹)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={spending}
                  onChange={(e) => setSpending(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Memory Note / Journal
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={memoryNote}
                  onChange={(e) => setMemoryNote(e.target.value)}
                  placeholder="What was the most memorable part of your trip?"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: "10px" }}>
                  Stamp to Passport ✈️
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddVisitedModal(false)}
                  style={{ padding: "10px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
