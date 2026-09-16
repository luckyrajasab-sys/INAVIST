import React from "react";
import { Star, MapPin, Bookmark, CheckCircle, ArrowRight, IndianRupee, Bus, Train, Plane, Car } from "lucide-react";
import { ViewpointBadge, CrowdBadge, HiddenGemBadge } from "./Badge";
import { usePlanner } from "../../context/PlannerContext";

export const DestinationCard = ({ destination, onSelect, onBookTransport }) => {
  const { isBookmarked, toggleBookmark, isVisited, toggleVisited } = usePlanner();

  const bookmarked = isBookmarked(destination.id);
  const visited = isVisited(destination.id);

  const approxDailyCost =
    destination.estimatedCosts.stay +
    destination.estimatedCosts.food +
    destination.estimatedCosts.entry;

  const transportIcons = {
    Flight: Plane,
    Airport: Plane,
    Train: Train,
    Railway: Train,
    Bus: Bus,
    Volvo: Bus,
    Cab: Car,
    Taxi: Car
  };

  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <article
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        transition: "transform var(--transition-fast), box-shadow var(--transition-fast)"
      }}
      onClick={() => onSelect(destination)}
    >
      {/* Image Container */}
      <div style={{ position: "relative", width: "100%", height: "190px", overflow: "hidden" }}>
        {!imgLoaded && (
          <div className="skeleton" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        )}
        <img
          src={destination.images[0]}
          alt={destination.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.3s ease, transform 0.4s ease"
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80";
            setImgLoaded(true);
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        />

        {/* Top Badges */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px"
          }}
        >
          {destination.isHiddenGem && <HiddenGemBadge />}
          <ViewpointBadge status={destination.viewpointStatus} />
        </div>

        {/* Top Right Controls */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            display: "flex",
            gap: "6px"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => toggleVisited(destination)}
            style={{
              background: visited ? "#16A34A" : "rgba(0, 0, 0, 0.55)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            title={visited ? "Visited" : "Mark Visited"}
          >
            <CheckCircle size={14} />
          </button>

          <button
            onClick={() => toggleBookmark(destination.id)}
            style={{
              background: bookmarked ? "var(--brand-saffron)" : "rgba(0, 0, 0, 0.55)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            title={bookmarked ? "Bookmarked" : "Save"}
          >
            <Bookmark size={14} fill={bookmarked ? "#fff" : "none"} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "14px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            {destination.district}, {destination.state}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-saffron)" }}>
            <Star size={12} color="#EA580C" fill="#EA580C" /> {destination.rating}
          </span>
        </div>

        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 800,
            marginBottom: "4px",
            color: "var(--text-primary)",
            lineHeight: 1.3
          }}
        >
          {destination.name}
        </h3>

        <p
          style={{
            fontSize: "0.80rem",
            color: "var(--text-secondary)",
            lineHeight: 1.45,
            marginBottom: "10px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {destination.description}
        </p>

        {/* Route Transporters Pill Strip */}
        <div
          style={{
            background: "var(--bg-tertiary)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 8px",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.72rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
            <Bus size={12} color="var(--brand-saffron)" />
            <span>Route Transporters:</span>
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", fontWeight: 600, color: "var(--text-primary)" }}>
            {(destination.availableTransport || ["Volvo Bus", "IRCTC Rail", "4x4 Taxi"]).slice(0, 2).map((t, idx) => (
              <span key={idx} style={{ background: "var(--bg-card)", padding: "1px 6px", borderRadius: "3px", border: "1px solid var(--border-subtle)" }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "8px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
            ₹{approxDailyCost.toLocaleString("en-IN")} <span style={{ fontSize: "0.70rem", color: "var(--text-muted)", fontWeight: 400 }}>/ day</span>
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.80rem",
              fontWeight: 700,
              color: "var(--brand-saffron)"
            }}
          >
            Explore <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
};
