import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  AlertTriangle,
  CloudRain,
  Train,
  Clock,
  Wallet,
  Compass,
  ArrowRight,
  CheckCircle2,
  X,
  RotateCcw
} from "lucide-react";
import { api } from "../../api/client";
import { usePlanner } from "../../context/PlannerContext";

export const ModifyTripModal = ({ currentTrip, isOpen, onClose, onPlanUpdated }) => {
  const { showToast } = usePlanner();

  const [selectedCrisis, setSelectedCrisis] = useState("rain");
  const [customText, setCustomText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modificationResult, setModificationResult] = useState(null);

  if (!isOpen || !currentTrip) return null;

  const crisisScenarios = [
    { id: "rain", label: "It is raining heavily 🌧️", icon: CloudRain, desc: "Swap outdoor hikes with cultural museums & covered havelis" },
    { id: "train-cancelled", label: "My train is cancelled 🚆", icon: Train, desc: "Reroute to overnight AC Volvo sleeper with on-time arrival" },
    { id: "transport-delayed", label: "My bus/cab is delayed ⏳", icon: Clock, desc: "Rebalance today's schedule and shift morning trek" },
    { id: "budget-reduced", label: "My budget changed (-₹6,000) 💰", icon: Wallet, desc: "Swap to verified eco-homestay & budget transit" },
    { id: "destination-closed", label: "Monument / Viewpoint closed 🛑", icon: AlertTriangle, desc: "Redirect to nearby UNESCO stepwells & secret valley" },
    { id: "extend-trip", label: "I want to extend trip by 1 day ➕", icon: Compass, desc: "Add offbeat hidden waterfall trek & homestay night" }
  ];

  const handleApplyModification = async (e) => {
    e?.preventDefault();
    setIsProcessing(true);

    try {
      const res = await api.trips.modifyCrisis(currentTrip, selectedCrisis, customText);
      if (res.success) {
        setModificationResult(res);
        confetti({ particleCount: 40, spread: 50 });
        showToast("Itinerary updated and budget recalculated! ⚡");
      }
    } catch (err) {
      console.error(err);
      showToast("Error adapting itinerary", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptChanges = () => {
    if (modificationResult?.modifiedPlan) {
      onPlanUpdated(modificationResult.modifiedPlan);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "var(--bg-card-solid)",
          padding: "32px",
          borderRadius: "var(--radius-xl)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-ghost"
          style={{ position: "absolute", top: "14px", right: "14px", padding: "6px", borderRadius: "50%" }}
        >
          <X size={18} />
        </button>

        {!modificationResult ? (
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(249, 115, 22, 0.12)",
                color: "var(--brand-primary)",
                padding: "4px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "8px"
              }}
            >
              <Sparkles size={14} />
              <span>AI Dynamic Crisis Re-Planner</span>
            </div>

            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>
              Modify My Trip in Real Time
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Encountered a weather delay, cancelled train, or change of budget? Select your disruption scenario and YĀTRI will recalculate alternatives instantly.
            </p>

            {/* Scenario Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px", marginBottom: "20px" }}>
              {crisisScenarios.map((sc) => {
                const Icon = sc.icon;
                const isSelected = selectedCrisis === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedCrisis(sc.id)}
                    style={{
                      padding: "14px",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--brand-primary)" : "var(--border-subtle)",
                      background: isSelected ? "rgba(249, 115, 22, 0.08)" : "var(--bg-tertiary)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.92rem", color: isSelected ? "var(--brand-primary)" : "var(--text-primary)" }}>
                      <Icon size={18} />
                      <span>{sc.label}</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
                      {sc.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                Or Describe Custom Situation
              </label>
              <input
                type="text"
                className="input-field"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Want to replace shopping on Day 3 with river rafting..."
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleApplyModification}
              disabled={isProcessing}
              style={{ width: "100%", padding: "14px", fontSize: "0.98rem" }}
            >
              {isProcessing ? (
                <span className="animate-pulse">Recalculating Itinerary & Budget...</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Adapt My Itinerary Now</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Crisis Adaptation Results Showcase */
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10b981", fontWeight: 800, fontSize: "1.1rem" }}>
              <CheckCircle2 size={24} />
              <span>Smart Adaptation Ready!</span>
            </div>

            {/* Visual Transformation Pathway */}
            <div
              style={{
                background: "var(--bg-tertiary)",
                borderRadius: "var(--radius-lg)",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                border: "1px solid var(--border-subtle)"
              }}
            >
              <div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#ef4444", textTransform: "uppercase" }}>
                  1. Disruption Identified
                </span>
                <div style={{ fontWeight: 600, fontSize: "0.92rem", marginTop: "2px" }}>
                  {modificationResult.problemDescription}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0E7490", textTransform: "uppercase" }}>
                  2. Suggested AI Alternative
                </span>
                <div style={{ fontWeight: 600, fontSize: "0.92rem", marginTop: "2px" }}>
                  {modificationResult.solutionDescription}
                </div>
              </div>

              {/* Cost Delta Indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "10px",
                  fontSize: "0.92rem"
                }}
              >
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Original: </span>
                  <strong>₹{modificationResult.originalCost?.toLocaleString("en-IN")}</strong>
                </div>

                <div style={{ color: modificationResult.costDelta <= 0 ? "#10b981" : "#d97706", fontWeight: 800 }}>
                  {modificationResult.costDelta < 0 ? `Saved ₹${Math.abs(modificationResult.costDelta)}` : modificationResult.costDelta > 0 ? `+₹${modificationResult.costDelta} Delta` : "No Cost Change"}
                </div>

                <div>
                  <span style={{ color: "var(--text-muted)" }}>New Total: </span>
                  <strong style={{ color: "var(--brand-primary)", fontSize: "1.1rem" }}>
                    ₹{modificationResult.newCost?.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-primary"
                onClick={handleAcceptChanges}
                style={{ flex: 1, padding: "12px" }}
              >
                <CheckCircle2 size={18} />
                <span>Confirm & Update My Plan</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => setModificationResult(null)}
                style={{ padding: "12px 18px" }}
              >
                <RotateCcw size={16} />
                <span>Try Another</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
