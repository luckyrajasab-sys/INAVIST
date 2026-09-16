import React, { useState, useMemo } from "react";
import {
  Wallet,
  IndianRupee,
  Users,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Calculator,
  PieChart
} from "lucide-react";
import { destinationsData } from "../../data/destinationsData";
import { DestinationCard } from "../common/DestinationCard";
import { useLanguage } from "../../context/LanguageContext";

export const WhereCanITravel = ({ onSelectDestination, onPlanTrip }) => {
  const { t } = useLanguage();

  // Mode: 'finder' (Where can I travel) vs 'calculator' (Detailed Trip Expense Calculator)
  const [activeTab, setActiveTab] = useState("finder");

  // Finder Inputs
  const [budget, setBudget] = useState(15000);
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(3);
  const [startCity, setStartCity] = useState("");
  const [transportChoice, setTransportChoice] = useState("train"); // 'train' | 'flight' | 'bus' | 'cab'

  // Calculator Inputs
  const [calcTransport, setCalcTransport] = useState(3500);
  const [calcStay, setCalcStay] = useState(4800);
  const [calcFood, setCalcFood] = useState(3000);
  const [calcTickets, setCalcTickets] = useState(800);
  const [calcActivities, setCalcActivities] = useState(1500);
  const [calcLocal, setCalcLocal] = useState(1200);
  const [calcShopping, setCalcShopping] = useState(2000);
  const [calcOther, setCalcOther] = useState(1000);
  const [calcTotalBudget, setCalcTotalBudget] = useState(20000);
  const [calcPeople, setCalcPeople] = useState(2);

  // Recommendations calculation for Finder
  const categorizedDestinations = useMemo(() => {
    let transportMultiplier = 1;
    if (transportChoice === "flight") transportMultiplier = 2.4;
    else if (transportChoice === "cab") transportMultiplier = 1.6;
    else if (transportChoice === "train") transportMultiplier = 1.0;
    else if (transportChoice === "bus") transportMultiplier = 0.8;

    return destinationsData.map((dest) => {
      const stayTotal = dest.estimatedCosts.stay * days;
      const foodTotal = dest.estimatedCosts.food * days * people;
      const transportTotal = dest.estimatedCosts.travel * transportMultiplier * people;
      const entryTotal = (dest.estimatedCosts.entry + dest.estimatedCosts.activities) * people;

      const totalCost = Math.round(stayTotal + foodTotal + transportTotal + entryTotal);
      const diff = budget - totalCost;

      let category = "near";
      if (totalCost <= budget * 0.88) {
        category = "under"; // 🟢 Under Budget
      } else if (totalCost <= budget * 1.12) {
        category = "near"; // 🟡 Near Budget
      } else {
        category = "over"; // 🔴 Over Budget
      }

      return {
        ...dest,
        calculated: {
          stayTotal,
          foodTotal,
          transportTotal,
          entryTotal,
          totalCost,
          remainingBudget: diff,
          category
        }
      };
    });
  }, [budget, people, days, transportChoice]);

  const underBudgetList = categorizedDestinations.filter((d) => d.calculated.category === "under");
  const nearBudgetList = categorizedDestinations.filter((d) => d.calculated.category === "near");
  const overBudgetList = categorizedDestinations.filter((d) => d.calculated.category === "over");

  // Calculator totals
  const calcTotalSpent =
    calcTransport +
    calcStay +
    calcFood +
    calcTickets +
    calcActivities +
    calcLocal +
    calcShopping +
    calcOther;

  const calcRemaining = calcTotalBudget - calcTotalSpent;
  const calcPerPerson = Math.round(calcTotalSpent / (calcPeople || 1));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", padding: "24px 20px" }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: "36px 30px",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 107, 0, 0.08) 100%), var(--bg-card)",
          borderRadius: "var(--radius-xl)"
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#059669",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: 700,
              marginBottom: "10px"
            }}
          >
            <Wallet size={14} />
            <span>Transparent Reverse Budget Finder</span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "8px" }}>
            Where Can I Travel With My Budget?
          </h1>
          <p style={{ fontSize: "0.98rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Enter your budget and group size to unlock perfectly tailored Indian destinations
          </p>

          {/* Mode Switcher */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => setActiveTab("finder")}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: activeTab === "finder" ? "#10b981" : "var(--bg-tertiary)",
                color: activeTab === "finder" ? "#fff" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer"
              }}
            >
              Where Can I Travel? 🧭
            </button>

            <button
              onClick={() => setActiveTab("calculator")}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: activeTab === "calculator" ? "#10b981" : "var(--bg-tertiary)",
                color: activeTab === "calculator" ? "#fff" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer"
              }}
            >
              Trip Budget Calculator 🧮
            </button>
          </div>
        </div>
      </div>

      {activeTab === "finder" ? (
        <>
          {/* Controls Bar */}
          <div
            className="glass-panel"
            style={{
              padding: "24px",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "18px",
                alignItems: "center"
              }}
            >
              {/* Budget Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                    Total Budget:
                  </label>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--brand-primary)" }}>
                    ₹{budget.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="120000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--brand-primary)", cursor: "pointer" }}
                />
              </div>

              {/* Number of People */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                  Number of People: <strong>{people} {people === 1 ? "Traveller" : "Travellers"}</strong>
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPeople(num)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                        background: people === num ? "var(--brand-primary)" : "var(--bg-tertiary)",
                        color: people === num ? "#fff" : "var(--text-primary)",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration (Days) */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                  Duration: <strong>{days} Days</strong>
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[2, 3, 5, 7, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setDays(num)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                        background: days === num ? "#10b981" : "var(--bg-tertiary)",
                        color: days === num ? "#fff" : "var(--text-primary)",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {num}D
                    </button>
                  ))}
                </div>
              </div>

              {/* Transport Mode */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", display: "block" }}>
                  Transport Mode
                </label>
                <select
                  className="select-field"
                  value={transportChoice}
                  onChange={(e) => setTransportChoice(e.target.value)}
                >
                  <option value="train">Train / Vande Bharat (Balanced)</option>
                  <option value="bus">AC Volvo Bus (Pocket-friendly)</option>
                  <option value="flight">Flight (Fastest)</option>
                  <option value="cab">Outstation Cab (Comfort)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categorized Recommendations */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* 🟢 UNDER BUDGET */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <CheckCircle size={16} /> UNDER BUDGET ({underBudgetList.length})
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Fits comfortably within ₹{budget.toLocaleString("en-IN")} with savings left
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                  gap: "20px"
                }}
              >
                {underBudgetList.slice(0, 6).map((dest) => (
                  <div key={dest.id} style={{ display: "flex", flexDirection: "column" }}>
                    <DestinationCard destination={dest} onSelect={onSelectDestination} />
                    <div
                      style={{
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
                        padding: "10px 14px",
                        marginTop: "-8px",
                        fontSize: "0.82rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span>Est. Total: <strong>₹{dest.calculated.totalCost.toLocaleString("en-IN")}</strong></span>
                      <span style={{ color: "#10b981", fontWeight: 700 }}>
                        Save ₹{dest.calculated.remainingBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🟡 NEAR BUDGET */}
            {nearBudgetList.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span
                    style={{
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "#d97706",
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Clock size={16} /> NEAR BUDGET ({nearBudgetList.length})
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Close to your budget within ±12%
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                    gap: "20px"
                  }}
                >
                  {nearBudgetList.slice(0, 4).map((dest) => (
                    <div key={dest.id} style={{ display: "flex", flexDirection: "column" }}>
                      <DestinationCard destination={dest} onSelect={onSelectDestination} />
                      <div
                        style={{
                          background: "rgba(245, 158, 11, 0.1)",
                          border: "1px solid rgba(245, 158, 11, 0.25)",
                          borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
                          padding: "10px 14px",
                          marginTop: "-8px",
                          fontSize: "0.82rem",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span>Est. Total: <strong>₹{dest.calculated.totalCost.toLocaleString("en-IN")}</strong></span>
                        <span style={{ color: "#d97706", fontWeight: 700 }}>
                          {dest.calculated.remainingBudget >= 0
                            ? `+₹${dest.calculated.remainingBudget} left`
                            : `-₹${Math.abs(dest.calculated.remainingBudget)} over`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Detailed Budget Expense Calculator View */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {/* Categories Form */}
          <div
            className="glass-panel"
            style={{
              padding: "24px",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Expense Breakdown Categories (₹)
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Transportation (Flight/Train)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcTransport}
                  onChange={(e) => setCalcTransport(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Accommodation / Hotels
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcStay}
                  onChange={(e) => setCalcStay(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Food & Dining
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcFood}
                  onChange={(e) => setCalcFood(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Entry Tickets & Permits
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcTickets}
                  onChange={(e) => setCalcTickets(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Activities / Adventures
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcActivities}
                  onChange={(e) => setCalcActivities(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Local Taxis / Autos
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcLocal}
                  onChange={(e) => setCalcLocal(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Shopping & Souvenirs
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcShopping}
                  onChange={(e) => setCalcShopping(Number(e.target.value) || 0)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                  Emergency / Other
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={calcOther}
                  onChange={(e) => setCalcOther(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Total Target Budget (₹)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={calcTotalBudget}
                    onChange={(e) => setCalcTotalBudget(Number(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px", display: "block" }}>
                    Number of Travellers
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    value={calcPeople}
                    onChange={(e) => setCalcPeople(Number(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div
            className="glass-panel"
            style={{
              padding: "26px",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Budget Summary & Insights
            </h2>

            <div
              style={{
                background: calcRemaining >= 0 ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                border: `1px solid ${calcRemaining >= 0 ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                Total Estimated Cost
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                ₹{calcTotalSpent.toLocaleString("en-IN")}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: calcRemaining >= 0 ? "#10b981" : "#ef4444"
                }}
              >
                {calcRemaining >= 0
                  ? `🟢 ₹${calcRemaining.toLocaleString("en-IN")} under total budget`
                  : `🔴 Over budget by ₹${Math.abs(calcRemaining).toLocaleString("en-IN")}`}
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ background: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cost Per Person</div>
                <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--brand-primary)" }}>
                  ₹{calcPerPerson.toLocaleString("en-IN")}
                </div>
              </div>

              <div style={{ background: "var(--bg-tertiary)", padding: "14px", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Target Budget</div>
                <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>
                  ₹{calcTotalBudget.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Category percentage bars */}
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "10px" }}>
                Category Distribution
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem" }}>
                {[
                  { name: "Stay", amount: calcStay, color: "#ff6b00" },
                  { name: "Transport", amount: calcTransport, color: "#0ea5e9" },
                  { name: "Food", amount: calcFood, color: "#10b981" },
                  { name: "Activities & Tickets", amount: calcActivities + calcTickets, color: "#8b5cf6" },
                  { name: "Shopping & Misc", amount: calcShopping + calcLocal + calcOther, color: "#e11d48" }
                ].map((item, idx) => {
                  const pct = calcTotalSpent > 0 ? Math.round((item.amount / calcTotalSpent) * 100) : 0;
                  return (
                    <div key={idx}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span>{item.name}</span>
                        <span>₹{item.amount.toLocaleString("en-IN")} ({pct}%)</span>
                      </div>
                      <div style={{ width: "100%", height: "6px", background: "var(--bg-tertiary)", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: item.color, borderRadius: "99px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
