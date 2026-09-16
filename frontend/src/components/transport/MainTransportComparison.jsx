import React, { useState, useMemo, useEffect } from "react";
import {
  Bus,
  Train,
  Plane,
  Car,
  Bike,
  Clock,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap,
  Info,
  SlidersHorizontal,
  ArrowDownUp,
  MapPin,
  Fuel,
  Receipt,
  Layers,
  TableProperties,
  LayoutGrid
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { RouteService } from "../../services/RouteService";
import { TransportOptionService } from "../../services/TransportOptionService";
import { TransportOptionCard } from "./TransportOptionCard";
import { TransportComparisonMatrix } from "./TransportComparisonMatrix";
import { TransportOptionCardSkeleton } from "../common/SkeletonLoader";

export const MainTransportComparison = ({
  mainOptions = {},
  selectedMode = "train",
  onSelectMode,
  selectedOption = null,
  onSelectOption,
  fromCity = "Chennai",
  toDestination = "Kodaikanal",
  travelDate = new Date().toISOString().split("T")[0],
  passengers = 1
}) => {
  const { isDark } = useTheme();

  // Active view mode filter: 'train' | 'bus' | 'flight' | 'cab' | 'car' | 'bike' | 'all'
  const [currentMode, setCurrentMode] = useState(selectedMode || "train");
  const [isModeLoading, setIsModeLoading] = useState(false);

  // Sorting: 'best_overall' | 'price_low_high' | 'price_high_low' | 'fastest' | 'best_rated'
  const [sortBy, setSortBy] = useState("best_overall");

  // View style: 'cards' | 'matrix' | 'both'
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  // Active chosen option ID
  const [activeOptionId, setActiveOptionId] = useState(selectedOption?.id || null);

  // Sync mode changes from props
  useEffect(() => {
    if (selectedMode && selectedMode !== "all") {
      setCurrentMode(selectedMode);
    }
  }, [selectedMode]);

  // Generate 4 Curated Options for current active mode
  const modeOptions = useMemo(() => {
    if (currentMode === "all") return [];
    return TransportOptionService.getModeOptions({
      mode: currentMode,
      fromCity,
      toDestination,
      passengers,
      travelDate
    });
  }, [currentMode, fromCity, toDestination, passengers, travelDate]);

  // Set default selection when mode options change if none selected
  useEffect(() => {
    if (modeOptions.length > 0) {
      const match = modeOptions.find((o) => o.id === activeOptionId);
      if (!match) {
        const defaultOpt = modeOptions.find((o) => o.tierType === "best_value") || modeOptions[0];
        setActiveOptionId(defaultOpt?.id);
        if (onSelectOption) {
          onSelectOption(defaultOpt);
        }
      }
    }
  }, [modeOptions]);

  const handleSelectMode = (modeId) => {
    setIsModeLoading(true);
    setCurrentMode(modeId);
    if (onSelectMode) {
      onSelectMode(modeId);
    }
    setTimeout(() => {
      setIsModeLoading(false);
    }, 280);
  };

  // Sort options
  const sortedOptions = useMemo(() => {
    return TransportOptionService.sortOptions(modeOptions, sortBy);
  }, [modeOptions, sortBy]);

  const handleSelectOption = (opt) => {
    setActiveOptionId(opt.id);
    if (onSelectOption) {
      onSelectOption(opt);
    }
    if (onSelectMode && opt.mode) {
      onSelectMode(opt.mode);
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "bus":
        return <Bus size={18} />;
      case "train":
        return <Train size={18} />;
      case "flight":
        return <Plane size={18} />;
      case "cab":
      case "car":
        return <Car size={18} />;
      case "bike":
        return <Bike size={18} />;
      default:
        return <Train size={18} />;
    }
  };

  const modeFilterTabs = [
    { id: "train", label: "Train", icon: Train },
    { id: "bus", label: "Bus", icon: Bus },
    { id: "flight", label: "Flight", icon: Plane },
    { id: "cab", label: "Cab", icon: Car },
    { id: "car", label: "Car (Self-Drive)", icon: Car },
    { id: "bike", label: "Bike", icon: Bike },
    { id: "all", label: "All Modes Overview", icon: Layers }
  ];

  const sortOptions = [
    { id: "best_overall", label: "Best Overall" },
    { id: "price_low_high", label: "Price: Low → High" },
    { id: "price_high_low", label: "Price: High → Low" },
    { id: "fastest", label: "Fastest" },
    { id: "best_rated", label: "Best Rated" }
  ];

  const currentModeTitle = modeFilterTabs.find((m) => m.id === currentMode)?.label || "Train";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Top Header Banner with Route indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--brand-primary, #2563EB)", fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
            <Sparkles size={14} />
            <span>4 Best Available Options per Mode</span>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.35rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: "3px"
            }}
          >
            {fromCity} → {toDestination} Transportation
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
            Showing 4 distinct curated options (<strong>Cheapest</strong>, <strong>Fastest</strong>, <strong>Best Value</strong>, and <strong>Premium</strong>) for {currentModeTitle}.
          </p>
        </div>

        {/* Disclaimer Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.76rem",
            color: "var(--text-muted)",
            padding: "6px 12px",
            borderRadius: "var(--radius-full, 9999px)",
            background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9",
            border: "1px solid var(--border-subtle, rgba(0,0,0,0.08))"
          }}
        >
          <Info size={13} style={{ color: "var(--brand-primary, #2563EB)", flexShrink: 0 }} />
          <span>All fares & durations clearly marked as <strong>Estimated</strong></span>
        </div>
      </div>

      {/* Mode Selector Navigation Pills Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          borderBottom: "1px solid var(--border-subtle, rgba(0,0,0,0.08))"
        }}
      >
        {modeFilterTabs.map((tab) => {
          const Icon = tab.icon;
          const isTabActive = currentMode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectMode(tab.id)}
              style={{
                padding: "9px 16px",
                borderRadius: "var(--radius-full, 9999px)",
                border: "1px solid",
                borderColor: isTabActive ? "var(--brand-primary, #2563EB)" : "var(--border-subtle, rgba(0,0,0,0.1))",
                background: isTabActive ? "var(--brand-primary, #2563EB)" : (isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF"),
                color: isTabActive ? "#FFFFFF" : "var(--text-secondary)",
                fontWeight: isTabActive ? 800 : 600,
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: isTabActive ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Bar: Sorting Controls & Side-by-Side Comparison Toggle */}
      {currentMode !== "all" && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            padding: "12px 18px",
            borderRadius: "var(--radius-xl, 14px)",
            background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC",
            border: "1px solid var(--border-subtle, rgba(0,0,0,0.08))"
          }}
        >
          {/* Sorting Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <ArrowDownUp size={15} style={{ color: "var(--brand-primary, #2563EB)" }} />
            <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Sort Options:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSortBy(opt.id)}
                    style={{
                      padding: "5px 11px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
                      background: isSelected ? (isDark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.1)") : "transparent",
                      color: isSelected ? "var(--brand-primary, #2563EB)" : "var(--text-secondary)",
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: "0.76rem",
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Side-by-Side Comparison Matrix */}
          <button
            type="button"
            onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: showComparisonMatrix ? "var(--brand-primary, #2563EB)" : "var(--border-subtle)",
              background: showComparisonMatrix ? "var(--brand-primary, #2563EB)" : (isDark ? "rgba(255,255,255,0.05)" : "#FFFFFF"),
              color: showComparisonMatrix ? "#FFFFFF" : "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.78rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              boxShadow: showComparisonMatrix ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            {showComparisonMatrix ? <LayoutGrid size={14} /> : <TableProperties size={14} />}
            <span>{showComparisonMatrix ? "Show Cards Grid" : "Compare Side by Side"}</span>
          </button>
        </div>
      )}

      {/* DISPLAY 1: 4 Curated Mode Options Grid */}
      {currentMode !== "all" && !showComparisonMatrix && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "18px"
          }}
        >
          {sortedOptions.map((opt, idx) => (
            <TransportOptionCard
              key={opt.id}
              option={opt}
              optionNumber={idx + 1}
              isSelected={activeOptionId === opt.id}
              onSelect={handleSelectOption}
            />
          ))}
        </div>
      )}

      {/* DISPLAY 2: Side-by-Side Comparison Matrix */}
      {currentMode !== "all" && showComparisonMatrix && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <TransportComparisonMatrix
            options={sortedOptions}
            selectedOptionId={activeOptionId}
            onSelectOption={handleSelectOption}
            modeTitle={currentModeTitle}
          />

          {/* Also render compact cards below matrix for detailed class breakdown */}
          <div>
            <h5 style={{ fontSize: "0.90rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.04em" }}>
              Detailed Option Cards:
            </h5>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "18px"
              }}
            >
              {isModeLoading ? (
                <>
                  <TransportOptionCardSkeleton />
                  <TransportOptionCardSkeleton />
                  <TransportOptionCardSkeleton />
                  <TransportOptionCardSkeleton />
                </>
              ) : (
                sortedOptions.map((opt, idx) => (
                  <TransportOptionCard
                    key={opt.id}
                    option={opt}
                    optionNumber={idx + 1}
                    isSelected={activeOptionId === opt.id}
                    onSelect={handleSelectOption}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* DISPLAY 3: All Modes Overview (Summary mode switcher) */}
      {currentMode === "all" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px"
          }}
        >
          {["train", "bus", "flight", "cab", "car", "bike"].map((mKey) => {
            const rawOpts = TransportOptionService.getModeOptions({
              mode: mKey,
              fromCity,
              toDestination,
              passengers,
              travelDate
            });
            const bestValue = rawOpts.find((o) => o.tierType === "best_value") || rawOpts[0];
            const cheapest = rawOpts.find((o) => o.tierType === "cheapest") || rawOpts[0];
            const fastest = rawOpts.find((o) => o.tierType === "fastest") || rawOpts[0];

            return (
              <div
                key={mKey}
                onClick={() => handleSelectMode(mKey)}
                style={{
                  padding: "22px",
                  borderRadius: "var(--radius-2xl, 18px)",
                  background: isDark ? "rgba(15,23,42,0.6)" : "#FFFFFF",
                  border: "1.5px solid var(--border-subtle, rgba(0,0,0,0.08))",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "14px",
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(37,99,235,0.12)",
                        color: "var(--brand-primary, #2563EB)"
                      }}
                    >
                      {getModeIcon(mKey)}
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--brand-primary, #2563EB)", textTransform: "uppercase" }}>
                      4 Options Available
                    </span>
                  </div>

                  <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                    {mKey.toUpperCase()}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    Compare Cheapest (<strong>₹{cheapest?.price?.toLocaleString("en-IN")}</strong>), Fastest (<strong>{fastest?.duration}</strong>), Best Value & Premium.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "10px", borderRadius: "10px", background: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC", fontSize: "0.75rem" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Best Value:</span>
                      <strong style={{ color: "#16A34A" }}>₹{bestValue?.price?.toLocaleString("en-IN")}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Fastest Time:</span>
                      <strong style={{ color: "var(--text-primary)" }}>{fastest?.duration}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectMode(mKey)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "var(--brand-primary, #2563EB)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span>View 4 {mKey.toUpperCase()} Options</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
