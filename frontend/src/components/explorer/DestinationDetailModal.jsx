import React, { useState } from "react";
import {
  X,
  MapPin,
  Star,
  Clock,
  IndianRupee,
  ShieldCheck,
  Bus,
  Sparkles,
  Bookmark,
  CheckCircle,
  CalendarCheck,
  Phone,
  Compass,
  Languages,
  Eye,
  Building,
  Train,
  Plane,
  Car,
  Wifi,
  Coffee,
  Check,
  ChevronRight,
  Send,
  Trash2,
  Edit3
} from "lucide-react";
import { ViewpointBadge, CrowdBadge, HiddenGemBadge } from "../common/Badge";
import { usePlanner } from "../../context/PlannerContext";
import { useAuth } from "../../context/AuthContext";
import { FirestoreService } from "../../services/FirestoreService.js";

export const DestinationDetailModal = ({ destination, onClose, onPlanTrip, onNavigateHotels, onNavigateTransport }) => {
  const { isBookmarked, toggleBookmark, isVisited, toggleVisited, showToast } = usePlanner();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'hotels' | 'transport' | 'reviews'

  // Firestore Reviews State
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  // Firestore Favorites State
  const [isFav, setIsFav] = useState(false);

  // Subscribe to real-time reviews for this destination
  React.useEffect(() => {
    if (!destination?.id) return;
    const unsub = FirestoreService.subscribeDestinationReviews(destination.id, (cloudReviews) => {
      setReviews(cloudReviews);
    });
    return () => {
      if (unsub) unsub();
    };
  }, [destination?.id]);

  // Check if destination is favorited in Firestore
  React.useEffect(() => {
    if (user?.id && destination?.id) {
      FirestoreService.isFavorite(user.id, destination.id).then((fav) => {
        setIsFav(fav);
      });
    }
  }, [user?.id, destination?.id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !user?.id) {
      openAuthModal("signin");
      showToast("Please sign in to save this destination to your favorites!", "info");
      return;
    }

    try {
      if (isFav) {
        await FirestoreService.removeFavorite(user.id, destination.id);
        setIsFav(false);
        showToast("Removed from your favorites");
      } else {
        await FirestoreService.addFavorite(user.id, destination.id, destination);
        setIsFav(true);
        showToast("Saved to your favorites! ❤️");
      }
      toggleBookmark(destination.id);
    } catch (err) {
      showToast("Could not update favorite status", "error");
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user?.id) {
      openAuthModal("signin");
      showToast("Please sign in to write a review.", "info");
      return;
    }
    if (!newComment.trim()) {
      showToast("Please write a comment for your review.", "warning");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await FirestoreService.createReview(user.id, user, destination.id, {
        rating: newRating,
        comment: newComment.trim(),
        visitMonth: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
      });
      setNewComment("");
      setNewRating(5);
      showToast("Review submitted successfully! 🌟");
    } catch (err) {
      showToast("Failed to post review: " + err.message, "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    if (!editComment.trim()) return;
    try {
      await FirestoreService.updateReview(user.id, reviewId, {
        rating: editRating,
        comment: editComment.trim()
      });
      setEditingReviewId(null);
      showToast("Review updated successfully!");
    } catch (err) {
      showToast("Failed to update review: " + err.message, "error");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await FirestoreService.deleteReview(user.id, reviewId);
      showToast("Review deleted successfully");
    } catch (err) {
      showToast("Failed to delete review: " + err.message, "error");
    }
  };

  if (!destination) return null;

  const bookmarked = isFav || isBookmarked(destination.id);
  const visited = isVisited(destination.id);

  const approxTotalDay =
    destination.estimatedCosts.stay +
    destination.estimatedCosts.food +
    destination.estimatedCosts.entry +
    destination.estimatedCosts.activities;

  // Curated Hotels for this destination
  const sampleStays = [
    {
      id: `stay-${destination.id}-1`,
      name: `${destination.name} Heritage Palace & Nature Resort`,
      type: "Luxury Heritage / Resort",
      rating: 4.8,
      price: destination.estimatedCosts.stay * 2 || 3800,
      image: destination.images[1] || destination.images[0],
      amenities: ["Free Wi-Fi", "Mountain View", "Organic Dining", "Heated Pool"],
      tag: "Top Rated Stays"
    },
    {
      id: `stay-${destination.id}-2`,
      name: `The Whispering Pines Homestay (${destination.district})`,
      type: "Boutique Eco-Homestay",
      rating: 4.7,
      price: destination.estimatedCosts.stay || 1800,
      image: destination.images[0],
      amenities: ["Home Cooked Meals", "Bonfire", "Guided Trails", "Pet Friendly"],
      tag: "Best Value"
    },
    {
      id: `stay-${destination.id}-3`,
      name: `${destination.name} Backpackers Eco-Hostel & Homestay`,
      type: "Budget & Backpackers",
      rating: 4.6,
      pricePerNight: 750,
      badge: "Budget Friendly",
      amenities: ["Dorm / Private Beds", "Community Kitchen", "High-speed WiFi", "Bike Rental"],
      contact: "+91 76543 21098",
      bookingUrl: "#"
    }
  ];

  return (
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
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          background: "var(--bg-card-solid)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          overflowY: "auto",
          padding: 0,
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Hero Image Header */}
        <div style={{ position: "relative", width: "100%", height: "290px" }}>
          <img
            src={destination.images[0]}
            alt={destination.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)"
            }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "24px",
              right: "24px",
              color: "#fff"
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
              {destination.isHiddenGem && <HiddenGemBadge />}
              <ViewpointBadge status={destination.viewpointStatus} />
              <CrowdBadge level={destination.crowdLevel} />
            </div>

            <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "4px" }}>
              {destination.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={15} color="#f97316" />
                <span>{destination.district}, {destination.state} ({destination.region} India)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Star size={15} color="#EA580C" fill="#EA580C" />
                <span><strong>{averageRating}</strong> ({totalReviewsCount.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Section Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "0 24px",
            background: "var(--bg-tertiary)",
            borderBottom: "1px solid var(--border-subtle)"
          }}
        >
          {[
            { id: "overview", label: "Overview & Guide", icon: Compass },
            { id: "hotels", label: `Hotels & Stays (${sampleStays.length})`, icon: Building },
            { id: "transport", label: "Transport & Reach", icon: Bus },
            { id: "reviews", label: `Reviews (${reviews.length})`, icon: Star }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 18px",
                  border: "none",
                  background: "transparent",
                  color: isActive ? "var(--brand-saffron)" : "var(--text-secondary)",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.86rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderBottom: isActive ? "2px solid var(--brand-saffron)" : "2px solid transparent",
                  transition: "all var(--transition-fast)"
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Container */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* Action Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleToggleFavorite}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  background: bookmarked ? "var(--brand-primary-light)" : "var(--bg-tertiary)",
                  color: bookmarked ? "var(--brand-primary)" : "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
                <span>{bookmarked ? "Saved in Favorites ✓" : "Add to Favorites"}</span>
              </button>

              <button
                onClick={() => toggleVisited(destination)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  background: visited ? "rgba(22, 163, 74, 0.12)" : "var(--bg-tertiary)",
                  color: visited ? "#16A34A" : "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <CheckCircle size={15} fill={visited ? "#16A34A" : "none"} />
                <span>{visited ? "Visited ✓" : "Mark as Visited"}</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onPlanTrip) onPlanTrip(destination);
              }}
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.84rem" }}
            >
              <CalendarCheck size={16} />
              <span>Smart Plan Trip Here</span>
            </button>
          </div>

          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Description */}
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "8px" }}>About {destination.name}</h3>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
                  {destination.description}
                </p>
              </div>

              {/* Viewpoint Info Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "14px",
                  background: "var(--bg-tertiary)",
                  padding: "16px",
                  borderRadius: "var(--radius-lg)"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Visiting Timings
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.88rem" }}>
                    <Clock size={15} color="var(--brand-saffron)" />
                    <span>{destination.viewpointTimings?.open} - {destination.viewpointTimings?.close}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Prime Photography Window
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.88rem" }}>
                    <Eye size={15} color="#0ea5e9" />
                    <span>{destination.viewpointTimings?.bestTime}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Best Seasons to Visit
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.88rem" }}>
                    <Compass size={15} color="#10b981" />
                    <span>{destination.bestVisitingMonths}</span>
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div
                className="glass-card"
                style={{
                  padding: "18px",
                  background: "linear-gradient(135deg, rgba(255, 107, 0, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%), var(--bg-card-solid)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Estimated Daily Expense Breakdown</h4>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--brand-saffron)" }}>
                    ₹{approxTotalDay.toLocaleString("en-IN")} / day
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
                  <div style={{ background: "var(--bg-tertiary)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
                    <span style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>Stay / Night</span>
                    <div style={{ fontWeight: 700, fontSize: "0.90rem" }}>₹{destination.estimatedCosts.stay}</div>
                  </div>
                  <div style={{ background: "var(--bg-tertiary)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
                    <span style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>Food & Dining</span>
                    <div style={{ fontWeight: 700, fontSize: "0.90rem" }}>₹{destination.estimatedCosts.food}</div>
                  </div>
                  <div style={{ background: "var(--bg-tertiary)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
                    <span style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>Local Travel</span>
                    <div style={{ fontWeight: 700, fontSize: "0.90rem" }}>₹{destination.estimatedCosts.travel}</div>
                  </div>
                  <div style={{ background: "var(--bg-tertiary)", padding: "8px 12px", borderRadius: "var(--radius-md)" }}>
                    <span style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>Entry / Permits</span>
                    <div style={{ fontWeight: 700, fontSize: "0.90rem" }}>{destination.entryFee > 0 ? `₹${destination.entryFee}` : "Free"}</div>
                  </div>
                </div>
              </div>

              {/* Safety Rating */}
              <div style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-lg)", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", color: "#10b981", fontWeight: 700, fontSize: "0.90rem" }}>
                  <ShieldCheck size={17} />
                  <span>Safety Rating: {destination.safetyRating} / 5.0 — Verified Guidelines</span>
                </div>
                <ul style={{ paddingLeft: "18px", fontSize: "0.84rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "3px" }}>
                  {destination.safetyTips?.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 2. HOTELS & STAYS TAB */}
          {activeTab === "hotels" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                  Curated Stays in {destination.name} & {destination.district}
                </h3>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>500+ Verified Properties</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {sampleStays.map((stay) => (
                  <div
                    key={stay.id}
                    className="glass-card"
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-lg)",
                      display: "grid",
                      gridTemplateColumns: "140px 1fr auto",
                      gap: "16px",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={stay.image}
                      alt={stay.name}
                      style={{ width: "100%", height: "95px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.68rem", background: "var(--brand-saffron-light)", color: "var(--brand-saffron)", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 800 }}>
                          {stay.tag}
                        </span>
                        <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{stay.type}</span>
                      </div>
                      <h4 style={{ fontWeight: 800, fontSize: "0.95rem" }}>{stay.name}</h4>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                        {stay.amenities.map((am, i) => (
                          <span key={i} style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", padding: "2px 6px", borderRadius: "4px", color: "var(--text-secondary)" }}>
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--brand-saffron)" }}>
                          ₹{stay.price.toLocaleString("en-IN")}
                        </div>
                        <span style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>/ night</span>
                      </div>
                      <button
                        onClick={() => showToast(`Booking confirmed for ${stay.name} at ₹${stay.price}/night!`)}
                        className="btn-primary"
                        style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                      >
                        Book Stay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. TRANSPORT & CONNECTIVITY TAB */}
          {activeTab === "transport" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                Transit & Route Connectivity to {destination.name}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                {/* Flights */}
                <div className="glass-card" style={{ padding: "16px", borderRadius: "var(--radius-lg)", borderLeft: "3px solid #0ea5e9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#0ea5e9", fontWeight: 700 }}>
                    <Plane size={18} />
                    <span>Nearest Airport</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>
                    {destination.nearestAirport || `${destination.district} / Regional Airport`}
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Direct connection to major Indian metros (DEL, BOM, BLR).
                  </p>
                </div>

                {/* Trains */}
                <div className="glass-card" style={{ padding: "16px", borderRadius: "var(--radius-lg)", borderLeft: "3px solid #f97316" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#f97316", fontWeight: 700 }}>
                    <Train size={18} />
                    <span>IRCTC Rail Hub</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>
                    {destination.nearestRailway || `${destination.district} Junction`}
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Vande Bharat & Superfast Express connectivity.
                  </p>
                </div>

                {/* Road / Cabs */}
                <div className="glass-card" style={{ padding: "16px", borderRadius: "var(--radius-lg)", borderLeft: "3px solid #16a34a" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#16a34a", fontWeight: 700 }}>
                    <Car size={18} />
                    <span>Highway & 4x4 Cabs</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>
                    All-Weather NH Access
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    State Volvos, Greenliners & Outstation SUV Cabs available.
                  </p>
                </div>
              </div>

              {/* Transport modes badges */}
              <div style={{ marginTop: "4px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  Available Direct Transport Options:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {destination.availableTransport?.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "var(--bg-tertiary)",
                        padding: "6px 14px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. REVIEWS & RATINGS TAB */}
          {activeTab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Reviews Summary Header */}
              <div
                className="glass-card"
                style={{
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  background: "var(--bg-tertiary)"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "2rem", fontWeight: 900, color: "#EA580C" }}>
                      {destination.rating || "4.8"}
                    </span>
                    <div>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={16} color="#EA580C" fill="#EA580C" />
                        ))}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {reviews.length} Verified Community Reviews
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  All reviews synced live with Cloud Firestore
                </div>
              </div>

              {/* Write a Review Section */}
              <div
                className="glass-card"
                style={{
                  padding: "20px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px"
                }}
              >
                <h4 style={{ fontSize: "1rem", fontWeight: 800 }}>Leave a Verified Review</h4>
                
                {isAuthenticated ? (
                  <form onSubmit={handleCreateReview} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                        Your Rating
                      </label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px"
                            }}
                          >
                            <Star
                              size={22}
                              color="#EA580C"
                              fill={star <= newRating ? "#EA580C" : "none"}
                            />
                          </button>
                        ))}
                        <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-primary)", marginLeft: "8px", alignSelf: "center" }}>
                          {newRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                        Your Experience & Tips
                      </label>
                      <textarea
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={`Share what you loved about ${destination.name}, best time to visit, or photography tips...`}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid var(--border-subtle)",
                          background: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                          fontSize: "0.88rem",
                          resize: "vertical"
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview || !newComment.trim()}
                      className="btn-primary"
                      style={{
                        padding: "10px 20px",
                        fontSize: "0.86rem",
                        alignSelf: "flex-start",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Send size={15} />
                      <span>{isSubmittingReview ? "Publishing to Firestore..." : "Publish Review"}</span>
                    </button>
                  </form>
                ) : (
                  <div style={{ padding: "14px", borderRadius: "10px", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <span style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                      Sign in with your INAVIST account to post reviews and rate places.
                    </span>
                    <button
                      onClick={() => openAuthModal("signin")}
                      className="btn-primary"
                      style={{ padding: "8px 16px", fontSize: "0.82rem" }}
                    >
                      Sign In to Review
                    </button>
                  </div>
                )}
              </div>

              {/* Real-Time Reviews Feed List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 800 }}>
                  Traveler Reviews ({reviews.length})
                </h4>

                {reviews.length === 0 ? (
                  <div className="glass-panel" style={{ padding: "32px", textAlign: "center", borderRadius: "var(--radius-lg)" }}>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                      No traveler reviews yet for {destination.name}. Be the first to share your journey!
                    </p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="glass-card"
                      style={{
                        padding: "16px",
                        borderRadius: "var(--radius-lg)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        borderLeft: rev.userId === user?.id ? "3px solid #2563EB" : "1px solid var(--border-subtle)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={rev.userAvatar || "/default-avatar.png"}
                            alt={rev.userName}
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                            onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span>{rev.userName}</span>
                              {rev.userId === user?.id && (
                                <span style={{ fontSize: "0.65rem", background: "rgba(37,99,235,0.15)", color: "#2563EB", padding: "2px 6px", borderRadius: "4px", fontWeight: 800 }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "0.70rem", color: "var(--text-muted)" }}>
                              {rev.visitMonth || new Date(rev.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ display: "flex", gap: "2px" }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                color="#EA580C"
                                fill={s <= rev.rating ? "#EA580C" : "none"}
                              />
                            ))}
                          </div>

                          {/* Edit / Delete actions for review owner */}
                          {rev.userId === user?.id && (
                            <div style={{ display: "flex", gap: "4px", marginLeft: "6px" }}>
                              <button
                                onClick={() => {
                                  setEditingReviewId(rev.id);
                                  setEditRating(rev.rating);
                                  setEditComment(rev.comment);
                                }}
                                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                                title="Edit review"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(rev.id)}
                                style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", padding: "4px" }}
                                title="Delete review"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {editingReviewId === rev.id ? (
                        <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            rows={2}
                            style={{
                              width: "100%",
                              padding: "8px",
                              borderRadius: "8px",
                              border: "1px solid var(--border-subtle)",
                              background: "var(--bg-tertiary)",
                              color: "var(--text-primary)",
                              fontSize: "0.85rem"
                            }}
                          />
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={() => handleUpdateReview(rev.id)}
                              className="btn-primary"
                              style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="btn-secondary"
                              style={{ padding: "6px 14px", fontSize: "0.78rem" }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "2px 0 0" }}>
                          {rev.comment}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
