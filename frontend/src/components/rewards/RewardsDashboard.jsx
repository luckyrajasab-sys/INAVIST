import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Gift,
  Ticket,
  Building,
  Compass,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  Info
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useRewards } from "../../context/RewardsContext";

export const RewardsDashboard = ({ onNavigateTab }) => {
  const { isDark } = useTheme();
  const {
    totalPoints,
    membershipTier,
    tierPointsProgress,
    nextTierThreshold,
    transactions,
    activeCoupons,
    availableCoupons,
    redeemCoupon
  } = useRewards();

  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState(null);
  const [redeemError, setRedeemError] = useState(null);

  const progressPercent = Math.min(100, Math.round((tierPointsProgress / (nextTierThreshold || 5000)) * 100));

  const handleRedeem = async (couponCode) => {
    setRedeemSuccessMsg(null);
    setRedeemError(null);
    try {
      const res = await redeemCoupon(couponCode);
      if (res.success) {
        setRedeemSuccessMsg(res.message);
        setTimeout(() => setRedeemSuccessMsg(null), 4000);
      }
    } catch (err) {
      setRedeemError(err.message || "Failed to redeem reward.");
      setTimeout(() => setRedeemError(null), 4000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        padding: "16px 24px 80px",
        maxWidth: "1240px",
        margin: "0 auto",
        width: "100%"
      }}
    >
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-2xl, 24px)",
          padding: "32px",
          background: isDark
            ? "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(124, 58, 237, 0.25) 100%)"
            : "linear-gradient(135deg, rgba(239, 246, 255, 0.98) 0%, rgba(243, 232, 255, 0.98) 100%)",
          border: "2px solid rgba(37, 99, 235, 0.35)",
          boxShadow: "0 20px 45px -10px rgba(37, 99, 235, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "600px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              borderRadius: "var(--radius-full, 9999px)",
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
              color: "#FFFFFF",
              fontSize: "0.76rem",
              fontWeight: 800,
              width: "fit-content"
            }}
          >
            <Sparkles size={13} />
            <span>INAVIST TRAVEL LOYALTY REWARDS</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 900,
              color: "var(--text-primary)",
              margin: 0,
              letterSpacing: "-0.02em"
            }}
          >
            Earn on every journey. Save on your next trip.
          </h1>

          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
            Earn 5% to 10% points on every verified IRCTC train, RTC bus, domestic flight, and outstation cab booking. Redeem for instant travel vouchers and hotel discounts.
          </p>
        </div>

        {/* Total Points Big Display */}
        <div
          style={{
            padding: "24px 32px",
            borderRadius: "var(--radius-xl, 20px)",
            background: isDark ? "rgba(0,0,0,0.4)" : "#FFFFFF",
            border: "1.5px solid var(--border-subtle)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            textAlign: "center",
            minWidth: "240px"
          }}
        >
          <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Your Available Balance
          </span>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.8rem",
              fontWeight: 900,
              color: "#2563EB",
              lineHeight: 1.1,
              margin: "6px 0"
            }}
          >
            {totalPoints.toLocaleString("en-IN")}
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)" }}>
            INAVIST Points
          </span>
        </div>
      </div>

      {/* Tier Status Card */}
      <div
        className="glass-card"
        style={{
          borderRadius: "var(--radius-xl, 18px)",
          padding: "22px 26px",
          border: "1.5px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(100, 116, 139, 0.4)"
              }}
            >
              <Award size={24} />
            </div>

            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-primary)" }}>
                {membershipTier}
              </div>
              <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                Enjoy +10% bonus points on all bookings & priority customer assistance
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {tierPointsProgress.toLocaleString("en-IN")} / {(nextTierThreshold || 5000).toLocaleString("en-IN")} Points
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {Math.max(0, (nextTierThreshold || 5000) - tierPointsProgress)} points to Gold Voyager
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "var(--bg-tertiary)", overflow: "hidden" }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
              borderRadius: "4px",
              transition: "width 0.5s ease"
            }}
          />
        </div>
      </div>

      {/* Redemption Messages */}
      {redeemSuccessMsg && (
        <div
          style={{
            padding: "12px 18px",
            borderRadius: "var(--radius-lg, 12px)",
            background: "rgba(22, 163, 74, 0.15)",
            border: "1.5px solid rgba(22, 163, 74, 0.4)",
            color: "#16A34A",
            fontSize: "0.88rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <CheckCircle2 size={18} />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {redeemError && (
        <div
          style={{
            padding: "12px 18px",
            borderRadius: "var(--radius-lg, 12px)",
            background: "rgba(220, 38, 38, 0.12)",
            border: "1.5px solid rgba(220, 38, 38, 0.35)",
            color: "#DC2626",
            fontSize: "0.88rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>{redeemError}</span>
        </div>
      )}

      {/* Available Rewards Catalog */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Redeem Your Points
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
            Instant redemption vouchers valid on your next bookings
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px"
          }}
        >
          {availableCoupons.map((coupon) => {
            const canAfford = totalPoints >= coupon.pointsCost;
            return (
              <div
                key={coupon.code}
                className="glass-card"
                style={{
                  borderRadius: "var(--radius-xl, 18px)",
                  padding: "20px",
                  border: "1.5px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  background: isDark ? "rgba(0,0,0,0.25)" : "#FFFFFF"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full, 9999px)",
                      background: "rgba(37, 99, 235, 0.12)",
                      color: "#2563EB",
                      fontSize: "0.72rem",
                      fontWeight: 800
                    }}
                  >
                    {coupon.pointsCost} Points
                  </div>

                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16A34A" }}>
                    Save ₹{coupon.discountValue}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    {coupon.title}
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "4px 0 0", lineHeight: 1.4 }}>
                    {coupon.description}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => handleRedeem(coupon.code)}
                  style={{
                    marginTop: "auto",
                    padding: "10px",
                    borderRadius: "var(--radius-lg, 12px)",
                    border: "none",
                    background: canAfford ? "var(--brand-primary, #2563EB)" : "var(--bg-tertiary)",
                    color: canAfford ? "#FFFFFF" : "var(--text-muted)",
                    fontWeight: 800,
                    fontSize: "0.84rem",
                    cursor: canAfford ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <Gift size={15} />
                  <span>{canAfford ? `Redeem for ${coupon.pointsCost} Pts` : `Need ${coupon.pointsCost - totalPoints} more pts`}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History Ledger */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Points History & Ledger
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "2px 0 0" }}>
            Track all points earned from payments and redemptions
          </p>
        </div>

        <div
          className="glass-card"
          style={{
            borderRadius: "var(--radius-xl, 18px)",
            padding: "8px 16px",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {transactions.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.84rem" }}>
              No transactions yet. Complete your first travel booking to earn rewards!
            </div>
          ) : (
            transactions.map((t, idx) => {
              const isEarned = t.type === "EARNED" || t.points > 0;
              return (
                <div
                  key={t.id || idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 8px",
                    borderBottom: idx < transactions.length - 1 ? "1px solid var(--border-subtle)" : "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isEarned ? "rgba(22, 163, 74, 0.12)" : "rgba(220, 38, 38, 0.12)",
                        color: isEarned ? "#16A34A" : "#DC2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {isEarned ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>

                    <div>
                      <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        {t.description}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        {t.date} {t.expiryDate ? `• Valid until ${t.expiryDate}` : ""}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "1.05rem", fontWeight: 900, color: isEarned ? "#16A34A" : "#DC2626" }}>
                    {isEarned ? `+${t.points}` : t.points} Pts
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
