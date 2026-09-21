import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Award,
  Building,
  Landmark,
  Compass,
  CheckCircle,
  Bus,
  Clock,
  Navigation,
  Lightbulb,
  Heart,
  X,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import { destinationsData, getAllStates, getDistrictsByState, getCategories } from "../../data/destinationsData";
import { LOCAL_DISTRICT_GEMS } from "../../data/localGemsData";
import { DestinationCard } from "../common/DestinationCard";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { getCapitalForState, ALL_INDIAN_STATES_DIRECTORY, getAllIndianDistricts } from "../../data/stateCapitalsAndDistricts.js";
import { api } from "../../api/client";
import { FirestoreService } from "../../services/FirestoreService.js";

// Curated iconic image representations for Indian States featuring sacred temples, idols & heritage
export const STATE_REPRESENTATIONS = [
  { state: "Tamil Nadu", label: "Tamil Nadu", capital: "Chennai", tagline: "Meenakshi Temple & Bronze Nataraja", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80", count: 14 },
  { state: "Karnataka", label: "Karnataka", capital: "Bengaluru", tagline: "Virupaksha Temple & Murudeshwar Shiva", image: "https://images.unsplash.com/photo-1600100397608-f010f4448553?auto=format&fit=crop&w=600&q=80", count: 14 },
  { state: "Odisha", label: "Odisha", capital: "Bhubaneswar", tagline: "Konark Sun Temple & Lord Jagannath", image: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80", count: 10 },
  { state: "Uttar Pradesh", label: "Uttar Pradesh", capital: "Lucknow", tagline: "Kashi Vishwanath & Ayodhya Ram Mandir", image: "https://images.unsplash.com/photo-1561361066-613d52d9a691?auto=format&fit=crop&w=600&q=80", count: 12 },
  { state: "Madhya Pradesh", label: "Madhya Pradesh", capital: "Bhopal", tagline: "Khajuraho Sculptures & Mahakaleshwar", image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80", count: 11 },
  { state: "Punjab", label: "Punjab", capital: "Chandigarh", tagline: "Harmandir Sahib Golden Temple", image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80", count: 8 },
  { state: "Uttarakhand", label: "Uttarakhand", capital: "Dehradun", tagline: "Kedarnath Shiva Dham & Rishikesh", image: "https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=600&q=80", count: 15 },
  { state: "Sikkim", label: "Sikkim", capital: "Gangtok", tagline: "Ravangla 130ft Golden Buddha Idol", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80", count: 8 },
  { state: "Ladakh", label: "Ladakh", capital: "Leh", tagline: "Diskit Maitreya Buddha 106ft Idol", image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80", count: 12 },
  { state: "Rajasthan", label: "Rajasthan", capital: "Jaipur", tagline: "Ranakpur Marble Temple & Amer Fort", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80", count: 18 },
  { state: "Kerala", label: "Kerala", capital: "Thiruvananthapuram", tagline: "Padmanabhaswamy & Emerald Backwaters", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80", count: 14 },
  { state: "Himachal Pradesh", label: "Himachal", capital: "Shimla", tagline: "Baijnath Shiva Temple & Spiti Monastery", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80", count: 16 },
  { state: "Maharashtra", label: "Maharashtra", capital: "Mumbai", tagline: "Ellora Kailasa Temple & Ashtavinayak", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80", count: 12 },
  { state: "Gujarat", label: "Gujarat", capital: "Gandhinagar", tagline: "Somnath Jyotirlinga & Dwarkadhish", image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80", count: 9 },
  { state: "Delhi", label: "Delhi", capital: "New Delhi", tagline: "Akshardham Temple Monument", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80", count: 8 },
  { state: "Goa", label: "Goa", capital: "Panaji", tagline: "Basilica of Bom Jesus & Mangueshi", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", count: 10 }
];

export const DestinationExplorer = ({ onSelectDestination, onBackdropChange, onPlanTrip, initialCategory = "all" }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCrowd, setSelectedCrowd] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [onlyGems, setOnlyGems] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedGemModal, setSelectedGemModal] = useState(null);
  const [savedGems, setSavedGems] = useState({});
  const [destList, setDestList] = useState([]);
  const [isDestLoading, setIsDestLoading] = useState(true);
  const [destError, setDestError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsDestLoading(true);
    setDestError(null);

    FirestoreService.getDestinations()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          setDestList(data);
        } else {
          setDestList(destinationsData);
        }
        setIsDestLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("[Explorer] Firestore fetch error, falling back to local catalog:", err.message);
        setDestList(destinationsData);
        setIsDestLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allStates = useMemo(() => getAllStates(), []);
  const availableDistricts = useMemo(() => getDistrictsByState(selectedState), [selectedState]);
  const allIndianDistrictsList = useMemo(() => getAllIndianDistricts(), []);
  const categories = getCategories();

  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic live search suggestions across all Indian Districts, States, and Destinations
  const searchSuggestions = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();

    if (!q) {
      // When search query is empty, show all Indian districts
      return {
        districts: allIndianDistrictsList,
        states: ALL_INDIAN_STATES_DIRECTORY,
        destinations: destinationsData
      };
    }

    // 1. Districts across India
    const matchedDistricts = allIndianDistrictsList.filter((d) =>
      d.district.toLowerCase().includes(q) ||
      d.displayName.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q)
    );

    // 2. States across India
    const matchedStates = ALL_INDIAN_STATES_DIRECTORY.filter((s) =>
      s.state.toLowerCase().includes(q) || s.capital.toLowerCase().includes(q)
    );

    // 3. Specific Destinations
    const matchedDestinations = destinationsData.filter((dest) =>
      dest.name.toLowerCase().includes(q) ||
      (dest.district && dest.district.toLowerCase().includes(q)) ||
      dest.state.toLowerCase().includes(q)
    );

    return {
      districts: matchedDistricts,
      states: matchedStates,
      destinations: matchedDestinations
    };
  }, [searchQuery, allIndianDistrictsList]);

  // Current selected state metadata (with mandatory capital & all districts)
  const currentStateInfo = useMemo(() => {
    return getCapitalForState(selectedState);
  }, [selectedState]);

  // Compute District Famous Places & Local Hidden Gems matching current search/district/state
  const matchingDistrictGems = useMemo(() => {
    return LOCAL_DISTRICT_GEMS.filter((gem) => {
      if (selectedDistrict) {
        const cleanD = selectedDistrict.toLowerCase().replace(/\s*\(.*\)/, "").trim();
        return (
          gem.district.toLowerCase().includes(cleanD) ||
          cleanD.includes(gem.district.toLowerCase())
        );
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          gem.name.toLowerCase().includes(q) ||
          gem.district.toLowerCase().includes(q) ||
          gem.state.toLowerCase().includes(q) ||
          gem.whyLocalsLoveIt.toLowerCase().includes(q) ||
          gem.highlights.some((h) => h.toLowerCase().includes(q))
        );
      }
      if (selectedState) {
        return gem.state.toLowerCase() === selectedState.toLowerCase();
      }
      return false;
    });
  }, [selectedDistrict, searchQuery, selectedState]);

  const handleSelectDistrictSuggestion = (item) => {
    setSelectedDistrict(item.district);
    setSelectedState(item.state);
    setSearchQuery(item.displayName);
    setShowSearchSuggestions(false);
  };

  const handleSelectStateSuggestion = (stateName) => {
    handleStateChange(stateName);
    setSearchQuery("");
    setShowSearchSuggestions(false);
  };

  const handleSelectDestinationSuggestion = (dest) => {
    setSearchQuery(dest.name);
    setShowSearchSuggestions(false);
    handleCardClick(dest);
  };

  // Reset district if state changes & dynamically update full-bleed background picture
  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict("");
    if (state) {
      const matchRep = STATE_REPRESENTATIONS.find((s) => s.state.toLowerCase() === state.toLowerCase());
      if (matchRep && onBackdropChange) {
        onBackdropChange(matchRep.image);
      } else {
        const destInState = destinationsData.find((d) => d.state.toLowerCase() === state.toLowerCase());
        if (destInState?.images?.[0] && onBackdropChange) {
          onBackdropChange(destInState.images[0]);
        }
      }
    } else {
      if (onBackdropChange) onBackdropChange(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedCategory("all");
    setSelectedCrowd("all");
    setSelectedBudget("all");
    setOnlyGems(false);
    setSortBy("rating");
    if (onBackdropChange) onBackdropChange(null);
  };

  const handleCardClick = (dest) => {
    if (dest?.images?.[0] && onBackdropChange) {
      onBackdropChange(dest.images[0]);
    }
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
  };

  const toggleSaveGem = (id, e) => {
    e?.stopPropagation();
    setSavedGems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredDestinations = useMemo(() => {
    return destList
      .filter((dest) => {
        // Search query
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matches =
            dest.name.toLowerCase().includes(q) ||
            dest.state.toLowerCase().includes(q) ||
            dest.district.toLowerCase().includes(q) ||
            dest.description.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // State filter
        if (selectedState && dest.state.toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }

        // District filter
        if (selectedDistrict) {
          const cleanSelDist = selectedDistrict.toLowerCase().replace(/\s*\(.*\)/, "").trim();
          const destDist = (dest.district || "").toLowerCase();
          const destName = (dest.name || "").toLowerCase();
          const matchesDist =
            destDist.includes(cleanSelDist) ||
            cleanSelDist.includes(destDist) ||
            (selectedDistrict.toLowerCase().includes("kodai") && (destDist.includes("dindigul") || destName.includes("kodai"))) ||
            (selectedDistrict.toLowerCase().includes("ooty") && (destDist.includes("nilgiris") || destName.includes("ooty"))) ||
            (selectedDistrict.toLowerCase().includes("munnar") && (destDist.includes("idukki") || destName.includes("munnar"))) ||
            (selectedDistrict.toLowerCase().includes("coorg") && (destDist.includes("kodagu") || destName.includes("coorg")));
          if (!matchesDist) return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "hidden-gem" && !dest.isHiddenGem) return false;
          if (selectedCategory !== "hidden-gem" && dest.category !== selectedCategory) return false;
        }

        // Hidden Gems only toggle
        if (onlyGems && !dest.isHiddenGem) {
          return false;
        }

        // Crowd filter
        if (selectedCrowd !== "all") {
          if (selectedCrowd === "low" && dest.crowdPercentage > 35) return false;
          if (selectedCrowd === "moderate" && (dest.crowdPercentage <= 35 || dest.crowdPercentage > 70)) return false;
          if (selectedCrowd === "high" && dest.crowdPercentage <= 70) return false;
        }

        // Budget filter
        if (selectedBudget !== "all") {
          const totalCost = Object.values(dest.estimatedCosts).reduce((a, b) => a + b, 0);
          if (selectedBudget === "budget" && totalCost > 5000) return false;
          if (selectedBudget === "mid" && (totalCost <= 5000 || totalCost > 15000)) return false;
          if (selectedBudget === "luxury" && totalCost <= 15000) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
        if (sortBy === "cost-low") {
          const costA = Object.values(a.estimatedCosts).reduce((acc, c) => acc + c, 0);
          const costB = Object.values(b.estimatedCosts).reduce((acc, c) => acc + c, 0);
          return costA - costB;
        }
        if (sortBy === "cost-high") {
          const costA = Object.values(a.estimatedCosts).reduce((acc, c) => acc + c, 0);
          const costB = Object.values(b.estimatedCosts).reduce((acc, c) => acc + c, 0);
          return costB - costA;
        }
        return 0;
      });
  }, [destList, searchQuery, selectedState, selectedDistrict, selectedCategory, selectedCrowd, selectedBudget, onlyGems, sortBy]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "16px 24px 60px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
      {/* Header & Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--brand-saffron-light)",
              color: "var(--brand-saffron)",
              padding: "4px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 800,
              marginBottom: "8px"
            }}
          >
            <Landmark size={14} />
            <span>India • All 28 States & UTs with Capitals, Districts & Local Secrets</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.6rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "6px" }}>
            Explore Incredible India 🇮🇳
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
            Search any state or district to unlock famous spots, official attractions, and local hidden gems known by residents.
          </p>
        </div>
      </div>

      {/* Visual State Representation Strip */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "0.80rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Select State (Mandatory Capital Included)
          </span>
          {selectedState && (
            <button
              onClick={() => handleStateChange("")}
              style={{ background: "transparent", border: "none", color: "var(--brand-saffron)", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}
            >
              Show All States ({allStates.length})
            </button>
          )}
        </div>

        {/* Scrollable Visual State Cards Carousel */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "8px",
            scrollbarWidth: "thin"
          }}
        >
          {STATE_REPRESENTATIONS.map((st) => {
            const isSelected = selectedState.toLowerCase() === st.state.toLowerCase();
            return (
              <div
                key={st.state}
                onClick={() => handleStateChange(isSelected ? "" : st.state)}
                className="glass-card"
                style={{
                  minWidth: "170px",
                  height: "120px",
                  position: "relative",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: isSelected ? "2px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  transition: "all var(--transition-fast)",
                  flexShrink: 0
                }}
              >
                <img
                  src={st.image}
                  alt={st.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isSelected ? "brightness(0.75)" : "brightness(0.55)"
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.2) 60%)"
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "10px",
                    right: "10px",
                    color: "#fff"
                  }}
                >
                  <div style={{ fontSize: "0.66rem", color: "#60A5FA", fontWeight: 800, textTransform: "uppercase" }}>
                    🏛️ {st.capital}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.92rem", lineHeight: 1.2 }}>
                    {st.label}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {st.tagline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MANDATORY STATE CAPITAL SHOWCASE BANNER & ALL DISTRICTS STRIP */}
      {currentStateInfo && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: "24px 28px",
            borderRadius: "var(--radius-xl)",
            background: "linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(22, 163, 74, 0.08) 100%), var(--bg-card)",
            border: "2px solid rgba(234, 88, 12, 0.3)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "24px",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ background: "var(--brand-saffron)", color: "#fff", padding: "3px 10px", borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>
                🏛️ Mandatory State Capital: {currentStateInfo.capital}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700 }}>
                {currentStateInfo.state}
              </span>
            </div>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "6px" }}>
              {currentStateInfo.capital} — {currentStateInfo.state}
            </h3>

            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "14px" }}>
              {currentStateInfo.capitalDescription}
            </p>

            {/* Capital Attractions */}
            <div style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                Top Capital Landmarks & Visiting Spots:
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {currentStateInfo.capitalAttractions.map((att, i) => (
                  <span key={i} style={{ background: "var(--bg-card-solid)", padding: "3px 10px", borderRadius: "var(--radius-md)", fontSize: "0.75rem", fontWeight: 600, border: "1px solid var(--border-subtle)" }}>
                    📍 {att}
                  </span>
                ))}
              </div>
            </div>

            {/* All Districts in this state */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  All District Visiting Spots in {currentStateInfo.state} ({currentStateInfo.keyDistricts.length} Districts):
                </span>
                {selectedDistrict && (
                  <span
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 800,
                      color: "#8B5CF6",
                      background: "rgba(139, 92, 246, 0.15)",
                      padding: "2px 10px",
                      borderRadius: "var(--radius-full)"
                    }}
                  >
                    Active District: {selectedDistrict}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {currentStateInfo.keyDistricts.map((dist, idx) => {
                  const cleanDist = dist.split(" ")[0];
                  const isDistSelected = selectedDistrict && dist.toLowerCase().includes(selectedDistrict.toLowerCase());
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedDistrict(isDistSelected ? "" : cleanDist);
                      }}
                      style={{
                        background: isDistSelected ? "var(--brand-saffron)" : "var(--bg-tertiary)",
                        color: isDistSelected ? "#fff" : "var(--text-primary)",
                        padding: "4px 12px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.74rem",
                        fontWeight: isDistSelected ? 800 : 600,
                        border: isDistSelected ? "1px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>{dist}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <img
              src={currentStateInfo.capitalImage}
              alt={currentStateInfo.capital}
              style={{ width: "160px", height: "120px", borderRadius: "var(--radius-lg)", objectFit: "cover", boxShadow: "var(--shadow-md)" }}
            />
            <button
              onClick={() => {
                setSearchQuery(currentStateInfo.capital);
                setSelectedDistrict(currentStateInfo.capital);
              }}
              className="btn-primary"
              style={{ fontSize: "0.78rem", padding: "6px 14px", width: "100%" }}
            >
              Explore {currentStateInfo.capital}
            </button>
          </div>
        </div>
      )}

      {/* Main Filter Bar */}
      <div className="glass-panel" style={{ padding: "20px 24px", borderRadius: "var(--radius-xl)", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {/* Search Input with Live District & Destination Suggestions */}
          <div ref={searchContainerRef} style={{ position: "relative" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              Search Any District, Destination or State
            </label>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="input-field"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder="Search destinations..."
                style={{ paddingLeft: "36px", paddingRight: searchQuery ? "32px" : "12px" }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchSuggestions(false);
                  }}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "2px"
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Live Autocomplete Suggestions Dropdown across all Indian Districts, States, and Spots */}
            {showSearchSuggestions && (searchSuggestions.districts.length > 0 || searchSuggestions.states.length > 0 || searchSuggestions.destinations.length > 0) && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: isDark ? "#0F172A" : "#FFFFFF",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg, 12px)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
                  zIndex: 100,
                  marginTop: "6px",
                  maxHeight: "320px",
                  overflowY: "auto",
                  padding: "6px 0"
                }}
              >
                {/* 1. Districts Section */}
                {searchSuggestions.districts.length > 0 && (
                  <div>
                    <div style={{ padding: "6px 12px", fontSize: "0.68rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", letterSpacing: "0.05em" }}>
                      Districts in India ({searchSuggestions.districts.length})
                    </div>
                    {searchSuggestions.districts.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectDistrictSuggestion(item)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid var(--border-subtle, rgba(0,0,0,0.04))",
                          transition: "background 0.15s ease"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>{item.displayName}</strong>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "6px" }}>({item.state})</span>
                        </div>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: "rgba(37,99,235,0.12)", color: "var(--brand-primary, #2563EB)" }}>
                          District
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. States Section */}
                {searchSuggestions.states.length > 0 && (
                  <div>
                    <div style={{ padding: "6px 12px", fontSize: "0.68rem", fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", letterSpacing: "0.05em" }}>
                      States / UTs ({searchSuggestions.states.length})
                    </div>
                    {searchSuggestions.states.map((st, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectStateSuggestion(st.state)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid var(--border-subtle, rgba(0,0,0,0.04))"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>{st.state}</strong>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "6px" }}>(Capital: {st.capital})</span>
                        </div>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: "rgba(124,58,237,0.12)", color: "#7C3AED" }}>
                          State
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Destinations Section */}
                {searchSuggestions.destinations.length > 0 && (
                  <div>
                    <div style={{ padding: "6px 12px", fontSize: "0.68rem", fontWeight: 800, color: "#16A34A", textTransform: "uppercase", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", letterSpacing: "0.05em" }}>
                      Destinations & Spots ({searchSuggestions.destinations.length})
                    </div>
                    {searchSuggestions.destinations.map((dest, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectDestinationSuggestion(dest)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>{dest.name}</strong>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginLeft: "6px" }}>({dest.district}, {dest.state})</span>
                        </div>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: "rgba(22,163,74,0.12)", color: "#16A34A" }}>
                          Spot
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* State Selector */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              State / UT ({allStates.length})
            </label>
            <select
              className="select-field"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <option value="">All 28 States & UTs</option>
              {allStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* District Selector — All Indian Districts are selectable */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              District {selectedDistrict && `(Active: ${selectedDistrict})`}
            </label>
            <select
              className="select-field"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              {selectedState ? (
                <>
                  <option value="">All Districts in {selectedState} ({availableDistricts.length})</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </>
              ) : (
                <>
                  <option value="">All 700+ Districts in India (Select District)</option>
                  {ALL_INDIAN_STATES_DIRECTORY.map((stateObj) => (
                    <optgroup key={stateObj.state} label={`— ${stateObj.state} (${stateObj.keyDistricts.length} Districts) —`}>
                      {stateObj.keyDistricts.map((dist) => {
                        const cleanD = dist.split("(")[0].trim();
                        return (
                          <option key={dist} value={cleanD}>
                            {dist} ({stateObj.state})
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              Category
            </label>
            <select
              className="select-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
              Daily Budget
            </label>
            <select
              className="select-field"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              <option value="all">Any Budget</option>
              <option value="budget">Budget (&lt; ₹2,500/day)</option>
              <option value="mid">Mid-Range (₹2,500 - ₹4,500)</option>
              <option value="luxury">Luxury (&gt; ₹4,500/day)</option>
            </select>
          </div>
        </div>

        {/* Filter Footer Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setOnlyGems(!onlyGems)}
              style={{
                background: onlyGems ? "var(--brand-saffron-light)" : "var(--bg-tertiary)",
                color: onlyGems ? "var(--brand-saffron)" : "var(--text-secondary)",
                border: onlyGems ? "1px solid var(--brand-saffron)" : "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-full)",
                padding: "6px 14px",
                fontSize: "0.80rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Sparkles size={14} />
              <span>Hidden Gems Only</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="btn-ghost"
              style={{ fontSize: "0.80rem", gap: "4px" }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.80rem", color: "var(--text-muted)", fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-field"
              style={{ padding: "4px 8px", fontSize: "0.80rem", height: "auto" }}
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="cost-low">Lowest Cost</option>
              <option value="cost-high">Highest Cost</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INLINE DISTRICT HIDDEN GEMS SECTION: PRESENT DIRECTLY AFTER SEARCHED DISTRICT */}
      {/* ========================================================================= */}
      {matchingDistrictGems.length > 0 && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: "24px 28px",
            borderRadius: "var(--radius-2xl)",
            background: isDark
              ? "linear-gradient(135deg, rgba(139, 92, 246, 0.16) 0%, rgba(37, 99, 235, 0.1) 100%), var(--bg-card)"
              : "linear-gradient(135deg, rgba(243, 232, 255, 0.75) 0%, rgba(240, 249, 255, 0.75) 100%), #FFFFFF",
            border: "2px solid rgba(139, 92, 246, 0.35)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxShadow: "var(--shadow-lg)"
          }}
        >
          {/* Section Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                  color: "#FFFFFF",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  marginBottom: "8px",
                  boxShadow: "0 2px 8px rgba(139, 92, 246, 0.35)"
                }}
              >
                <Sparkles size={14} />
                <span>LOCAL RESIDENTS' FAMOUS PLACES & HIDDEN GEMS</span>
              </div>

              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, letterSpacing: "-0.02em", margin: "2px 0 4px" }}>
                {selectedDistrict
                  ? `✨ ${selectedDistrict} District Local Secrets & Iconic Spots (${matchingDistrictGems.length})`
                  : searchQuery
                  ? `✨ Local Secrets matching "${searchQuery}" (${matchingDistrictGems.length})`
                  : `✨ ${selectedState} District Local Gems (${matchingDistrictGems.length})`}
              </h3>

              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0 }}>
                {selectedDistrict?.toLowerCase().includes("chennai")
                  ? "Historic railway terminals, open zoological parks, museum art galleries, and beachside food walks known by locals."
                  : "Authentic local landmarks, heritage streets, parks, museums, and food hubs known and loved by local residents."}
              </p>
            </div>

            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#8B5CF6",
                background: "rgba(139, 92, 246, 0.15)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(139, 92, 246, 0.25)"
              }}
            >
              ⭐ {matchingDistrictGems.length} Verified Local Spots
            </span>
          </div>

          {/* Grid of District Hidden Gems */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px"
            }}
          >
            {matchingDistrictGems.map((gem) => {
              const isSaved = !!savedGems[gem.id];
              return (
                <div
                  key={gem.id}
                  className="glass-card"
                  onClick={() => setSelectedGemModal(gem)}
                  style={{
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    border: "1px solid var(--border-subtle)",
                    background: isDark ? "rgba(15, 23, 42, 0.75)" : "var(--bg-card)"
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
                  {/* Image Banner */}
                  <div style={{ position: "relative", height: "170px", width: "100%", overflow: "hidden" }}>
                    <img
                      src={gem.image}
                      alt={gem.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />

                    {/* District & State Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "rgba(0, 0, 0, 0.75)",
                        backdropFilter: "blur(8px)",
                        color: "#FFFFFF",
                        padding: "3px 9px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <MapPin size={11} color="var(--brand-saffron)" />
                      <span>{gem.district}</span>
                    </div>

                    {/* Bookmark Save Button */}
                    <button
                      onClick={(e) => toggleSaveGem(gem.id, e)}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: isSaved ? "rgba(234, 88, 12, 0.9)" : "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(8px)",
                        border: "none",
                        color: "#FFFFFF",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <Heart size={15} fill={isSaved ? "#FFFFFF" : "none"} />
                    </button>

                    {/* Local Badge Tag */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        left: "10px",
                        background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
                        color: "#FFFFFF",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.68rem",
                        fontWeight: 800
                      }}
                    >
                      {gem.badge}
                    </div>

                    {/* Rating */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "10px",
                        background: "rgba(0, 0, 0, 0.7)",
                        color: "#EA580C",
                        padding: "2px 7px",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.72rem",
                        fontWeight: 800
                      }}
                    >
                      ★ {gem.rating}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    <h4 style={{ fontSize: "1.02rem", fontWeight: 800, lineHeight: 1.3, margin: 0 }}>{gem.name}</h4>

                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.45, margin: 0 }}>
                      {gem.shortDescription}
                    </p>

                    {/* Why Locals Love It Callout */}
                    <div
                      style={{
                        background: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(243, 232, 255, 0.7)",
                        padding: "8px 10px",
                        borderRadius: "var(--radius-md)",
                        borderLeft: "3px solid #8B5CF6",
                        marginTop: "4px"
                      }}
                    >
                      <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#8B5CF6", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                        <Lightbulb size={11} />
                        <span>WHY LOCALS LOVE IT</span>
                      </div>
                      <p style={{ fontSize: "0.76rem", color: "var(--text-primary)", lineHeight: 1.4, margin: 0 }}>
                        {gem.whyLocalsLoveIt}
                      </p>
                    </div>

                    {/* Metadata Strip */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Clock size={12} color="var(--text-muted)" />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{gem.timings}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Navigation size={12} color="var(--text-muted)" />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{gem.nearestTransit}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ marginTop: "auto", paddingTop: "10px", display: "flex", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGemModal(gem);
                        }}
                        style={{
                          flex: 1,
                          padding: "7px 10px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-subtle)",
                          background: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                          fontWeight: 700,
                          fontSize: "0.78rem",
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
                          gap: "4px",
                          padding: "7px 12px",
                          borderRadius: "var(--radius-md)",
                          border: "none",
                          background: "var(--brand-saffron)",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          cursor: "pointer"
                        }}
                      >
                        <CalendarCheck size={13} />
                        <span>Plan Trip</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
          {selectedDistrict
            ? `${selectedDistrict} District Destinations`
            : selectedState
            ? `${selectedState} Destinations`
            : "All Indian Destinations"}
        </h2>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 700 }}>
          Showing {filteredDestinations.length} Places
        </span>
      </div>

      {/* Destination Cards Grid */}
      {isDestLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div
              key={sk}
              className="glass-card"
              style={{
                height: "340px",
                borderRadius: "var(--radius-xl)",
                background: "var(--bg-tertiary)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <div style={{ height: "180px", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                <div style={{ height: "18px", width: "70%", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }} />
                <div style={{ height: "12px", width: "45%", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }} />
                <div style={{ height: "12px", width: "90%", background: "rgba(255,255,255,0.05)", borderRadius: "4px", marginTop: "auto" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="glass-panel" style={{ padding: "48px", textAlign: "center", borderRadius: "var(--radius-xl)" }}>
          <Compass size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>No destinations found</h3>
          <p style={{ fontSize: "0.90rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Try resetting your filters or selecting a different district or state.
          </p>
          <button onClick={handleResetFilters} className="btn-primary" style={{ marginTop: "16px", fontSize: "0.84rem" }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onSelect={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Detailed Modal for District Hidden Gems */}
      {selectedGemModal && (
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
          onClick={() => setSelectedGemModal(null)}
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
                src={selectedGemModal.image}
                alt={selectedGemModal.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />

              <button
                onClick={() => setSelectedGemModal(null)}
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
                  {selectedGemModal.badge}
                </span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.2 }}>
                  {selectedGemModal.name}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", marginTop: "4px" }}>
                  <MapPin size={13} color="var(--brand-saffron)" />
                  <span>{selectedGemModal.district}, {selectedGemModal.state}</span>
                  <span>•</span>
                  <span>★ {selectedGemModal.rating} ({selectedGemModal.reviewsCount} reviews)</span>
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
                  {selectedGemModal.shortDescription}
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
                  {selectedGemModal.whyLocalsLoveIt}
                </p>
              </div>

              {/* Key Highlights */}
              <div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Key Highlights & Must-See Features
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {selectedGemModal.highlights?.map((h, i) => (
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
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "2px" }}>{selectedGemModal.timings}</div>
                </div>
                <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)" }}>ENTRY FEE</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "2px" }}>{selectedGemModal.entryFee}</div>
                </div>
              </div>

              <div style={{ background: "var(--bg-tertiary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)" }}>NEAREST TRANSIT / ACCESS</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, marginTop: "2px" }}>{selectedGemModal.nearestTransit}</div>
              </div>

              {/* Local Insider Tip */}
              {selectedGemModal.localTip && (
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
                    <span style={{ fontSize: "0.84rem", color: "var(--text-primary)" }}>{selectedGemModal.localTip}</span>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  onClick={() => setSelectedGemModal(null)}
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
                        name: selectedGemModal.name,
                        state: selectedGemModal.state,
                        district: selectedGemModal.district,
                        image: selectedGemModal.image
                      });
                    }
                    setSelectedGemModal(null);
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
