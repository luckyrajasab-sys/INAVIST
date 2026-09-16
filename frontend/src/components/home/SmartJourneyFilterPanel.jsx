import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Bus,
  Train,
  Plane,
  Car,
  Bike,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Navigation,
  Sliders,
  Wallet,
  CheckCircle2,
  Lock,
  Compass
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { locationService } from "../../services/LocationService";
import { getAllStates, getDistrictsByState, destinationsData } from "../../data/destinationsData";

export const SmartJourneyFilterPanel = ({
  onPlanJourney,
  initialFrom = "",
  initialTo = ""
}) => {
  const { isDark } = useTheme();

  // Inputs
  const [fromCity, setFromCity] = useState(initialFrom || "");
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [selectedDistrict, setSelectedDistrict] = useState("Dindigul");
  const [selectedDestination, setSelectedDestination] = useState(initialTo || "Kodaikanal");
  const [travelDate, setTravelDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );
  const [passengers, setPassengers] = useState(2);
  const [travelMode, setTravelMode] = useState("all");
  const [budget, setBudget] = useState(5000);

  // Privacy and Geolocation
  const [isUsingLocation, setIsUsingLocation] = useState(false);
  const [locationPrivacyText, setLocationPrivacyText] = useState("Location: Off (Manual Selection)");
  const [isLocating, setIsLocating] = useState(false);

  // Dropdown options
  const states = getAllStates();
  const districts = getDistrictsByState(selectedState);
  const matchingDestinations = destinationsData.filter(
    (d) =>
      (d.state || '').toLowerCase() === (selectedState || '').toLowerCase() &&
      (!selectedDistrict || selectedDistrict === "All" || (d.district || '').toLowerCase().includes((selectedDistrict || '').toLowerCase()))
  );

  // Update district & destination when state changes
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const newDistricts = getDistrictsByState(newState);
    const defaultDist = newDistricts[0] || "All";
    setSelectedDistrict(defaultDist);

    const newDests = destinationsData.filter(
      (d) => (d.state || '').toLowerCase() === (newState || '').toLowerCase()
    );
    if (newDests.length > 0) {
      setSelectedDestination(newDests[0].name);
    }
  };

  const handleDistrictChange = (newDist) => {
    setSelectedDistrict(newDist);
    const newDests = destinationsData.filter(
      (d) =>
        (d.state || '').toLowerCase() === (selectedState || '').toLowerCase() &&
        (newDist === "All" || (d.district || '').toLowerCase().includes((newDist || '').toLowerCase()))
    );
    if (newDests.length > 0) {
      setSelectedDestination(newDests[0].name);
    }
  };

  const handleUseMyLocation = async () => {
    setIsLocating(true);
    const res = await locationService.requestUserLocation();
    setIsLocating(false);
    if (res.success) {
      setIsUsingLocation(true);
      setLocationPrivacyText("Using My Location (GPS enabled)");
      setFromCity("Current Location");
    } else {
      setIsUsingLocation(false);
      setLocationPrivacyText("Location: Off (Using selected location)");
    }
  };

  const handleDisableLocation = () => {
    locationService.disableLocation();
    setIsUsingLocation(false);
    setLocationPrivacyText("Location: Off (Using selected location)");
    setFromCity("Chennai");
  };

  const travelModes = [
    { id: "all", label: "All Modes", icon: Sparkles },
    { id: "bus", label: "Bus", icon: Bus },
    { id: "train", label: "Train (IRCTC)", icon: Train },
    { id: "flight", label: "Flight", icon: Plane },
    { id: "cab", label: "Cab / Taxi", icon: Car },
    { id: "car", label: "Car (Self-Drive)", icon: Car },
    { id: "bike", label: "Bike / Two-Wheeler", icon: Bike }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onPlanJourney) {
      const targetDest = destinationsData.find(
        (d) => d.name.toLowerCase() === selectedDestination.toLowerCase()
      ) || matchingDestinations[0] || destinationsData[0];

      onPlanJourney({
        fromCity: fromCity || "Chennai",
        destination: targetDest,
        travelDate,
        passengers,
        travelMode,
        budget
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card"
      style={{
        width: "100%",
        maxWidth: "1160px",
        margin: "0 auto",
        borderRadius: "var(--radius-2xl)",
        padding: "24px 28px",
        border: "1.5px solid var(--border-subtle)",
        boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "relative",
        zIndex: 10
      }}
    >
      {/* Top Header Strip with Privacy Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "var(--brand-primary, #2563EB)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Compass size={16} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "var(--text-primary)"
            }}
          >
            Where are you going?
          </h2>
        </div>

        {/* Privacy-Friendly Location Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.76rem",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              background: isUsingLocation
                ? "rgba(22, 163, 74, 0.12)"
                : (isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9"),
              color: isUsingLocation ? "#16A34A" : "var(--text-muted)",
              border: `1px solid ${isUsingLocation ? "rgba(22, 163, 74, 0.3)" : "var(--border-subtle)"}`
            }}
          >
            {isUsingLocation ? <Navigation size={12} /> : <Lock size={12} />}
            <span>{locationPrivacyText}</span>
          </div>

          {!isUsingLocation ? (
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              style={{
                background: "none",
                border: "none",
                fontSize: "0.78rem",
                color: "var(--brand-primary, #2563EB)",
                fontWeight: 700,
                cursor: "pointer",
                padding: "2px 6px"
              }}
            >
              {isLocating ? "Locating..." : "Use My Location"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDisableLocation}
              style={{
                background: "none",
                border: "none",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px 6px"
              }}
            >
              Turn Off
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Fields Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px"
        }}
      >
        {/* 1. FROM (Starting Location) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            From (Starting Point)
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              placeholder="Enter departure city..."
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                color: "var(--text-primary)",
                fontSize: "0.92rem",
                fontWeight: 600,
                outline: "none"
              }}
            />
            <MapPin size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--brand-primary, #2563EB)" }} />
          </div>
        </div>

        {/* 2. STATE (Hierarchical Filter 1) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            1. State (India)
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                background: isDark ? "#0F172A" : "#F8FAFC",
                color: "var(--text-primary)",
                fontSize: "0.90rem",
                fontWeight: 700,
                outline: "none",
                cursor: "pointer"
              }}
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. DISTRICT (Hierarchical Filter 2) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            2. District
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
                background: isDark ? "#0F172A" : "#F8FAFC",
                color: "var(--text-primary)",
                fontSize: "0.90rem",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="All">All Districts in {selectedState}</option>
              {districts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. DESTINATION (Hierarchical Filter 3) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            3. Destination
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--brand-primary, #2563EB)",
                background: isDark ? "#0F172A" : "#F8FAFC",
                color: "var(--text-primary)",
                fontSize: "0.92rem",
                fontWeight: 800,
                outline: "none",
                cursor: "pointer"
              }}
            >
              {matchingDestinations.map((dst) => (
                <option key={dst.id} value={dst.name}>
                  {dst.name} ({dst.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Filter Specs: Date, Travellers, Budget, Mode */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
          paddingTop: "14px",
          borderTop: "1px solid var(--border-subtle)"
        }}
      >
        {/* Travel Date */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Travel Date
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
                color: "var(--text-primary)",
                fontSize: "0.88rem",
                fontWeight: 600
              }}
            />
            <Calendar size={15} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          </div>
        </div>

        {/* Travellers Count */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Travellers
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px 10px 36px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: isDark ? "#0F172A" : "#F8FAFC",
                color: "var(--text-primary)",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num} Person{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <Users size={15} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          </div>
        </div>

        {/* Budget Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 700 }}>
            <span style={{ color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Budget</span>
            <span style={{ color: "#16A34A" }}>₹{budget.toLocaleString("en-IN")}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="30000"
            step="500"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--brand-primary, #2563EB)",
              marginTop: "8px",
              cursor: "pointer"
            }}
          />
        </div>
      </div>

      {/* Travel Mode Pills Strip */}
      <div>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
          Preferred Travel Mode
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {travelModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = travelMode === mode.id;

            return (
              <button
                type="button"
                key={mode.id}
                onClick={() => setTravelMode(mode.id)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid",
                  borderColor: isSelected
                    ? "var(--brand-primary, #2563EB)"
                    : "var(--border-subtle)",
                  background: isSelected
                    ? "var(--brand-primary, #2563EB)"
                    : (isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"),
                  color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: "0.80rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                <Icon size={14} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary CTA: "Plan My Journey" */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "6px" }}>
        <button
          type="submit"
          style={{
            padding: "14px 34px",
            borderRadius: "var(--radius-xl)",
            border: "none",
            background: "var(--brand-primary, #2563EB)",
            color: "#FFFFFF",
            fontFamily: "var(--font-heading)",
            fontSize: "1.05rem",
            fontWeight: 800,
            letterSpacing: "0.02em",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 6px 20px rgba(37,99,235,0.4)",
            cursor: "pointer",
            transition: "all var(--transition-fast)"
          }}
        >
          <span>Plan My Journey</span>
          <ArrowRight size={19} />
        </button>
      </div>
    </form>
  );
};
