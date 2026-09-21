import { getAuthToken } from "../api/client.js";

const API_BASE = import.meta.env?.VITE_API_URL || "/api";

export class RewardService {
  /**
   * Get Rewards Summary from API with localStorage fallback
   */
  static async getRewardsSummary() {
    if (import.meta.env?.VITE_API_URL) {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE}/rewards`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            return json.data;
          }
        }
      } catch (err) {
        // Fallback to local rewards store
      }
    }


    const localData = localStorage.getItem("inavist_rewards_data");
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {
        // ignore
      }
    }

    const defaultSummary = {
      totalPoints: 2450,
      lifetimePointsEarned: 3200,
      pointsRedeemed: 750,
      membershipTier: "Silver Traveller",
      tierPointsProgress: 2450,
      nextTierThreshold: 5000,
      transactions: [
        {
          id: "TXN-INIT-1",
          type: "EARNED",
          points: 200,
          description: "Earned on Booking #INV-891024 to Chennai (Train)",
          date: "2026-08-15"
        },
        {
          id: "TXN-INIT-2",
          type: "EARNED",
          points: 450,
          description: "Earned on Booking #INV-412891 to Goa (Flight)",
          date: "2026-07-28"
        },
        {
          id: "TXN-INIT-3",
          type: "REDEEMED",
          points: -500,
          description: "Redeemed for ₹100 Travel Discount Voucher (TRAVEL100)",
          date: "2026-06-14"
        }
      ],
      activeCoupons: [],
      availableCoupons: [
        {
          code: "TRAVEL100",
          title: "₹100 Instant Travel Discount",
          discountValue: 100,
          pointsCost: 500,
          category: "travel",
          description: "Valid across all Train, Bus, Flight and Cab bookings on INAVIST.",
          icon: "Ticket"
        },
        {
          code: "HOTEL250",
          title: "₹250 Luxury Hotel Stay Discount",
          discountValue: 250,
          pointsCost: 1000,
          category: "hotel",
          description: "Valid on verified 3-Star, 4-Star & Heritage resorts across India.",
          icon: "Building"
        },
        {
          code: "PKG750",
          title: "₹750 Travel Package Discount",
          discountValue: 750,
          pointsCost: 2500,
          category: "package",
          description: "Flat ₹750 off on curated Indian holiday and adventure tour packages.",
          icon: "Compass"
        },
        {
          code: "LOUNGEPASS",
          title: "Airport & IRCTC VIP Lounge Access",
          discountValue: 600,
          pointsCost: 1800,
          category: "lounge",
          description: "Complimentary access to domestic airport lounges and IRCTC Executive rail lounges.",
          icon: "ShieldCheck"
        },
        {
          code: "FOOD200",
          title: "₹200 Highway & Station Food Voucher",
          discountValue: 200,
          pointsCost: 800,
          category: "food",
          description: "Redeemable at food plazas, pantry cars, and verified highway dhabas.",
          icon: "Sparkles"
        }
      ]
    };

    localStorage.setItem("inavist_rewards_data", JSON.stringify(defaultSummary));
    return defaultSummary;
  }

  /**
   * Redeem a Coupon
   */
  static async redeemCoupon(couponCode) {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}/rewards/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ couponCode })
      });


      if (response.ok) {
        const json = await response.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Using offline coupon redemption handler:", err.message);
    }

    const current = await this.getRewardsSummary();
    const coupon = current.availableCoupons.find((c) => c.code === couponCode);

    if (!coupon) {
      throw new Error("Invalid reward coupon code.");
    }

    if (current.totalPoints < coupon.pointsCost) {
      throw new Error(`Insufficient points! You need ${coupon.pointsCost} points, but currently have ${current.totalPoints}.`);
    }

    current.totalPoints -= coupon.pointsCost;
    current.pointsRedeemed += coupon.pointsCost;

    const redeemedItem = {
      code: `${coupon.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: coupon.title,
      discountValue: coupon.discountValue,
      pointsCost: coupon.pointsCost,
      category: coupon.category,
      description: coupon.description,
      isRedeemed: true,
      redeemedAt: new Date().toISOString()
    };

    current.activeCoupons.unshift(redeemedItem);
    current.transactions.unshift({
      id: `TXN-${Date.now()}`,
      type: "REDEEMED",
      points: -coupon.pointsCost,
      description: `Redeemed for ${coupon.title} (${redeemedItem.code})`,
      date: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("inavist_rewards_data", JSON.stringify(current));

    return {
      success: true,
      redeemedCoupon: redeemedItem,
      remainingPoints: current.totalPoints,
      message: `Successfully redeemed ${coupon.pointsCost} points for ${coupon.title}!`
    };
  }

  /**
   * Credit Points Locally
   */
  static async creditPoints({ points = 200, bookingId = "INV-000", description = "Travel Booking" }) {
    const current = await this.getRewardsSummary();
    current.totalPoints += points;
    current.lifetimePointsEarned += points;

    if (current.lifetimePointsEarned >= 15000) {
      current.membershipTier = "Platinum Elite";
      current.nextTierThreshold = null;
    } else if (current.lifetimePointsEarned >= 5000) {
      current.membershipTier = "Gold Voyager";
      current.nextTierThreshold = 15000;
    } else if (current.lifetimePointsEarned >= 1500) {
      current.membershipTier = "Silver Traveller";
      current.nextTierThreshold = 5000;
    }

    current.tierPointsProgress = current.totalPoints;

    current.transactions.unshift({
      id: `TXN-${Date.now()}`,
      type: "EARNED",
      points,
      description: description || `Earned on Booking #${bookingId}`,
      date: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("inavist_rewards_data", JSON.stringify(current));
    return current;
  }
}
