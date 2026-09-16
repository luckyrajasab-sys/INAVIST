import React, { useState } from "react";
import {
  ShieldAlert,
  Phone,
  MapPin,
  Share2,
  AlertTriangle,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  Copy,
  Volume2,
  ShieldCheck,
  X
} from "lucide-react";
import { usePlanner } from "../../context/PlannerContext";
import { api } from "../../api/client";

export const SOSCenter = () => {
  const {
    emergencyContacts,
    addEmergencyContact,
    deleteEmergencyContact,
    setPrimaryContact,
    showToast
  } = usePlanner();

  const [sosTriggered, setSosTriggered] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // Mock GPS Location
  const mockLocation = {
    latitude: "28.6139° N",
    longitude: "77.2090° E",
    address: "Connaught Place / Central District, New Delhi, India",
    accuracy: "±4 meters (Simulated High Precision GPS)"
  };

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    if (val >= 95) {
      setSosTriggered(true);
      setSliderValue(0);
      showToast("🚨 SOS Emergency Alert Activated & Broadcasted!");
      api.emergency.triggerSOS(mockLocation, "EMERGENCY SOS: Traveler triggered high-priority emergency slider").catch((err) => {
        console.warn("Could not dispatch SOS alert to backend:", err);
      });
    }
  };

  const handleCancelSOS = () => {
    setSosTriggered(false);
    setSliderValue(0);
    showToast("SOS Alert Deactivated");
  };

  const handleAddContactSubmit = (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    addEmergencyContact({
      name: newContactName,
      relation: newContactRelation || "Family Contact",
      phone: newContactPhone
    });

    setNewContactName("");
    setNewContactRelation("");
    setNewContactPhone("");
    setShowAddModal(false);
  };

  const handleSimulateCall = (contact) => {
    showToast(`Simulating emergency call to ${contact.name} (${contact.phone})... 📞`);
  };

  const handleCopyLocation = () => {
    const text = `EMERGENCY ALERT: I need immediate assistance. My simulated live GPS location is: ${mockLocation.latitude}, ${mockLocation.longitude} (${mockLocation.address}). Sent via Yatra 2.0 SOS.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast("Emergency coordinates copied to clipboard! 📋");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px" }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(239, 68, 68, 0.3)"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "10px"
            }}
          >
            <ShieldAlert size={14} />
            <span>24/7 National Emergency & Tourist Safety Suite</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px", color: "var(--text-primary)" }}>
            SOS Emergency System
          </h1>
          <p style={{ fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Instant access to emergency helplines, live GPS location sharing, and direct alerts to your registered emergency contacts.
          </p>

          <div
            style={{
              marginTop: "16px",
              fontSize: "0.78rem",
              background: "var(--bg-tertiary)",
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)"
            }}
          >
            <ShieldCheck size={16} color="#10b981" />
            <span>Demonstration mode: requires slide confirmation before activating to avoid false alarms.</span>
          </div>
        </div>
      </div>

      {/* Main SOS Trigger Center */}
      <div
        className="glass-panel"
        style={{
          padding: "32px",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "20px",
          background: sosTriggered ? "rgba(239, 68, 68, 0.15)" : "var(--bg-card-solid)",
          border: sosTriggered ? "2px solid #ef4444" : "1px solid var(--border-subtle)",
          transition: "all var(--transition-smooth)"
        }}
      >
        {!sosTriggered ? (
          <>
            {/* Big SOS Visual Button */}
            <div
              className="sos-pulse-btn"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 8px 30px rgba(239, 68, 68, 0.5)",
                userSelect: "none"
              }}
            >
              <ShieldAlert size={42} />
              <span style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05em", marginTop: "2px" }}>
                SOS
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>
                Slide to Activate Emergency Alarm
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "420px", marginTop: "4px" }}>
                Slide the bar completely to the right to simulate triggering your emergency distress beacon and dispatching GPS coordinates.
              </p>
            </div>

            {/* Slide to Trigger Slider */}
            <div
              style={{
                width: "100%",
                maxWidth: "360px",
                background: "var(--bg-tertiary)",
                borderRadius: "var(--radius-full)",
                padding: "6px",
                position: "relative",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                style={{
                  width: "100%",
                  accentColor: "#ef4444",
                  cursor: "pointer",
                  height: "36px"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em"
                }}
              >
                SLIDE TO ACTIVATE $\rightarrow$
              </div>
            </div>
          </>
        ) : (
          /* ACTIVE SOS STATE */
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "#ef4444",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "sosPulse 1.2s infinite"
              }}
            >
              <Volume2 size={44} />
            </div>

            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#ef4444" }}>
                EMERGENCY BEACON ACTIVE (SIMULATED)
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "480px", margin: "6px auto 0" }}>
                Broadcasting simulated distress signal with live GPS coordinates to primary contacts and nearest Indian Tourist Police post.
              </p>
            </div>

            {/* Live GPS Coordinates card */}
            <div
              style={{
                background: "var(--bg-card-solid)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "16px 20px",
                maxWidth: "480px",
                width: "100%",
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>
                  CURRENT GPS FIX
                </span>
                <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>
                  ● LIVE
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>
                {mockLocation.latitude}, {mockLocation.longitude}
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                {mockLocation.address}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Accuracy: {mockLocation.accuracy}
              </div>

              <button
                className="btn-secondary"
                onClick={handleCopyLocation}
                style={{ marginTop: "8px", padding: "8px 14px", fontSize: "0.82rem", justifyContent: "center" }}
              >
                <Copy size={15} />
                <span>Copy Emergency Message</span>
              </button>
            </div>

            <button
              className="btn-danger"
              onClick={handleCancelSOS}
              style={{ padding: "12px 28px", fontSize: "0.95rem" }}
            >
              Cancel SOS Alarm
            </button>
          </div>
        )}
      </div>

      {/* Emergency Contacts Management */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Emergency Contacts Directory
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Manage family members, friends, and official helplines stored securely in browser storage
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ padding: "8px 18px", fontSize: "0.85rem" }}
          >
            <Plus size={16} />
            <span>Add Emergency Contact</span>
          </button>
        </div>

        {/* Contacts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px"
          }}
        >
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="glass-card"
              style={{
                padding: "18px",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderLeft: contact.isPrimary ? "4px solid #ef4444" : "1px solid var(--border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{contact.name}</h3>
                    {contact.isPrimary && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "rgba(239, 68, 68, 0.12)", color: "#ef4444", padding: "2px 6px", borderRadius: "var(--radius-full)" }}>
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{contact.relation}</div>
                </div>

                {!contact.isOfficial && (
                  <button
                    onClick={() => deleteEmergencyContact(contact.id)}
                    className="btn-ghost"
                    style={{ padding: "4px", color: "var(--text-muted)" }}
                    title="Delete contact"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Phone size={16} color="#ef4444" />
                <span>{contact.phone}</span>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
                <button
                  className="btn-primary"
                  onClick={() => handleSimulateCall(contact)}
                  style={{ flex: 1, padding: "8px", fontSize: "0.82rem", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  <Phone size={14} />
                  <span>Call (Demo)</span>
                </button>

                {!contact.isPrimary && !contact.isOfficial && (
                  <button
                    className="btn-secondary"
                    onClick={() => setPrimaryContact(contact.id)}
                    style={{ padding: "8px 12px", fontSize: "0.78rem" }}
                  >
                    Make Primary
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div
            className="glass-panel animate-scale-up"
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "var(--bg-card-solid)",
              padding: "28px",
              borderRadius: "var(--radius-xl)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="btn-ghost"
              style={{ position: "absolute", top: "14px", right: "14px", padding: "6px", borderRadius: "50%" }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "16px" }}>
              Add Emergency Contact
            </h3>

            <form onSubmit={handleAddContactSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Contact Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Suman Sharma"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Relationship
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  placeholder="e.g. Mother, Spouse, Local Guide"
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: "12px", marginTop: "8px" }}>
                Save Emergency Contact
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
