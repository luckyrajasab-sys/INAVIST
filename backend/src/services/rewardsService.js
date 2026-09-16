import { Reward } from "../models/Reward.js";

/**
 * RewardsService
 * Calculates reward points earned from verified travel payments,
 * manages membership tiers, points redemption, and audit transactions.
 */
export class RewardsService {
  /**
   * Multiplier per transport type
   * Flights: 8% (8 pts per ₹100)
   * Trains: 5% (5 pts per ₹100)
   * Buses: 6% (6 pts per ₹100)
   * Cabs: 5% (5 pts per ₹100)
   * Multi-Modal / Packages: 10% (10 pts per ₹100)
   */
  static getMultiplier(type = "train") {
    switch (type.toLowerCase()) {
      case "flight":
        return 0.08;
      case "train":
        return 0.05;
      case "bus":
        return 0.06;
      case "cab":
        return 0.05;
      case "multi_modal":
      case "package":
        return 0.10;
      default:
        return 0.05;
    }
  }

  /**
   * Tier bonus multiplier
   */
  static getTierMultiplier(tier = "Silver Traveller") {
    switch (tier) {
      case "Platinum Elite":
        return 1.5; // +50% bonus points
      case "Gold Voyager":
        return 1.25; // +25% bonus points
      case "Silver Traveller":
        return 1.1; // +10% bonus points
      case "Bronze Explorer":
      default:
        return 1.0;
    }
  }

  /**
   * Calculate Points Earned from a verified booking payment
   */
  static calculatePointsEarned({ amount = 0, transportType = "train", tier = "Silver Traveller" }) {
    const baseMultiplier = this.getMultiplier(transportType);
    const tierBonus = this.getTierMultiplier(tier);
    const points = Math.max(25, Math.round(amount * baseMultiplier * tierBonus));
    return points;
  }

  /**
   * Determine Tier from points
   */
  static evaluateTier(lifetimePoints) {
    if (lifetimePoints >= 15000) return { tier: "Platinum Elite", nextThreshold: null };
    if (lifetimePoints >= 5000) return { tier: "Gold Voyager", nextThreshold: 15000 };
    if (lifetimePoints >= 1500) return { tier: "Silver Traveller", nextThreshold: 5000 };
    return { tier: "Bronze Explorer", nextThreshold: 1500 };
  }

  /**
   * Credit Points on Verified Booking Payment
   */
  static async creditBookingRewards({ userId, bookingId, amount, transportType, destination }) {
    let rewardDoc = await Reward.findOne({ userId });

    if (!rewardDoc) {
      rewardDoc = new Reward({
        userId,
        totalPoints: 2450,
        lifetimePointsEarned: 3200,
        pointsRedeemed: 750,
        membershipTier: "Silver Traveller"
      });
    }

    const earned = this.calculatePointsEarned({
      amount,
      transportType,
      tier: rewardDoc.membershipTier
    });

    rewardDoc.totalPoints += earned;
    rewardDoc.lifetimePointsEarned += earned;

    const { tier, nextThreshold } = this.evaluateTier(rewardDoc.lifetimePointsEarned);
    rewardDoc.membershipTier = tier;
    rewardDoc.tierPointsProgress = rewardDoc.totalPoints;
    rewardDoc.nextTierThreshold = nextThreshold || 25000;

    const transaction = {
      id: `TXN-${Date.now()}`,
      type: "EARNED",
      points: earned,
      description: `Earned on Booking #${bookingId} to ${destination || "India Destination"} (${transportType.toUpperCase()})`,
      bookingId,
      date: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0] // 1 year validity
    };

    rewardDoc.transactions.unshift(transaction);
    await rewardDoc.save();

    return {
      pointsEarned: earned,
      totalBalance: rewardDoc.totalPoints,
      currentTier: rewardDoc.membershipTier,
      transaction
    };
  }

  /**
   * Standard Available Redeemable Coupons catalog
   */
  static getAvailableRewardCoupons() {
    return [
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
    ];
  }

  /**
   * Redeem Points for a coupon
   */
  static async redeemCoupon({ userId, couponCode }) {
    const catalog = this.getAvailableRewardCoupons();
    const coupon = catalog.find((c) => c.code === couponCode);

    if (!coupon) {
      throw new Error(`Reward coupon "${couponCode}" not found.`);
    }

    let rewardDoc = await Reward.findOne({ userId });
    if (!rewardDoc) {
      rewardDoc = new Reward({
        userId,
        totalPoints: 2450,
        lifetimePointsEarned: 3200,
        pointsRedeemed: 750,
        membershipTier: "Silver Traveller"
      });
    }

    if (rewardDoc.totalPoints < coupon.pointsCost) {
      throw new Error(`Insufficient points. You need ${coupon.pointsCost} points, but have ${rewardDoc.totalPoints}.`);
    }

    rewardDoc.totalPoints -= coupon.pointsCost;
    rewardDoc.pointsRedeemed += coupon.pointsCost;

    const redeemedCoupon = {
      code: `${coupon.code}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: coupon.title,
      discountValue: coupon.discountValue,
      pointsCost: coupon.pointsCost,
      category: coupon.category,
      description: coupon.description,
      isRedeemed: true,
      redeemedAt: new Date().toISOString()
    };

    rewardDoc.activeCoupons.unshift(redeemedCoupon);

    rewardDoc.transactions.unshift({
      id: `TXN-${Date.now()}`,
      type: "REDEEMED",
      points: -coupon.pointsCost,
      description: `Redeemed for ${coupon.title} (${redeemedCoupon.code})`,
      date: new Date().toISOString().split("T")[0]
    });

    await rewardDoc.save();

    return {
      success: true,
      redeemedCoupon,
      remainingPoints: rewardDoc.totalPoints,
      message: `Successfully redeemed ${coupon.pointsCost} points for ${coupon.title}!`
    };
  }
}
