import React, { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  MapPin,
  Compass,
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  Navigation,
  Ticket,
  Lightbulb,
  Heart,
  Share2,
  CalendarCheck,
  Building,
  TreePine,
  Landmark,
  UtensilsCrossed,
  Layers,
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { LOCAL_DISTRICT_GEMS, getLocalGemsCategories } from "../../data/localGemsData";
import { ALL_INDIAN_STATES_DIRECTORY } from "../../data/stateCapitalsAndDistricts";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

export const HiddenGemsView = ({
  onBack,
  onSelectDestination,
  onPlanTrip,
  onBackdropChange,
  initialState = "All",
  initialDistrict = "All",
  initialSearch = ""
}) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [selectedState, setSelectedState] = useState(initialState || "All");
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict || "All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedGemDetail, setSelectedGemDetail] = useState(null);
  const [savedGems, setSavedGems] = useState({});

  useEffect(() => {
    if (initialState && initialState !== "All") {
      setSelectedState(initialState);
    }
    if (initialDistrict && initialDistrict !== "All") {
      const matchGem = LOCAL_DISTRICT_GEMS.find(
        (g) => g.district.toLowerCase().includes(initialDistrict.toLowerCase())
      );
      if (matchGem) {
        setSelectedDistrict(matchGem.district);
        setSelectedState(matchGem.state);
      } else {
        setSelectedDistrict(initialDistrict);
      }
    }
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialState, initialDistrict, initialSearch]);

  const categories = getLocalGemsCategories();

  // Extract all unique states
  const allStatesList = useMemo(() => {
    const states = Array.from(new Set(LOCAL_DISTRICT_GEMS.map((g) => g.state)));
    return ["All", ...states.sort()];
  }, []);

  // Extract districts for selected state
  const availableDistricts = useMemo(() => {
    if (selectedState === "All") {
      const allDistricts = Array.from(new Set(LOCAL_DISTRICT_GEMS.map((g) => g.district)));
      return ["All", ...allDistricts.sort()];
    }
    const stateGems = LOCAL_DISTRICT_GEMS.filter((g) => g.state.toLowerCase() === selectedState.toLowerCase());
    const districts = Array.from(new Set(stateGems.map((g) => g.district)));
    return ["All", ...districts.sort()];
  }, [selectedState]);

  // Filter gems based on state, district, category, and search query
  const filteredGems = useMemo(() => {
    return LOCAL_DISTRICT_GEMS.filter((gem) => {
      const matchState = selectedState === "All" || gem.state.toLowerCase() === selectedState.toLowerCase();
      const matchDistrict = selectedDistrict === "All" || gem.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchCategory = selectedCategory === "all" || gem.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        gem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gem.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gem.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gem.whyLocalsLoveIt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gem.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchState && matchDistrict && matchCategory && matchSearch;
    });
  }, [selectedState, selectedDistrict, selectedCategory, searchQuery]);

  const handleStateSelect = (stateName) => {
    setSelectedState(stateName);
    setSelectedDistrict("All");
    if (stateName !== "All") {
      const firstGem = LOCAL_DISTRICT_GEMS.find((g) => g.state.toLowerCase() === stateName.toLowerCase());
      if (firstGem && onBackdropChange) {
        onBackdropChange(firstGem.image);
      }
    }
  };

  const handleQuickDistrictPick = (stateName, districtName) => {
    setSelectedState(stateName);
    setSelectedDistrict(districtName);
    const gem = LOCAL_DISTRICT_GEMS.find(
      (g) => g.state.toLowerCase() === stateName.toLowerCase() && g.district.toLowerCase().includes(districtName.toLowerCase())
    );
    if (gem && onBackdropChange) {
      onBackdropChange(gem.image);
    }
  };

  const toggleSaveGem = (id, e) => {
    e?.stopPropagation();
    setSavedGems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "16px 24px 60px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
      {/* Top Header Bar with Back Button & Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => {
              if (onBack) onBack();
            }}
            className="btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "var(--radius-full)",
              fontWeight: 700,
              fontSize: "0.88rem",
              background: isDark ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "transform var(--transition-fast), background var(--transition-fast)"
            }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <span>Home</span>
            <ChevronRight size={14} />
            <span style={{ color: "var(--brand-saffron)", fontWeight: 700 }}>Hidden Gems & Local Secrets</span>
            {selectedState !== "All" && (
              <>
                <ChevronRight size={14} />
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{selectedState}</span>
              </>
            )}
            {selectedDistrict !== "All" && (
              <>
                <ChevronRight size={14} />
                <span style={{ color: "var(--brand-saffron)", fontWeight: 700 }}>{selectedDistrict}</span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              background: "rgba(139, 92, 246, 0.15)",
              color: "#8B5CF6",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Sparkles size={14} />
            <span>Pan-India District Secrets Active</span>
          </span>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div
        className="glass-panel"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "36px 32px",
          background: isDark
            ? "linear-gradient(135deg, rgba(139, 92, 246, 0.22) 0%, rgba(249, 115, 22, 0.15) 100%), var(--bg-card)"
            : "linear-gradient(135deg, rgba(254, 243, 199, 0.85) 0%, rgba(243, 232, 255, 0.85) 100%), #FFFFFF",
          borderRadius: "var(--radius-xl)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <div style={{ maxWidth: "820px", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)",
              color: "#FFFFFF",
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.02em",
              marginBottom: "12px",
              boxShadow: "0 2px 8px rgba(139, 92, 246, 0.35)"
            }}
          >
            <Sparkles size={15} />
            <span>AUTHENTIC LOCAL DISTRICT FAVORITES</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "10px", lineHeight: 1.2 }}>
            Local Famous Places & Hidden Secrets ✨
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
            Explore authentic spots cherished by local people across every Indian district—from <strong>Chennai Central, Vandalur Zoo, & Egmore Museum</strong> in Tamil Nadu to the heritage lanes, street food hubs, natural reserves, and secret viewpoints across all 28 states & UTs.
          </p>

          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: isDark ? "rgba(15, 23, 42, 0.8)" : "#FFFFFF",
              borderRadius: "var(--radius-full)",
              padding: "8px 18px",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border-subtle)",
              gap: "10px",
              maxWidth: "600px"
            }}
          >
            <Search size={20} color="var(--brand-saffron)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by spot (e.g. Chennai Central, Vandalur Zoo, Museum, Food street, Lake)..."
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
                onClick={() => setSearchQuery("")}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Featured District Spotlight Quick Bar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            ⭐ POPULAR LOCAL DISTRICTS (CLICK TO EXPLORE)
          </span>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            Showing <strong>{filteredGems.length}</strong> local secrets
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            scrollbarWidth: "none"
          }}
        >
          {[
            { state: "Tamil Nadu", district: "Chennai", label: "🌟 Chennai District (TN)", highlight: "Central, Vandalur, Egmore" },
            { state: "Tamil Nadu", district: "Madurai", label: "🛕 Madurai District (TN)", highlight: "Meenakshi, Jigarthanda" },
            { state: "Tamil Nadu", district: "Nilgiris (Ooty)", label: "🌲 Nilgiris / Ooty (TN)", highlight: "Avalanche, Tea Valleys" },
            { state: "Karnataka", district: "Bengaluru Urban", label: "🏙️ Bengaluru Urban (KA)", highlight: "Lalbagh, VV Puram" },
            { state: "Maharashtra", district: "Mumbai Suburban", label: "🌊 Mumbai (MH)", highlight: "CSMT, Marine Drive" },
            { state: "Delhi", district: "Central Delhi", label: "🏛️ Central Delhi (DL)", highlight: "Chandni Chowk, Lodhi" },
            { state: "Kerala", district: "Thiruvananthapuram", label: "🥥 Thiruvananthapuram (KL)", highlight: "Padmanabha, Kovalam" },
            { state: "West Bengal", district: "Kolkata", label: "🚋 Kolkata (WB)", highlight: "Victoria, Princep Ghat" },
            { state: "Telangana", district: "Hyderabad", label: "💎 Hyderabad (TG)", highlight: "Charminar, Golconda" },
            { state: "Rajasthan", district: "Jaipur", label: "🏰 Jaipur (RJ)", highlight: "Hawa Mahal, Nahargarh" },
            { state: "Uttar Pradesh", district: "Varanasi", label: "✨ Varanasi (UP)", highlight: "Ganga Aarti, Ghats" },
            { state: "Punjab", district: "Amritsar", label: "🙏 Amritsar (PB)", highlight: "Golden Temple, Langar" }
          ].map((item, idx) => {
            const isSelected = selectedState === item.state && selectedDistrict.toLowerCase().includes(item.district.toLowerCase());
            return (
              <button
                key={idx}
                onClick={() => handleQuickDistrictPick(item.state, item.district)}
                style={{
                  flexShrink: 0,
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "2px",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-lg)",
                  border: isSelected ? "2px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                  background: isSelected ? "var(--brand-saffron-light)" : "var(--bg-card)",
                  color: isSelected ? "var(--brand-saffron)" : "var(--text-primary)",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                <span style={{ fontWeight: 800, fontSize: "0.84rem" }}>{item.label}</span>
                <span style={{ fontSize: "0.72rem", color: isSelected ? "var(--brand-saffron)" : "var(--text-muted)" }}>
                  {item.highlight}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* State & District Dropdown Filters + Category Bar */}
      <div
        className="glass-panel"
        style={{
          padding: "16px 20px",
          borderRadius: "var(--radius-xl)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          border: "1px solid var(--border-subtle)"
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
          {/* State Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "220px", flex: "1 1 200px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              📍 1. Select Indian State / UT
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateSelect(e.target.value)}
              style={{
                padding: "9px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.9rem",
                outline: "none",
                cursor: "pointer"
              }}
            >
              {allStatesList.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "🇮🇳 All Indian States & UTs" : st}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "220px", flex: "1 1 200px" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              🏙️ 2. Select District / Region
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                padding: "9px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-tertiary)",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.9rem",
                outline: "none",
                cursor: "pointer"
              }}
            >
              {availableDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst === "All" ? `All Districts (${selectedState === "All" ? "Pan-India" : selectedState})` : `📍 ${dst}`}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedState !== "All" || selectedDistrict !== "All" || selectedCategory !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedState("All");
                setSelectedDistrict("All");
                setSelectedCategory("all");
                setSearchQuery("");
                if (onBackdropChange) onBackdropChange(null);
              }}
              style={{
                alignSelf: "flex-end",
                marginBottom: "2px",
                padding: "9px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "transparent",
                color: "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer"
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingTop: "6px",
            borderTop: "1px solid var(--border-subtle)",
            scrollbarWidth: "none"
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  whiteSpace: "nowrap",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  border: isActive ? "1px solid var(--status-gem)" : "1px solid var(--border-subtle)",
                  background: isActive ? "var(--status-gem)" : "var(--bg-tertiary)",
                  color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                  fontWeight: isActive ? 800 : 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of District Famous Places */}
      <div>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {selectedDistrict !== "All"
              ? `${selectedDistrict} Local Gems & Famous Spots (${filteredGems.length})`
              : selectedState !== "All"
              ? `${selectedState} District Spots (${filteredGems.length})`
              : `All Indian District Gems (${filteredGems.length})`}
          </h2>
          <span style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
            Verified by Local Residents
          </span>
        </div>

        {filteredGems.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: "48px 24px",
              textAlign: "center",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px"
            }}
          >
            <Sparkles size={36} color="var(--brand-saffron)" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>No specific local gems matched your criteria</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "450px" }}>
              Try clearing search terms or selecting "All States" or "Chennai District" to view iconic local spots.
            </p>
            <button
              onClick={() => {
                setSelectedState("All");
                setSelectedDistrict("All");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="btn-primary"
              style={{ padding: "8px 20px", borderRadius: "var(--radius-full)", fontWeight: 700 }}
            >
              Show All District Gems
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px"
            }}
          >
            {filteredGems.map((gem) => {
              const isSaved = !!savedGems[gem.id];
              return (
                <div
                  key={gem.id}
                  className="glass-card"
                  onClick={() => setSelectedGemDetail(gem)}
                  style={{
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    border: "1px solid var(--border-subtle)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-xl)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                >
                  {/* Card Image Banner */}
                  <div style={{ position: "relative", height: "190px", width: "100%", overflow: "hidden" }}>
                    <img
                      src={gem.image}
                      alt={gem.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)"
                      }}
                    />

                    {/* District & State Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "rgba(0, 0, 0, 0.75)",
                        backdropFilter: "blur(8px)",
                        color: "#FFFFFF",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <MapPin size={12} color="var(--brand-saffron)" />
                      <span>{gem.district}, {gem.state}</span>
                    </div>

                    {/* Bookmark Save Button */}
                    <button
                      onClick={(e) => toggleSaveGem(gem.id, e)}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: isSaved ? "rgba(234, 88, 12, 0.9)" : "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(8px)",
                        border: "none",
                        color: "#FFFFFF",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                      title={isSaved ? "Saved" : "Save Gem"}
                    >
                      <Heart size={16} fill={isSaved ? "#FFFFFF" : "none"} />
                    </button>

                    {/* Local Badge Tag */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "12px",
                        background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                        color: "#FFFFFF",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.72rem",
                        fontWeight: 800
                      }}
                    >
                      {gem.badge}
                    </div>

                    {/* Rating */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "12px",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "#EA580C",
                        padding: "3px 8px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.74rem",
                        fontWeight: 800
                      }}
                    >
                      ★ {gem.rating} ({gem.reviewsCount})
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, lineHeight: 1.3 }}>{gem.name}</h3>

                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                      {gem.shortDescription}
                    </p>

                    {/* Why Locals Love It Callout Box */}
                    <div
                      style={{
                        background: isDark ? "rgba(139, 92, 246, 0.1)" : "rgba(243, 232, 255, 0.6)",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        borderLeft: "3px solid #8B5CF6",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                      }}
                    >
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Lightbulb size={12} />
                        <span>WHY LOCALS LOVE IT</span>
                      </span>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-primary)", lineHeight: 1.4, margin: 0 }}>
                        {gem.whyLocalsLoveIt}
                      </p>
                    </div>

                    {/* Metadata Strip */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Clock size={13} color="var(--text-muted)" />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{gem.timings}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Navigation size={13} color="var(--text-muted)" />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{gem.nearestTransit}</span>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ marginTop: "auto", paddingTop: "12px", display: "flex", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGemDetail(gem);
                        }}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-subtle)",
                          background: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        View Details
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onPlanTrip) {
                            onPlanTrip({
                              name: gem.name,
                              state: gem.state,
                              district: gem.district,
                              image: gem.image
                            });
                          }
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "8px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "none",
                          background: "var(--brand-saffron)",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        <CalendarCheck size={14} />
                        <span>Plan Trip</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal View for Detailed Gem Information */}
      {selectedGemDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setSelectedGemDetail(null)}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "var(--radius-2xl)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-2xl)",
              display: "flex",
              flexDirection: "column"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div style={{ position: "relative", height: "240px", width: "100%" }}>
              <img
                src={selectedGemDetail.image}
                alt={selectedGemDetail.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />

              <button
                onClick={() => setSelectedGemDetail(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <X size={20} />
              </button>

              <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px" }}>
                <span
                  style={{
                    background: "var(--status-gem)",
                    color: "#FFFFFF",
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                    display: "inline-block",
                    marginBottom: "6px"
                  }}
                >
                  {selectedGemDetail.badge}
                </span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.2 }}>
                  {selectedGemDetail.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", marginTop: "4px" }}>
                  <MapPin size={13} color="var(--brand-saffron)" />
                  <span>{selectedGemDetail.district}, {selectedGemDetail.state}</span>
                  <span>•</span>
                  <span>★ {selectedGemDetail.rating} ({selectedGemDetail.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                  Overview
                </h4>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  {selectedGemDetail.shortDescription}
                </p>
              </div>

              {/* Why locals love it */}
              <div
                style={{
                  background: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(243, 232, 255, 0.7)",
                  padding: "14px 16px",
                  borderRadius: "var(--radius-lg)",
                  borderLeft: "4px solid #8B5CF6"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#8B5CF6", fontWeight: 800, fontSize: "0.82rem", marginBottom: "6px" }}>
                  <Lightbulb size={16} />
                  <span>WHY LOCAL RESIDENTS LOVE THIS PLACE</span>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.5, margin: 0 }}>
                  {selectedGemDetail.whyLocalsLoveIt}
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Key Highlights & Must-See Features
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {selectedGemDetail.highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                        fontSize: "0.82rem",
                        color: "var(--text-secondary)",
                        background: "var(--bg-tertiary)",
                        padding: "8px 10px",
                        borderRadius: "var(--radius-md)"
                      }}
                    >
                      <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit, Timings & Entry info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)" }}>TIMINGS</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "2px" }}>{selectedGemDetail.timings}</div>
                </div>
                <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)" }}>ENTRY FEE</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "2px" }}>{selectedGemDetail.entryFee}</div>
                </div>
              </div>

              <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)" }}>NEAREST TRANSIT / ACCESS</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "2px" }}>{selectedGemDetail.nearestTransit}</div>
              </div>

              {/* Local Insider Tip */}
              {selectedGemDetail.localTip && (
                <div
                  style={{
                    background: "rgba(249, 115, 22, 0.1)",
                    border: "1px solid rgba(249, 115, 22, 0.25)",
                    padding: "12px 14px",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px"
                  }}
                >
                  <Sparkles size={18} color="var(--brand-saffron)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ fontSize: "0.82rem", color: "var(--brand-saffron)", display: "block" }}>LOCAL RESIDENT INSIDER TIP</strong>
                    <span style={{ fontSize: "0.84rem", color: "var(--text-primary)" }}>{selectedGemDetail.localTip}</span>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  onClick={() => setSelectedGemDetail(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    background: "transparent",
                    color: "var(--text-primary)",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (onPlanTrip) {
                      onPlanTrip({
                        name: selectedGemDetail.name,
                        state: selectedGemDetail.state,
                        district: selectedGemDetail.district,
                        image: selectedGemDetail.image
                      });
                    }
                    setSelectedGemDetail(null);
                  }}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: "10px",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <CalendarCheck size={16} />
                  <span>Plan Itinerary for this Place</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
