import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  MapPin,
  CalendarCheck,
  Wallet,
  Users,
  Eye,
  TrendingUp,
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { destinationsData, getCategories } from "../../data/destinationsData";
import { DestinationCard } from "../common/DestinationCard";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export const DashboardView = ({ setActiveTab, onSelectDestination }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getCategories();

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greetingMorning");
    if (hour < 17) return t("greetingAfternoon");
    return t("greetingEvening");
  };

  const filteredDestinations = destinationsData.filter((dest) => {
    const matchesCat =
      selectedCategory === "all" ||
      (selectedCategory === "hidden-gem" ? dest.isHiddenGem : dest.category === selectedCategory);
    const matchesSearch =
      searchQuery === "" ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const popularDestinations = destinationsData.filter((d) => !d.isHiddenGem).slice(0, 4);
  const hiddenGemsList = destinationsData.filter((d) => d.isHiddenGem).slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "24px 20px" }}>
      {/* Hero Greeting & Dynamic Search Banner */}
      <div
        className="glass-panel"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(255, 107, 0, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ maxWidth: "700px", position: "relative", zIndex: 2 }}>
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
              marginBottom: "12px"
            }}
          >
            <Sparkles size={14} />
            <span>AI-Powered Smart Travel Hub</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "10px",
              color: "var(--text-primary)"
            }}
          >
            {getGreeting()}, {user?.name?.split(" ")[0] || "Explorer"}!
          </h1>
          <p
            style={{
              fontSize: "1.02rem",
              color: "var(--text-secondary)",
              marginBottom: "24px",
              lineHeight: 1.5
            }}
          >
            Discover 100+ iconic landmarks and hidden gems across Indian states, calculate budgets, and plan safe itineraries.
          </p>

          {/* Quick Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-card-solid)",
              borderRadius: "var(--radius-full)",
              padding: "6px 8px 6px 18px",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border-subtle)",
              gap: "10px"
            }}
          >
            <Search size={20} color="var(--text-muted)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.95rem",
                color: "var(--text-primary)",
                width: "100%",
                fontFamily: "inherit"
              }}
            />
            {searchQuery && (
              <button
                className="btn-ghost"
                onClick={() => setSearchQuery("")}
                style={{ padding: "4px 8px", fontSize: "0.8rem" }}
              >
                Clear
              </button>
            )}
            <button
              className="btn-primary"
              onClick={() => setActiveTab("explore")}
              style={{ padding: "10px 20px", fontSize: "0.9rem", flexShrink: 0 }}
            >
              <span>Explore</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Live Travel Ticker */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            fontSize: "0.8rem",
            color: "var(--text-secondary)"
          }}
        >
          <span style={{ fontWeight: 700, color: "var(--brand-primary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={14} /> LIVE TRENDS:
          </span>
          <span style={{ background: "var(--bg-tertiary)", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
            ❄️ Gulmarg Snow Season Open
          </span>
          <span style={{ background: "var(--bg-tertiary)", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
            🎪 Ziro & Hornbill Festival Bookings
          </span>
          <span style={{ background: "var(--bg-tertiary)", padding: "3px 10px", borderRadius: "var(--radius-full)" }}>
            🌿 Alleppey & Munnar Pleasant Weather
          </span>
        </div>
      </div>

      {/* Quick Feature Action Cards */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Smart Travel Tools
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px"
          }}
        >
          {/* Budget Travel Finder */}
          <div
            className="glass-card"
            onClick={() => setActiveTab("budget")}
            style={{
              padding: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderLeft: "4px solid #10b981"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Wallet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
                Where Can I Travel?
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                Enter your budget (₹5,000 - ₹1L+) to find matched destinations with cost breakdowns.
              </p>
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 700, color: "#10b981" }}>
              <span>Try Budget Finder</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Smart Itinerary Planner */}
          <div
            className="glass-card"
            onClick={() => setActiveTab("planner")}
            style={{
              padding: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderLeft: "4px solid var(--brand-primary)"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "var(--brand-primary-light)",
                color: "var(--brand-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CalendarCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
                Smart Itinerary Builder
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                Generate customized day-by-day schedules, timings, and transportation estimates.
              </p>
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 700, color: "var(--brand-primary)" }}>
              <span>Create Itinerary</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Interactive Map */}
          <div
            className="glass-card"
            onClick={() => setActiveTab("map")}
            style={{
              padding: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderLeft: "4px solid #0ea5e9"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(14, 165, 233, 0.12)",
                color: "#0ea5e9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
                Interactive Map Explorer
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                Browse destinations, viewpoints, and transport hubs on an interactive pan-India map.
              </p>
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 700, color: "#0ea5e9" }}>
              <span>Open Map</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Travel Companions */}
          <div
            className="glass-card"
            onClick={() => setActiveTab("companions")}
            style={{
              padding: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderLeft: "4px solid #8b5cf6"
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(139, 92, 246, 0.12)",
                color: "#8b5cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Users size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>
                Verified Companions
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                Find verified travel buddies matching your dates, destination, and interests safely.
              </p>
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.82rem", fontWeight: 700, color: "#8b5cf6" }}>
              <span>Find Companions</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Experience Category Chips */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Explore Experiences
          </h2>
          <button
            className="btn-ghost"
            onClick={() => setActiveTab("explore")}
            style={{ fontSize: "0.85rem", color: "var(--brand-primary)", fontWeight: 700 }}
          >
            View All 100+ <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                whiteSpace: "nowrap",
                padding: "8px 18px",
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: selectedCategory === cat.id ? "var(--brand-primary)" : "var(--border-subtle)",
                background: selectedCategory === cat.id ? "var(--brand-primary)" : "var(--bg-tertiary)",
                color: selectedCategory === cat.id ? "#ffffff" : "var(--text-primary)",
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Grid or Categorized Showcase */}
      {searchQuery || selectedCategory !== "all" ? (
        <div>
          <div style={{ marginBottom: "14px", fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            Found <strong>{filteredDestinations.length}</strong> matching destinations
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "20px"
            }}
          >
            {filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} onSelect={onSelectDestination} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Popular Destinations Showcase */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  Popular Destinations
                </h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Most visited and iconic locations across India
                </p>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setActiveTab("explore")}
                style={{ fontSize: "0.85rem", color: "var(--brand-primary)", fontWeight: 700 }}
              >
                Explore More <ChevronRight size={14} />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px"
              }}
            >
              {popularDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} onSelect={onSelectDestination} />
              ))}
            </div>
          </div>

          {/* Curated Hidden Gems Showcase */}
          <div
            className="glass-panel"
            style={{
              padding: "28px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(255, 107, 0, 0.06) 100%), var(--bg-card)",
              borderRadius: "var(--radius-xl)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--status-gem)",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    marginBottom: "4px"
                  }}
                >
                  <Sparkles size={14} /> UNTOUCHED ESCAPES
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Hidden Gems of India ✨
                </h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Lesser-known viewpoints, tribal valleys, living root bridges, and secret canyons
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={() => setActiveTab("gems")}
                style={{ padding: "8px 16px", fontSize: "0.82rem", background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}
              >
                All Hidden Gems <ArrowRight size={14} />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px"
              }}
            >
              {hiddenGemsList.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} onSelect={onSelectDestination} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
