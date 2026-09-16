import { Reward } from "../models/Reward.js";
import { RewardsService } from "../services/rewardsService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Get Rewards account summary (Points balance, membership tier, coupons)
 */
export const getRewardsSummary = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : "65e000000000000000000001";
    let reward = await Reward.findOne({ userId });

    if (!reward) {
      reward = new Reward({
        userId,
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
          }
        ]
      });
      await reward.save();
    }

    const availableCoupons = RewardsService.getAvailableRewardCoupons();

    return sendSuccess(res, {
      totalPoints: reward.totalPoints,
      lifetimePointsEarned: reward.lifetimePointsEarned,
      pointsRedeemed: reward.pointsRedeemed,
      membershipTier: reward.membershipTier,
      tierPointsProgress: reward.tierPointsProgress,
      nextTierThreshold: reward.nextTierThreshold,
      transactions: reward.transactions,
      activeCoupons: reward.activeCoupons,
      availableCoupons
    }, "Rewards summary retrieved.");
  } catch (error) {
    next(error);
  }
};

/**
 * Redeem Points for a Travel / Hotel / Package discount coupon
 */
export const redeemReward = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : "65e000000000000000000001";
    const { couponCode } = req.body;

    if (!couponCode) {
      return sendError(res, "Coupon code is required.", 400);
    }

    const result = await RewardsService.redeemCoupon({
      userId,
      couponCode
    });

    return sendSuccess(res, result, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Points Ledger / Transaction History
 */
export const getRewardsHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : "65e000000000000000000001";
    const reward = await Reward.findOne({ userId });

    return sendSuccess(res, {
      transactions: reward?.transactions || [],
      totalPoints: reward?.totalPoints || 0
    }, "Rewards transaction history retrieved.");
  } catch (error) {
    next(error);
  }
};
