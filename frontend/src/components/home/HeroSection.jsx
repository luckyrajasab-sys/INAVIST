import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  IndianRupee,
  Bus,
  Train,
  Plane,
  Car,
  Bike,
  Building,
  Heart,
  ChevronRight,
  Filter,
  Flame,
  Award,
  Wallet,
  GitFork,
  CheckCircle2
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { destinationsData, getAllStates } from "../../data/destinationsData";
import { AdvancedSearchBar } from "../search/AdvancedSearchBar";
import { TravelSearchResultsView } from "../search/TravelSearchResultsView";
import { JourneyDetailsModal } from "../booking/JourneyDetailsModal";
import { MultiStepBookingModal } from "../booking/MultiStepBookingModal";
import { BookingConfirmationModal } from "../booking/BookingConfirmationModal";
import { SuddenTravelModal } from "../transport/SuddenTravelModal";
import { TravelSearchService } from "../../services/TravelSearchService";
import { BudgetService } from "../../services/BudgetService";

export const HeroSection = ({ onNavigateTab, onSelectDestination, onStartPlan }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  // Search Results View State
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Modals state
  const [selectedRouteForDetails, setSelectedRouteForDetails] = useState(null);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState(null);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [isSuddenModalOpen, setIsSuddenModalOpen] = useState(false);

  // Search parameters
  const [currentSearchParams, setCurrentSearchParams] = useState({
    fromCity: "",
    toDestination: "",
    travelDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    passengers: 1
  });

  // Budget Filter Tier State
  const [selectedBudgetTier, setSelectedBudgetTier] = useState("tier-5000");
  const budgetTiers = BudgetService.getBudgetTiers();

  // Multi-Stage Search Loader Stages
  const [searchStage, setSearchStage] = useState(0);

  const searchStages = [
    { title: "Connecting to IRCTC superfast rail networks...", icon: Train, color: "#2563EB" },
    { title: "Scanning State RTC & private sleeper buses...", icon: Bus, color: "#EA580C" },
    { title: "Checking domestic airline saver fares & baggage limits...", icon: Plane, color: "#0EA5E9" },
    { title: "Formulating multi-modal connected combinations...", icon: GitFork, color: "#7C3AED" },
    { title: "Ranking best prices, travel times & comfort scores...", icon: Sparkles, color: "#10B981" }
  ];

  const handleExecuteSearch = async ({
    fromCity,
    toDestination,
    travelDate,
    passengers,
    travelPreference
  }) => {
    setIsSearching(true);
    setSearchStage(0);
    setCurrentSearchParams({
      fromCity,
      toDestination,
      travelDate,
      passengers
    });

    const interval = setInterval(() => {
      setSearchStage((prev) => (prev < 4 ? prev + 1 : prev));
    }, 280);

    try {
      const results = await TravelSearchService.searchRoutes({
        fromCity,
        toDestination,
        travelDate,
        passengers,
        travelPreference
      });
      clearInterval(interval);
      setSearchStage(4);
      setTimeout(() => {
        setSearchResults(results);
        setIsSearching(false);
      }, 400);
    } catch (err) {
      clearInterval(interval);
      console.error("Search failed:", err);
      setIsSearching(false);
    }
  };

  const handleBookingSuccess = (confirmedData) => {
    setSelectedRouteForBooking(null);
    setConfirmedBookingData(confirmedData);

    // Save to all bookings in localStorage
    const localAll = localStorage.getItem("inavist_all_bookings");
    const existing = localAll ? JSON.parse(localAll) : [];
    const newRecord = {
      id: `bkg-${Date.now()}`,
      bookingId: confirmedData.paymentReceipt?.bookingId || `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      pnr: `PNR-${Math.floor(10000000 + Math.random() * 90000000)}`,
      originCity: confirmedData.route?.fromLocation || confirmedData.route?.from || "Chennai",
      destinationCity: confirmedData.route?.toLocation || confirmedData.route?.to || "Goa",
      travelDate: confirmedData.travelDate,
      type: confirmedData.route?.mode || "train",
      operator: confirmedData.route?.operator || confirmedData.route?.title,
      category: confirmedData.selectedClass || confirmedData.route?.category,
      departureTime: confirmedData.route?.departureTime || "06:30 AM",
      arrivalTime: confirmedData.route?.arrivalTime || "01:00 PM",
      duration: confirmedData.route?.duration || "6h 30m",
      amount: confirmedData.pricing?.totalAmount || 1250,
      paymentStatus: "VERIFIED",
      paymentMethod: confirmedData.paymentReceipt?.paidVia || "UPI",
      rewardPointsEarned: Math.max(50, Math.round((confirmedData.pricing?.totalAmount || 1250) * 0.08)),
      status: "Confirmed",
      passengers: confirmedData.passengers
    };
    localStorage.setItem("inavist_all_bookings", JSON.stringify([newRecord, ...existing]));
  };

  const trendingDestinations = destinationsData.slice(0, 6);

  // Budget matching options (under ₹5,000)
  const budgetOptions = BudgetService.getBudgetMatchingDestinations({
    userBudget: selectedBudgetTier === "tier-500" ? 500 : selectedBudgetTier === "tier-1000" ? 1000 : selectedBudgetTier === "tier-2500" ? 2500 : 5000,
    fromCity: "Chennai",
    travellers: 1,
    durationDays: 2
  }).slice(0, 4);

  // If search loading is active, display the multi-stage animated loader
  if (isSearching) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          maxWidth: "700px",
          margin: "0 auto",
          width: "100%",
          gap: "28px"
        }}
      >
        <div
          className="glass-card animate-scale-up"
          style={{
            width: "100%",
            borderRadius: "var(--radius-2xl, 24px)",
            padding: "36px 32px",
            background: isDark
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
            border: "2px solid rgba(37, 99, 235, 0.35)",
            boxShadow: "0 20px 50px -10px rgba(37, 99, 235, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "22px",
            textAlign: "center"
          }}
        >
          {/* Animated Glowing Radar Pulse */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)",
              position: "relative"
            }}
          >
            <Compass size={36} className="animate-spin" style={{ animationDuration: "6s" }} />
          </div>

          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.76rem", fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
              <Sparkles size={14} />
              <span>Smart Travel Aggregator</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.60rem", fontWeight: 900, color: "var(--text-primary)", margin: "4px 0 0" }}>
              Finding the best routes for you...
            </h2>
            <div style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "4px", fontWeight: 600 }}>
              {currentSearchParams.fromCity} ➔ {currentSearchParams.toDestination} • {currentSearchParams.travelDate}
            </div>
          </div>

          {/* Multi-Stage Step Progress List */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
            {searchStages.map((st, idx) => {
              const isPassed = idx < searchStage;
              const isCurrent = idx === searchStage;
              const StageIcon = st.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: isCurrent ? (isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.08)") : isPassed ? "rgba(16,185,129,0.08)" : "var(--bg-tertiary)",
                    border: `1px solid ${isCurrent ? "#2563EB" : isPassed ? "#10B981" : "var(--border-subtle)"}`,
                    transition: "all 0.3s ease"
                  }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: isPassed ? "#10B981" : isCurrent ? "#2563EB" : "var(--border-subtle)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {isPassed ? <CheckCircle2 size={15} /> : <StageIcon size={14} />}
                  </div>

                  <span style={{ fontSize: "0.82rem", fontWeight: isCurrent || isPassed ? 800 : 500, color: isCurrent ? "var(--brand-primary, #2563EB)" : isPassed ? "var(--text-primary)" : "var(--text-muted)", flex: 1 }}>
                    {st.title}
                  </span>

                  {isPassed && <span style={{ fontSize: "0.72rem", color: "#10B981", fontWeight: 800 }}>Done ✓</span>}
                  {isCurrent && <span style={{ fontSize: "0.72rem", color: "#2563EB", fontWeight: 800 }}>Scanning...</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // If search results are active, display the comprehensive Search Results View
  if (searchResults) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TravelSearchResultsView
          searchData={searchResults}
          onBack={() => setSearchResults(null)}
          onModifySearch={() => setSearchResults(null)}
          onSelectRoute={(route) => setSelectedRouteForDetails(route)}
        />

        {/* Journey Details Modal */}
        <JourneyDetailsModal
          isOpen={!!selectedRouteForDetails}
          onClose={() => setSelectedRouteForDetails(null)}
          route={selectedRouteForDetails}
          travelDate={currentSearchParams.travelDate}
          passengers={currentSearchParams.passengers}
          onContinueToBooking={(route) => {
            setSelectedRouteForDetails(null);
            setSelectedRouteForBooking(route);
          }}
        />

        {/* Multi-Step Booking Modal */}
        <MultiStepBookingModal
          isOpen={!!selectedRouteForBooking}
          onClose={() => setSelectedRouteForBooking(null)}
          route={selectedRouteForBooking}
          travelDate={currentSearchParams.travelDate}
          initialPassengers={currentSearchParams.passengers}
          onBookingConfirmed={handleBookingSuccess}
        />

        {/* Booking Confirmation Celebration Modal with Back Navigation */}
        <BookingConfirmationModal
          isOpen={!!confirmedBookingData}
          onClose={() => setConfirmedBookingData(null)}
          onBack={() => {
            // Return to previous logical booking step while preserving data
            setConfirmedBookingData(null);
            if (confirmedBookingData?.route) {
              setSelectedRouteForBooking(confirmedBookingData.route);
            }
          }}
          bookingData={confirmedBookingData}
          onViewBookingHistory={() => onNavigateTab("booking-history")}
          onExploreDestination={(dest) => {
            if (onSelectDestination) onSelectDestination({ name: dest });
            onNavigateTab("explore");
          }}
          onBookPackage={(pkg) => {
            setConfirmedBookingData(null);
            onNavigateTab("explore");
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "12px 24px 60px", maxWidth: "1240px", margin: "0 auto", width: "100%" }}>
      {/* 1. Apple-Inspired Editorial Hero Header */}
      <div style={{ textAlign: "center", maxWidth: "880px", margin: "10px auto 0", position: "relative", zIndex: 2 }}>
        {/* Brand Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: isDark ? "rgba(37, 99, 235, 0.16)" : "rgba(37, 99, 235, 0.08)",
            color: "var(--brand-primary, #2563EB)",
            padding: "6px 18px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.80rem",
            fontWeight: 800,
            letterSpacing: "0.04em",
            marginBottom: "16px",
            border: "1px solid rgba(37, 99, 235, 0.25)"
          }}
        >
          <Sparkles size={14} />
          <span>INAVIST • ADVANCED TRAVEL SEARCH & UPI REWARDS</span>
        </div>

        {/* Clean, Apple-style Typography */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.4rem, 5.2vw, 3.8rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
            marginBottom: "14px",
            color: "var(--text-primary)"
          }}
        >
          Search, compare & book every way across India.
        </h1>

        <p
          style={{
            fontSize: "1.12rem",
            color: "var(--text-secondary)",
            maxWidth: "700px",
            margin: "0 auto 24px",
            lineHeight: 1.6
          }}
        >
          Compare IRCTC superfast trains, multi-axle luxury buses, flights, and doorstep outstation cabs. Pay securely with UPI and earn instant INAVIST travel points.
        </p>

        {/* Sudden Travel / "Need to Travel Now?" Quick Action Banner */}
        <div
          onClick={() => setIsSuddenModalOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "var(--radius-full)",
            background: isDark ? "rgba(220, 38, 38, 0.15)" : "rgba(220, 38, 38, 0.08)",
            color: "#DC2626",
            border: "1.5px solid rgba(220, 38, 38, 0.3)",
            fontSize: "0.84rem",
            fontWeight: 800,
            cursor: "pointer",
            marginBottom: "20px",
            transition: "all var(--transition-fast)"
          }}
        >
          <Zap size={15} />
          <span>Need to Travel Now? Emergency & Instant Departures Available</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* 2. ADVANCED SEARCH BAR — MAIN PAGE */}
      <AdvancedSearchBar
        onSearch={handleExecuteSearch}
        initialFrom=""
        initialTo=""
      />

      {/* 3. Budget-Based Destination Planning Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#16A34A", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase" }}>
              <Wallet size={14} />
              <span>Budget-Based Travel Planning</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginTop: "2px"
              }}
            >
              Where can you travel on your budget?
            </h2>
          </div>

          {/* Budget Tier Filter Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {budgetTiers.map((tier) => {
              const isSelected = selectedBudgetTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setSelectedBudgetTier(tier.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid",
                    borderColor: isSelected ? "#16A34A" : "var(--border-subtle)",
                    background: isSelected ? (isDark ? "rgba(22, 163, 74, 0.2)" : "rgba(22, 163, 74, 0.1)") : "transparent",
                    color: isSelected ? "#16A34A" : "var(--text-secondary)",
                    fontSize: "0.80rem",
                    fontWeight: isSelected ? 800 : 600,
                    cursor: "pointer"
                  }}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "18px"
          }}
        >
          {budgetOptions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleExecuteSearch({
                fromCity: "Chennai",
                toDestination: item.name,
                travelDate: new Date().toISOString().split("T")[0],
                passengers: 1,
                travelPreference: "best_value"
              })}
              className="glass-card"
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transition: "all var(--transition-fast)"
              }}
            >
              <div style={{ height: "160px", position: "relative" }}>
                <img
                  src={item.images?.[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                <span
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(22, 163, 74, 0.9)",
                    color: "#FFFFFF",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "var(--radius-full)"
                  }}
                >
                  Est. {item.costFormatted} Total
                </span>
                <div style={{ position: "absolute", bottom: "10px", left: "14px", color: "#FFFFFF" }}>
                  <h3 style={{ fontSize: "1.10rem", fontWeight: 800 }}>{item.name}</h3>
                  <div style={{ fontSize: "0.76rem", opacity: 0.9 }}>📍 {item.district}, {item.state}</div>
                </div>
              </div>

              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "0.76rem" }}>
                  <div>🚆 Transport: <strong style={{ color: "var(--text-primary)" }}>₹{item.breakdown?.transport || 600}</strong></div>
                  <div>🏨 Stay (1N): <strong style={{ color: "var(--text-primary)" }}>₹{item.breakdown?.stay || 1500}</strong></div>
                  <div>🍲 Food: <strong style={{ color: "var(--text-primary)" }}>₹{item.breakdown?.food || 600}</strong></div>
                  <div>🛺 Local: <strong style={{ color: "var(--text-primary)" }}>₹{item.breakdown?.localTransport || 400}</strong></div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "0.74rem", color: "#16A34A", fontWeight: 700 }}>{item.savingsFormatted}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--brand-primary, #2563EB)", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
                    Search Routes <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Trending Destinations Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase" }}>
              <Flame size={14} />
              <span>Trending Across India</span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginTop: "2px"
              }}
            >
              Popular Destinations & Fastest Routes
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab("explore")}
            style={{
              background: "none",
              border: "none",
              color: "var(--brand-primary, #2563EB)",
              fontWeight: 800,
              fontSize: "0.86rem",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer"
            }}
          >
            <span>Explore All Destinations</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px"
          }}
        >
          {trendingDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleExecuteSearch({
                fromCity: "Chennai",
                toDestination: dest.name,
                travelDate: new Date().toISOString().split("T")[0],
                passengers: 2,
                travelPreference: "best_value"
              })}
              className="glass-card"
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                transition: "all var(--transition-fast)"
              }}
            >
              <div style={{ height: "180px", position: "relative" }}>
                <img
                  src={dest.images?.[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                  alt={dest.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "3px 8px", borderRadius: "var(--radius-full)", background: "rgba(0,0,0,0.6)", color: "#FFFFFF" }}>
                    ⭐ {dest.rating}
                  </span>
                </div>
                <div style={{ position: "absolute", bottom: "12px", left: "14px", color: "#FFFFFF" }}>
                  <h3 style={{ fontSize: "1.18rem", fontWeight: 800 }}>{dest.name}</h3>
                  <div style={{ fontSize: "0.78rem", opacity: 0.9 }}>📍 {dest.district}, {dest.state}</div>
                </div>
              </div>

              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "0.80rem", color: "var(--text-secondary)", lineHeight: 1.4, margin: 0 }}>
                  {dest.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    background: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9",
                    fontSize: "0.76rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Train size={13} style={{ color: "var(--brand-primary, #2563EB)" }} />
                    <Bus size={13} style={{ color: "var(--brand-primary, #2563EB)" }} />
                    <Car size={13} style={{ color: "var(--brand-primary, #2563EB)" }} />
                    <Plane size={13} style={{ color: "var(--brand-primary, #2563EB)" }} />
                    <span style={{ color: "var(--text-muted)" }}>Compare 4 Modes</span>
                  </div>
                  <strong style={{ color: "#16A34A" }}>From ₹{dest.estimatedCosts?.travel || 600}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sudden Travel Modal */}
      <SuddenTravelModal
        isOpen={isSuddenModalOpen}
        onClose={() => setIsSuddenModalOpen(false)}
        currentCity="Chennai"
        destination="Kodaikanal"
        onSelectOption={(opt) => {
          onNavigateTab("transport");
        }}
      />
    </div>
  );
};
