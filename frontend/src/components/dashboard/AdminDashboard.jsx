import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Users,
  MapPin,
  Star,
  RefreshCw,
  Ticket,
  Eye,
  X
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePlanner } from "../../context/PlannerContext";
import { FirestoreService, adminService, destinationService } from "../../services/FirestoreService";

export const AdminDashboard = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = usePlanner();

  const [activeTab, setActiveTab] = useState("destinations"); // 'destinations' | 'reviews' | 'alerts' | 'analytics'
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [alerts, setAlerts] = useState([
    {
      id: "alt-init-1",
      destination: "Himachal Pradesh",
      title: "Rohtang & Atal Tunnel Advisory",
      message: "Heavy snowfall reported at high altitudes. Anti-skid tire chains mandatory for passenger vehicles.",
      updatedAt: "Active",
      isLive: true
    },
    {
      id: "alt-init-2",
      destination: "Kerala",
      title: "Monsoon Ferry Operating Hours",
      message: "Alappuzha - Kottayam public water ferry schedules modified during high tide hours.",
      updatedAt: "Active",
      isLive: true
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [newAlertTitle, setNewAlertTitle] = useState("");
  const [newAlertLocation, setNewAlertLocation] = useState("Himachal Pradesh");
  const [newAlertMessage, setNewAlertMessage] = useState("");

  // Modal states for Destination Create/Edit
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [isSubmittingDest, setIsSubmittingDest] = useState(false);
  const [destFormData, setDestFormData] = useState({
    name: "",
    state: "Himachal Pradesh",
    district: "",
    region: "North",
    category: "Mountain & Trekking",
    overview: "",
    rating: 4.8,
    reviewsCount: 150,
    crowdLevel: "Moderate",
    viewpointStatus: "Optimal",
    images: "",
    stayCost: 2500,
    foodCost: 800,
    travelCost: 600
  });

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Live destinations
      const dests = await destinationService.getDestinations({ limitCount: 100 });
      setDestinations(dests || []);

      // 2. Live reviews
      const allRevs = await adminService.getAllReviews(50);
      setReviews(allRevs || []);

      // 3. Live users
      const allUsers = await adminService.getAllUsers(50);
      setUsersList(allUsers || []);

      // 4. Live bookings
      const allBkgs = await adminService.getAllBookings(50);
      setBookingsList(allBkgs || []);
    } catch (err) {
      console.warn("[AdminDashboard] Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadAdminData();
    } else {
      setIsLoading(false);
    }
  }, [user?.role]);

  // Access Denied Screen for non-admins
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div style={{ padding: "60px 20px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div
          className="glass-card"
          style={{
            maxWidth: "540px",
            width: "100%",
            padding: "36px 28px",
            textAlign: "center",
            borderRadius: "var(--radius-xl)",
            border: "1px solid rgba(220, 38, 38, 0.25)"
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(220, 38, 38, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#DC2626"
            }}
          >
            <ShieldAlert size={34} />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: "8px" }}>Administrator Access Required</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "20px" }}>
            The YĀTRI Administration Portal is restricted to verified administrators. You do not have sufficient permissions to view or manage backend platform operations.
          </p>
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              background: "var(--bg-tertiary)",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              marginBottom: "24px"
            }}
          >
            Current authenticated role: <strong style={{ color: user?.role === "admin" ? "#16A34A" : "#DC2626" }}>{user?.role || "standard user / guest"}</strong>
          </div>
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal("signin")}
              className="btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: "0.9rem" }}
            >
              Sign In with Admin Account
            </button>
          ) : (
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Contact the system administrator if you believe your account should have admin privileges.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle Destination Modal Open (Add vs Edit)
  const handleOpenAddModal = () => {
    setEditingDest(null);
    setDestFormData({
      name: "",
      state: "Himachal Pradesh",
      district: "",
      region: "North",
      category: "Mountain & Trekking",
      overview: "",
      rating: 4.8,
      reviewsCount: 150,
      crowdLevel: "Moderate",
      viewpointStatus: "Optimal",
      images: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      stayCost: 2500,
      foodCost: 800,
      travelCost: 600
    });
    setIsDestModalOpen(true);
  };

  const handleOpenEditModal = (dest) => {
    setEditingDest(dest);
    setDestFormData({
      name: dest.name || "",
      state: dest.state || "Himachal Pradesh",
      district: dest.district || "",
      region: dest.region || "North",
      category: dest.category || "Mountain & Trekking",
      overview: dest.overview || "",
      rating: dest.rating || 4.8,
      reviewsCount: dest.reviewsCount || 100,
      crowdLevel: dest.crowdLevel || "Moderate",
      viewpointStatus: dest.viewpointStatus || "Optimal",
      images: Array.isArray(dest.images) ? dest.images.join(", ") : (dest.images || ""),
      stayCost: dest.estimatedCosts?.stay || 2500,
      foodCost: dest.estimatedCosts?.food || 800,
      travelCost: dest.estimatedCosts?.travel || 600
    });
    setIsDestModalOpen(true);
  };

  // Submit Destination (Create or Update in Firestore)
  const handleSaveDestination = async (e) => {
    e.preventDefault();
    if (!destFormData.name.trim() || !destFormData.state.trim()) {
      showToast("Please enter destination name and state", "warning");
      return;
    }

    setIsSubmittingDest(true);
    try {
      const imgArray = destFormData.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: destFormData.name.trim(),
        state: destFormData.state.trim(),
        district: destFormData.district.trim() || destFormData.name.trim(),
        region: destFormData.region,
        category: destFormData.category,
        overview: destFormData.overview.trim() || `Magnificent travel destination in ${destFormData.state}.`,
        rating: Number(destFormData.rating) || 4.8,
        reviewsCount: Number(destFormData.reviewsCount) || 100,
        crowdLevel: destFormData.crowdLevel,
        viewpointStatus: destFormData.viewpointStatus,
        images: imgArray.length > 0 ? imgArray : ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"],
        estimatedCosts: {
          stay: Number(destFormData.stayCost) || 2500,
          food: Number(destFormData.foodCost) || 800,
          travel: Number(destFormData.travelCost) || 600,
          entry: 100,
          activities: 500
        }
      };

      if (editingDest) {
        await adminService.updateDestination(editingDest.id, payload);
        setDestinations((prev) =>
          prev.map((d) => (d.id === editingDest.id ? { ...d, ...payload } : d))
        );
        showToast(`Updated "${payload.name}" successfully! ✨`);
      } else {
        const created = await adminService.addDestination(payload);
        setDestinations((prev) => [created, ...prev]);
        showToast(`Added new destination "${payload.name}"! 🚀`);
      }
      setIsDestModalOpen(false);
    } catch (err) {
      showToast("Operation failed: " + err.message, "error");
    } finally {
      setIsSubmittingDest(false);
    }
  };

  // Delete Destination
  const handleDeleteDestination = async (destId, destName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${destName}" from the database?`)) {
      return;
    }
    try {
      await adminService.deleteDestination(destId);
      setDestinations((prev) => prev.filter((d) => d.id !== destId));
      showToast(`Deleted "${destName}" from Firestore database.`);
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    }
  };

  // Review Moderation
  const handleModerateReview = async (reviewId, status) => {
    try {
      await adminService.moderateReview(reviewId, status);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
      );
      showToast(`Review marked as ${status.toUpperCase()}!`);
    } catch (err) {
      showToast("Moderation failed: " + err.message, "error");
    }
  };

  // Dispatch Travel Alert
  const handleAddAlert = (e) => {
    e.preventDefault();
    if (!newAlertTitle.trim() || !newAlertMessage.trim()) return;

    const alert = {
      id: `alt-${Date.now()}`,
      destination: newAlertLocation,
      destinationName: newAlertLocation,
      state: newAlertLocation,
      type: "Safety Advisory",
      severity: "warning",
      title: newAlertTitle.trim(),
      message: newAlertMessage.trim(),
      description: newAlertMessage.trim(),
      updatedAt: "Just now",
      isLive: true
    };

    setAlerts([alert, ...alerts]);
    setNewAlertTitle("");
    setNewAlertMessage("");
    showToast("Travel alert broadcasted to active travellers!");
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#14B8A6", fontWeight: 800, fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "6px" }}>
              <ShieldCheck size={16} /> LIVE FIRESTORE BACKEND CONSOLE
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>YĀTRI Platform Administration</h1>
            <p style={{ fontSize: "0.9rem", opacity: 0.85, marginTop: "4px" }}>
              Manage destinations, moderate traveler reviews, monitor real bookings and users, and dispatch live advisories.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="btn-secondary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              fontSize: "0.84rem",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)"
            }}
          >
            <RefreshCw size={14} className={isLoading ? "spin" : ""} /> Refresh Live Data
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: "8px", marginTop: "22px", flexWrap: "wrap" }}>
          {[
            { id: "destinations", label: `Destinations (${destinations.length})` },
            { id: "reviews", label: `Review Moderation (${reviews.length})` },
            { id: "alerts", label: `Travel Alerts (${alerts.length})` },
            { id: "analytics", label: `System Database & Users` }
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
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Destinations Tab */}
      {activeTab === "destinations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Manage Destinations Directory</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Directly connected to Firestore <code style={{ color: "var(--brand-primary)" }}>destinations</code> collection.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={handleOpenAddModal}
              style={{ padding: "8px 18px", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} /> Add New Place
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {destinations.slice(0, 30).map((dest) => (
              <div
                key={dest.id}
                className="glass-card"
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                {dest.images?.[0] && (
                  <img
                    src={dest.images[0]}
                    alt={dest.name}
                    style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"; }}
                  />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <h4 style={{ fontWeight: 800, fontSize: "1rem" }}>{dest.name}</h4>
                  <span style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 700 }}>
                    {dest.rating || 4.8} ⭐
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {dest.district}, {dest.state} ({dest.region || "India"})
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  Category: <strong>{dest.category}</strong> • Crowd: {dest.crowdLevel || "Moderate"}
                </div>
                <div style={{ marginTop: "auto", display: "flex", gap: "8px", paddingTop: "8px" }}>
                  <button
                    onClick={() => handleOpenEditModal(dest)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: "6px", fontSize: "0.78rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
                  >
                    <Edit size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDestination(dest.id, dest.name)}
                    className="btn-ghost"
                    style={{ color: "#ef4444", padding: "6px" }}
                    title="Delete Destination"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {destinations.length > 30 && (
            <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-muted)", padding: "12px" }}>
              Showing first 30 of {destinations.length} destinations in live Firestore.
            </div>
          )}
        </div>
      )}

      {/* 2. Reviews Moderation Tab */}
      {activeTab === "reviews" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>User Reviews Moderation Queue</h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Review and approve or reject traveler feedback from Firestore <code style={{ color: "var(--brand-primary)" }}>reviews</code> collection.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="glass-card" style={{ padding: "36px", textAlign: "center", borderRadius: "var(--radius-lg)" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No user reviews currently in the moderation queue.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="glass-card"
                  style={{
                    padding: "18px 24px",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}
                >
                  <div style={{ maxWidth: "70%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <strong style={{ fontSize: "0.95rem" }}>{rev.userName || "Traveler"}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>• {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent"}</span>
                      <span style={{ fontSize: "0.75rem", color: "#EA580C", fontWeight: 700 }}>• {rev.rating} ⭐</span>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          background: rev.status === "approved" ? "rgba(16,185,129,0.12)" : rev.status === "rejected" ? "rgba(239,68,68,0.12)" : "rgba(234,88,12,0.12)",
                          color: rev.status === "approved" ? "#10b981" : rev.status === "rejected" ? "#ef4444" : "#EA580C",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          fontWeight: 800
                        }}
                      >
                        {(rev.status || "pending").toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      Destination ID: <code>{rev.destinationId}</code>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                      "{rev.comment}"
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleModerateReview(rev.id, "approved")}
                      className="btn-primary"
                      style={{ padding: "6px 14px", fontSize: "0.8rem", background: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleModerateReview(rev.id, "rejected")}
                      className="btn-ghost"
                      style={{ color: "#ef4444", padding: "6px 14px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Alerts Dispatcher Tab */}
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

              <button type="submit" className="btn-primary" style={{ padding: "10px", marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
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

      {/* 4. Analytics & Database Tab */}
      {activeTab === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>VERIFIED DESTINATIONS</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--brand-primary)", marginTop: "4px" }}>
                {destinations.length} Live
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Stored in Firestore
              </div>
            </div>

            <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>REGISTERED USERS</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0E7490", marginTop: "4px" }}>
                {usersList.length} Active
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Firestore <code>users</code> collection
              </div>
            </div>

            <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>CONFIRMED BOOKINGS</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#10B981", marginTop: "4px" }}>
                {bookingsList.length} Bookings
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Firestore <code>bookings</code> collection
              </div>
            </div>

            <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>REVIEWS LOGGED</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#EA580C", marginTop: "4px" }}>
                {reviews.length} Reviews
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Firestore <code>reviews</code> collection
              </div>
            </div>
          </div>

          {/* Registered Users List */}
          <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={18} color="var(--brand-primary)" /> Registered User Accounts ({usersList.length})
            </h3>
            {usersList.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No user documents returned.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.84rem", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "8px" }}>Name</th>
                      <th style={{ padding: "8px" }}>Email / UID</th>
                      <th style={{ padding: "8px" }}>Role</th>
                      <th style={{ padding: "8px" }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "10px 8px", fontWeight: 700 }}>{u.name || "Anonymous Traveler"}</td>
                        <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>{u.email || u.id}</td>
                        <td style={{ padding: "10px 8px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              background: u.role === "admin" ? "rgba(220,38,38,0.12)" : "rgba(37,99,235,0.12)",
                              color: u.role === "admin" ? "#DC2626" : "#2563EB"
                            }}
                          >
                            {(u.role || "user").toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "10px 8px", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bookings Stream */}
          <div className="glass-card" style={{ padding: "20px", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Ticket size={18} color="#10B981" /> System Bookings Stream ({bookingsList.length})
            </h3>
            {bookingsList.length === 0 ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No booking documents returned.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.84rem", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                      <th style={{ padding: "8px" }}>PNR / ID</th>
                      <th style={{ padding: "8px" }}>User</th>
                      <th style={{ padding: "8px" }}>Route / Service</th>
                      <th style={{ padding: "8px" }}>Amount</th>
                      <th style={{ padding: "8px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsList.map((b) => (
                      <tr key={b.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td style={{ padding: "10px 8px", fontWeight: 800, color: "var(--brand-primary)" }}>
                          {b.pnrNumber || b.confirmationId || b.id.substring(0, 8)}
                        </td>
                        <td style={{ padding: "10px 8px", color: "var(--text-secondary)" }}>
                          {b.passengerName || b.userId}
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          {b.origin || b.source} → {b.destination}
                        </td>
                        <td style={{ padding: "10px 8px", fontWeight: 700 }}>
                          ₹{b.totalPrice || b.fare || 0}
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              background: b.status === "cancelled" ? "rgba(220,38,38,0.12)" : "rgba(16,185,129,0.12)",
                              color: b.status === "cancelled" ? "#DC2626" : "#10b981"
                            }}
                          >
                            {(b.status || "confirmed").toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Destination Create / Edit Modal */}
      {isDestModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px"
          }}
          onClick={() => setIsDestModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              background: "var(--bg-card-solid)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-xl)",
              overflowY: "auto",
              padding: "24px",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                {editingDest ? `Edit: ${editingDest.name}` : "Add New Destination to Firestore"}
              </h3>
              <button
                onClick={() => setIsDestModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Destination Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={destFormData.name}
                    onChange={(e) => setDestFormData({ ...destFormData, name: e.target.value })}
                    placeholder="e.g. Spiti Valley"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>State *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={destFormData.state}
                    onChange={(e) => setDestFormData({ ...destFormData, state: e.target.value })}
                    placeholder="e.g. Himachal Pradesh"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>District</label>
                  <input
                    type="text"
                    className="input-field"
                    value={destFormData.district}
                    onChange={(e) => setDestFormData({ ...destFormData, district: e.target.value })}
                    placeholder="e.g. Lahaul and Spiti"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Region</label>
                  <select
                    className="input-field"
                    value={destFormData.region}
                    onChange={(e) => setDestFormData({ ...destFormData, region: e.target.value })}
                  >
                    <option value="North">North India</option>
                    <option value="South">South India</option>
                    <option value="East">East India</option>
                    <option value="West">West India</option>
                    <option value="Central">Central India</option>
                    <option value="North-East">North-East India</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Category</label>
                  <input
                    type="text"
                    className="input-field"
                    value={destFormData.category}
                    onChange={(e) => setDestFormData({ ...destFormData, category: e.target.value })}
                    placeholder="e.g. High Altitude / Desert"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="input-field"
                    value={destFormData.rating}
                    onChange={(e) => setDestFormData({ ...destFormData, rating: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Image URL(s) (comma separated)</label>
                <input
                  type="text"
                  className="input-field"
                  value={destFormData.images}
                  onChange={(e) => setDestFormData({ ...destFormData, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>Stay Cost (₹/day)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={destFormData.stayCost}
                    onChange={(e) => setDestFormData({ ...destFormData, stayCost: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>Food Cost (₹/day)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={destFormData.foodCost}
                    onChange={(e) => setDestFormData({ ...destFormData, foodCost: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>Travel Cost (₹/day)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={destFormData.travelCost}
                    onChange={(e) => setDestFormData({ ...destFormData, travelCost: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Destination Overview & Travel Guide</label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={destFormData.overview}
                  onChange={(e) => setDestFormData({ ...destFormData, overview: e.target.value })}
                  placeholder="Write a captivating summary for travelers..."
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  disabled={isSubmittingDest}
                  className="btn-primary"
                  style={{ flex: 1, padding: "10px" }}
                >
                  {isSubmittingDest ? "Saving to Firestore..." : editingDest ? "Save Changes" : "Create Destination"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: "10px 18px" }}
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
