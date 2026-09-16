import React, { createContext, useContext, useState, useEffect } from "react";
import { RewardService } from "../services/RewardService";

const RewardsContext = createContext(null);

export const RewardsProvider = ({ children }) => {
  const [rewardsData, setRewardsData] = useState({
    totalPoints: 2450,
    lifetimePointsEarned: 3200,
    pointsRedeemed: 750,
    membershipTier: "Silver Traveller",
    tierPointsProgress: 2450,
    nextTierThreshold: 5000,
    transactions: [],
    activeCoupons: [],
    availableCoupons: []
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchRewards = async () => {
    try {
      const data = await RewardService.getRewardsSummary();
      setRewardsData(data);
    } catch (err) {
      console.error("Failed to load rewards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const redeemCoupon = async (couponCode) => {
    const result = await RewardService.redeemCoupon(couponCode);
    await fetchRewards();
    return result;
  };

  const addRewardPoints = async ({ points, bookingId, description }) => {
    const updated = await RewardService.creditPoints({ points, bookingId, description });
    setRewardsData(updated);
    return updated;
  };

  return (
    <RewardsContext.Provider
      value={{
        rewardsData,
        totalPoints: rewardsData.totalPoints || 0,
        membershipTier: rewardsData.membershipTier || "Silver Traveller",
        tierPointsProgress: rewardsData.tierPointsProgress || 0,
        nextTierThreshold: rewardsData.nextTierThreshold || 5000,
        transactions: rewardsData.transactions || [],
        activeCoupons: rewardsData.activeCoupons || [],
        availableCoupons: rewardsData.availableCoupons || [],
        isLoading,
        redeemCoupon,
        addRewardPoints,
        refreshRewards: fetchRewards
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error("useRewards must be used within a RewardsProvider");
  }
  return context;
};
