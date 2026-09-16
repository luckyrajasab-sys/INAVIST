import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  MessageSquareHeart,
  Star,
  Send,
  CheckCircle,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  Heart,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePlanner } from "../../context/PlannerContext";

export const AppFeedbackView = () => {
  const { user } = useAuth();
  const { showToast } = usePlanner();

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackCategory, setFeedbackCategory] = useState("Feature Suggestion");
  const [feedbackDestination, setFeedbackDestination] = useState("Kodaikanal");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackRecommend, setFeedbackRecommend] = useState("Yes, absolutely! 🌟");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const ratingLabels = {
    1: "Poor Experience",
    2: "Fair, Needs Improvement",
    3: "Good & Useful",
    4: "Great Platform!",
    5: "Incredible Experience! 🔥"
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      id: `fb-${Date.now()}`,
      userId: user?.id || "guest",
      userName: user?.name || "Traveler",
      rating: feedbackRating,
      category: feedbackCategory,
      destination: feedbackDestination,
      comments: feedbackComments,
      recommend: feedbackRecommend,
      date: new Date().toLocaleDateString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem("yatri_feedbacks") || "[]");
      existing.unshift(newFeedback);
      localStorage.setItem("yatri_feedbacks", JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    setFeedbackSubmitted(true);
    showToast("Thank you for sharing your feedback with YĀTRI! 🙏");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "28px 20px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(14, 165, 233, 0.1) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(234, 88, 12, 0.25)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <MessageSquareHeart size={28} color="var(--brand-saffron)" />
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>App Feedback & Suggestions</h1>
        </div>
        <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          We love hearing from fellow travelers! Tell us about your journey, share feature ideas, or report any issues to help us build India's premier travel companion.
        </p>
      </div>

      {/* Form or Confirmation */}
      <div className="glass-panel" style={{ padding: "36px 30px", borderRadius: "var(--radius-xl)" }}>
        {feedbackSubmitted ? (
          <div
            style={{
              background: "linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(14, 116, 144, 0.12) 100%)",
              border: "1px solid rgba(22, 163, 74, 0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "40px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px"
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#16A34A",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CheckCircle size={34} />
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Feedback Received! Thank you!</h2>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", maxWidth: "480px", lineHeight: 1.5 }}>
              Your suggestions directly inspire our next updates. Wishing you unforgettable adventures across incredible India!
            </p>
            <button
              type="button"
              onClick={() => {
                setFeedbackSubmitted(false);
                setFeedbackComments("");
              }}
              className="btn-secondary"
              style={{ marginTop: "10px", fontSize: "0.86rem" }}
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            {/* Star Rating */}
            <div style={{ background: "var(--bg-tertiary)", padding: "20px 24px", borderRadius: "var(--radius-lg)" }}>
              <label style={{ fontSize: "0.80rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "10px", display: "block" }}>
                How would you rate your overall experience on YĀTRI?
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px",
                        transition: "transform 0.15s ease"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                    >
                      <Star
                        size={32}
                        color={star <= feedbackRating ? "#EA580C" : "var(--text-muted)"}
                        fill={star <= feedbackRating ? "#EA580C" : "none"}
                      />
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--brand-saffron)" }}>
                  {ratingLabels[feedbackRating]}
                </span>
              </div>
            </div>

            {/* Category & Destination Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                  Feedback Category
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="select-field"
                  style={{ padding: "12px 14px" }}
                >
                  <option value="Feature Suggestion">✨ Feature Suggestion</option>
                  <option value="Offline Travel Vault">🎒 Offline Travel Vault & Packs</option>
                  <option value="Maps & Radar">🗺️ Maps & GPS Radar</option>
                  <option value="Hotels & Stays">🏨 Hotels, Havelis & Stays</option>
                  <option value="Transport & Trains">🚆 Transport, Flights & Trains</option>
                  <option value="Cultural Guide">🛕 Cultural & Heritage Guides</option>
                  <option value="UI & Themes">🎨 Design, Colors & Themes</option>
                  <option value="Bug Report">🐞 Bug / Technical Glitch</option>
                  <option value="General Praise">💖 General Feedback / Praise</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                  Destination Explored (Optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={feedbackDestination}
                  onChange={(e) => setFeedbackDestination(e.target.value)}
                  placeholder="e.g. Kodaikanal, Leh Ladakh, Varanasi, Goa..."
                  style={{ padding: "12px 14px" }}
                />
              </div>
            </div>

            {/* Comments Textarea */}
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                Detailed Feedback & Suggestions
              </label>
              <textarea
                className="input-field"
                rows={5}
                value={feedbackComments}
                onChange={(e) => setFeedbackComments(e.target.value)}
                placeholder="What did you love about the platform? What features or destination info would you like us to add next?"
                style={{ width: "100%", resize: "vertical", fontFamily: "inherit", padding: "12px 14px" }}
                required
              />
            </div>

            {/* Recommendation Choice */}
            <div>
              <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
                Would you recommend YĀTRI to fellow travelers?
              </label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["Yes, absolutely! 🌟", "Most likely 👍", "Maybe later 🤔"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFeedbackRecommend(opt)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "var(--radius-full)",
                      border: feedbackRecommend === opt ? "2px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                      background: feedbackRecommend === opt ? "var(--brand-saffron-light)" : "var(--bg-tertiary)",
                      color: feedbackRecommend === opt ? "var(--brand-saffron)" : "var(--text-secondary)",
                      fontWeight: feedbackRecommend === opt ? 800 : 500,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                height: "46px",
                borderRadius: "var(--radius-md)",
                marginTop: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.92rem"
              }}
            >
              <Send size={17} />
              <span>Submit Web App Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
