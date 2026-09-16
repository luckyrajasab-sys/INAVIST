import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Navigation,
  Sun,
  Snowflake,
  CloudSun,
  Camera,
  CarFront,
  Bike,
  Bus,
  Train,
  Car,
  Layers,
  Share2
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { usePlanner } from "../../context/PlannerContext";
import { useAuth } from "../../context/AuthContext";
import { FirstMileComparison } from "./FirstMileComparison";
import { MainTransportComparison } from "./MainTransportComparison";
import { AlternativeRoutesView } from "./AlternativeRoutesView";
import { JourneyTimeline } from "./JourneyTimeline";
import { TransportService } from "../../services/TransportService";
import { DestinationService } from "../../services/DestinationService";
import { PrePostBoardingGuide } from "./PrePostBoardingGuide";

export const DestinationResultPage = ({
  destination,
  fromCity = "Chennai",
  travelDate = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
  passengers = 1,
  onBack,
  onStartPlan,
  onBookTransport
}) => {
  const { isDark } = useTheme();
  const { showToast } = usePlanner();
  const { isAuthenticated, openAuthModal, user } = useAuth();

  // Compute Smart Journey Plan
  const [journeyPlan, setJourneyPlan] = useState(() =>
    TransportService.getSmartJourneyPlan({
      fromLocation: fromCity,
      toDestination: destination?.name || "Kodaikanal",
      travelDate,
      passengers
    })
  );

  // Active selections
  const [selectedFirstMile, setSelectedFirstMile] = useState(
    journeyPlan.defaultSelection.firstMile
  );
  const [selectedMainMode, setSelectedMainMode] = useState("train");
  const [selectedMainOption, setSelectedMainOption] = useState(null);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState(null);
  const [activeTabSection, setActiveTabSection] = useState("all");

  useEffect(() => {
    const updated = TransportService.getSmartJourneyPlan({
      fromLocation: fromCity,
      toDestination: destination?.name || "Kodaikanal",
      travelDate,
      passengers
    });
    setJourneyPlan(updated);
    setSelectedFirstMile(updated.defaultSelection.firstMile);
  }, [fromCity, destination, travelDate, passengers]);

  const weather = DestinationService.getWeatherEstimate(destination?.name);
  const nearbyPlaces = DestinationService.getNearbyDestinations(destination?.name, 3);

  // Resolve current active main transit choice
  const activeMainChoice = journeyPlan.mainTransport[selectedMainMode] || journeyPlan.mainTransport.train;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "1200px", margin: "0 auto", padding: "16px 20px" }}>
      {/* Top Breadcrumb & Back Action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Planner</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          <span>India</span>
          <span>/</span>
          <span>{destination?.state || "Tamil Nadu"}</span>
          <span>/</span>
          <span>{destination?.district || "District"}</span>
          <span>/</span>
          <strong style={{ color: "var(--text-primary)" }}>{destination?.name}</strong>
        </div>
      </div>

      {/* 1. Destination Overview Hero Banner */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-2xl)",
          overflow: "hidden",
          border: "1.5px solid var(--border-subtle)",
          position: "relative"
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {/* Destination Hero Image */}
          <div style={{ height: "300px", position: "relative" }}>
            <img
              src={destination?.images?.[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"}
              alt={destination?.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)"
              }}
            />
            <div style={{ position: "absolute", bottom: "16px", left: "18px", right: "18px", color: "#FFFFFF" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#F97316" }}>
                {destination?.category?.toUpperCase()} DESTINATION
              </div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.85rem", fontWeight: 900, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                {destination?.name}
              </h1>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
                📍 {destination?.district}, {destination?.state}
              </div>
            </div>
          </div>

          {/* Quick Overview Specs */}
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "14px" }}>
                {destination?.detailedDescription || destination?.description}
              </p>

              {/* Weather & Best Season Widget */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "12px", borderRadius: "var(--radius-lg)", background: isDark ? "rgba(0,0,0,0.25)" : "#F8FAFC" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Current Weather
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sun size={15} style={{ color: "#F97316" }} />
                    <span>{weather.temp}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{weather.condition}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Best Visiting Hours
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={15} style={{ color: "#2563EB" }} />
                    <span>{destination?.viewpointTimings?.bestTime || "06:30 AM – 10:00 AM"}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Year-round season</div>
                </div>
              </div>
            </div>

            {/* Popular Attractions Badges */}
            {destination?.nearbyAttractions && destination.nearbyAttractions.length > 0 && (
              <div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase" }}>
                  Key Attractions in {destination.name}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {destination.nearbyAttractions.map((att, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
                        color: "var(--text-primary)"
                      }}
                    >
                      🏛️ {att}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Transport Comparison */}
      <div
        className="glass-card"
        style={{
          padding: "24px",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--border-subtle)"
        }}
      >
        <MainTransportComparison
          mainOptions={journeyPlan.mainTransport}
          selectedMode={selectedMainMode}
          onSelectMode={(mode) => setSelectedMainMode(mode)}
          selectedOption={selectedMainOption}
          onSelectOption={(opt) => {
            setSelectedMainOption(opt);
            setSelectedMainMode(opt.mode);
            showToast?.(`Selected: ${opt.name} (${opt.tier}) ✨`);
          }}
          fromCity={fromCity}
          toDestination={destination?.name}
          travelDate={travelDate}
          passengers={passengers}
        />
      </div>

      {/* 3. First-Mile Transport Comparison */}
      <div
        className="glass-card"
        style={{
          padding: "24px",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--border-subtle)"
        }}
      >
        <div style={{ marginBottom: "14px" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "2px"
            }}
          >
            First-Mile: How to reach the Station / Terminal from {fromCity} Home?
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Compare your door-to-terminal travel choices for a hassle-free start.
          </p>
        </div>

        <FirstMileComparison
          options={journeyPlan.firstMileOptions}
          selectedOptionId={selectedFirstMile?.id}
          onSelectOption={(opt) => setSelectedFirstMile(opt)}
          originName={`${fromCity} Home`}
          terminalName={`${fromCity} Departure Hub`}
        />
      </div>

      {/* 4. Alternative Ways to Reach */}
      <div
        className="glass-card"
        style={{
          padding: "24px",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--border-subtle)"
        }}
      >
        <AlternativeRoutesView
          routes={journeyPlan.alternativeRoutes}
          selectedAlternativeId={selectedAlternativeId}
          onSelectAlternative={(alt) => {
            setSelectedAlternativeId(alt.id);
            showToast?.(`Selected alternative route: ${alt.title}`);
          }}
        />
      </div>

      {/* 5. Local Transport at Destination */}
      <div
        className="glass-card"
        style={{
          padding: "24px",
          borderRadius: "var(--radius-2xl)",
          border: "1.5px solid var(--border-subtle)"
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "2px"
            }}
          >
            Local Transport in {destination?.name}
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            After reaching the destination, navigate local viewpoints, markets, and hotels.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          {journeyPlan.localTransport?.map((loc) => (
            <div
              key={loc.id}
              style={{
                padding: "16px",
                borderRadius: "var(--radius-lg)",
                background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{loc.name}</strong>
                <span style={{ fontSize: "0.90rem", fontWeight: 800, color: "#16A34A" }}>{loc.fareRange}</span>
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{loc.pricingType}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {loc.bestFor}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Pre-Boarding & Post-Deboarding Lifecycle Guide */}
      <PrePostBoardingGuide
        destinationName={destination?.name || "Kodaikanal"}
        fromCity={fromCity}
      />

      {/* 7. Complete Journey Timeline & Interactive Live Cost */}
      <JourneyTimeline
        fromLocation={`${fromCity} Home`}
        toDestination={destination?.name}
        travelDate={travelDate}
        firstMileChoice={{
          name: selectedFirstMile?.name || "App Cab",
          duration: selectedFirstMile?.timeFormatted || "25 min",
          cost: selectedFirstMile?.estimatedCost || 300
        }}
        mainTransitChoice={{
          name: selectedMainOption
            ? `${selectedMainOption.name} (${selectedMainOption.tier})`
            : (activeMainChoice?.title || "Train (3AC)"),
          duration: selectedMainOption?.duration || activeMainChoice?.durationFormatted || "7h 30m",
          cost: selectedMainOption?.price || activeMainChoice?.priceMin || 650,
          mode: selectedMainOption?.mode || selectedMainMode
        }}
        lastMileChoice={{
          name: "Local Town Transport",
          duration: "25 min",
          cost: 200
        }}
        curatedRoutes={journeyPlan.curatedPackages}
        passengers={passengers}
        onBookOrConfirm={() => {
          if (!isAuthenticated) {
            showToast?.("Please Sign In or Create an Account to book transit or plan trips! 🎫");
            openAuthModal("signin");
            return;
          }
          if (onStartPlan) {
            onStartPlan(destination);
          } else if (onBookTransport) {
            onBookTransport(selectedMainOption || activeMainChoice);
          }
        }}
      />
    </div>
  );
};
