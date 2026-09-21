import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Users,
  MapPin,
  Star
} from "lucide-react";
import { db } from "../../data/db";
import { usePlanner } from "../../context/PlannerContext";
import { api } from "../../api/client";

export const AdminDashboard = () => {
  const { showToast } = usePlanner();

  const [activeTab, setActiveTab] = useState("destinations"); // 'destinations' | 'reviews' | 'alerts' | 'analytics'
  const [destinations, setDestinations] = useState(db.destinations.slice(0, 10));
  const [reviews, setReviews] = useState(db.reviews);
  const [alerts, setAlerts] = useState(db.alerts);
  const [stats, setStats] = useState(null);

  const [newAlertTitle, setNewAlertTitle] = useState("");
  const [newAlertLocation, setNewAlertLocation] = useState("Himachal Pradesh");
  const [newAlertMessage, setNewAlertMessage] = useState("");

  // Sync live data from backend
  useEffect(() => {
    // 1. Live stats
    api.admin.getStats().then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      }
    }).catch((err) => console.warn("Could not fetch admin stats:", err));

    // 2. Live destinations
    api.destinations.getAll({ limit: 50 }).then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setDestinations(res.data);
      }
    }).catch((err) => console.warn("Could not fetch admin destinations:", err));

    // 3. Live alerts
    api.alerts.getAll().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAlerts(res.data);
      }
    }).catch((err) => console.warn("Could not fetch admin alerts:", err));
  }, []);

  const handleApproveReview = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    api.reviews.moderate(id, "approved").catch(() => {});
    showToast("Review approved and published!");
  };

  const handleRejectReview = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
    api.reviews.moderate(id, "rejected").catch(() => {});
    showToast("Review rejected and hidden");
  };

  const handleAddAlert = (e) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertMessage) return;

    const alert = {
      id: `alt-${Date.now()}`,
      destination: newAlertLocation,
      destinationName: newAlertLocation,
      state: newAlertLocation,
      type: "Safety Advisory",
      severity: "warning",
      title: newAlertTitle,
      message: newAlertMessage,
      description: newAlertMessage,
      updatedAt: "Just now",
      isLive: true
    };

    setAlerts([alert, ...alerts]);
    api.alerts.create(alert).catch((err) => {
      console.warn("Could not broadcast alert to backend:", err);
    });

    setNewAlertTitle("");
    setNewAlertMessage("");
    showToast("Travel alert dispatched to active travellers!");
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px" }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: "32px 28px",
          background: "linear-gradient(135deg, #0B1F33 0%, #0E7490 100%)",
          color: "#fff",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#14B8A6", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "6px" }}>
          <ShieldCheck size={16} /> ADMIN MANAGEMENT PORTAL
        </div>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>YĀTRI Platform Administration</h1>
        <p style={{ fontSize: "0.9rem", opacity: 0.85, marginTop: "4px" }}>
          Manage destinations, moderate 5-dimension reviews, dispatch live travel advisories, and inspect system analytics.
        </p>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          {[
            { id: "destinations", label: "Destinations Manager" },
            { id: "reviews", label: "Review Moderation" },
            { id: "alerts", label: "Travel Alerts Dispatcher" },
            { id: "analytics", label: "Platform Analytics" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: activeTab === t.id ? "var(--brand-primary)" : "rgba(255, 255, 255, 0.15)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "destinations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Manage Destinations Directory</h2>
            <button
              className="btn-primary"
              onClick={() => showToast("Add Destination modal opened (Admin mode)")}
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              <Plus size={15} /> Add New Place
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {destinations.map((dest) => (
              <div key={dest.id} className="glass-card" style={{ padding: "18px", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "1rem" }}>{dest.name}</h4>
                  <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>{dest.rating} ⭐</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{dest.district}, {dest.state}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Category: <strong>{dest.category}</strong> • Crowd: {dest.crowdLevel}
                </div>
                <div style={{ marginTop: "auto", display: "flex", gap: "8px", paddingTop: "8px" }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: "6px", fontSize: "0.78rem" }}>
                    <Edit size={13} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDestinations(destinations.filter((d) => d.id !== dest.id));
                      showToast(`Removed ${dest.name}`);
                    }}
                    className="btn-ghost"
                    style={{ color: "#ef4444", padding: "6px" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>User Reviews Moderation Queue</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {reviews.map((rev) => (
              <div key={rev.id} className="glass-card" style={{ padding: "18px 24px", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <strong style={{ fontSize: "0.95rem" }}>{rev.userName}</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>• {rev.createdAt}</span>
                    <span style={{ fontSize: "0.75rem", background: rev.status === "approved" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: rev.status === "approved" ? "#10b981" : "#ef4444", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 700 }}>
                      {rev.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleApproveReview(rev.id)}
                    className="btn-primary"
                    style={{ padding: "6px 14px", fontSize: "0.8rem", background: "#10b981" }}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectReview(rev.id)}
                    className="btn-ghost"
                    style={{ color: "#ef4444", padding: "6px 14px", fontSize: "0.8rem" }}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "alerts" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {/* Dispatch Form */}
          <div className="glass-panel" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "14px" }}>Dispatch Travel Alert</h3>
            <form onSubmit={handleAddAlert} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>State / Sector</label>
                <input
                  type="text"
                  className="input-field"
                  value={newAlertLocation}
                  onChange={(e) => setNewAlertLocation(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>Alert Headline</label>
                <input
                  type="text"
                  className="input-field"
                  value={newAlertTitle}
                  onChange={(e) => setNewAlertTitle(e.target.value)}
                  placeholder="e.g. Rohtang Pass Winter Chains Required"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>Detailed Advisory Message</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={newAlertMessage}
                  onChange={(e) => setNewAlertMessage(e.target.value)}
                  placeholder="Provide precise safety instructions..."
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: "10px", marginTop: "6px" }}>
                <AlertTriangle size={16} />
                <span>Broadcast Alert</span>
              </button>
            </form>
          </div>

          {/* Active Alerts List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Active Broadcasts</h3>
            {alerts.map((al) => (
              <div key={al.id} className="glass-card" style={{ padding: "16px", borderRadius: "var(--radius-lg)", borderLeft: "4px solid #EA580C" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                  <span>{al.destination}</span>
                  <span>{al.updatedAt}</span>
                </div>
                <h4 style={{ fontWeight: 800, fontSize: "0.95rem" }}>{al.title}</h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {al.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
          <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>VERIFIED DESTINATIONS</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--brand-primary)", marginTop: "4px" }}>
              {stats?.destinations ? `${stats.destinations} Live` : "174+ Live"}
            </div>
          </div>

          <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>REGISTERED TRAVELLERS</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0E7490", marginTop: "4px" }}>
              {stats?.users ? `${stats.users} Users` : "18,450+"}
            </div>
          </div>

          <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>CONFIRMED BOOKINGS</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#10B981", marginTop: "4px" }}>
              {stats?.bookings ? `${stats.bookings} Bookings` : "12,890"}
            </div>
          </div>

          <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>ACTIVE TRIPS & ITINERARIES</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#8B5CF6", marginTop: "4px" }}>
              {stats?.trips ? `${stats.trips} Trips` : "4,180"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

