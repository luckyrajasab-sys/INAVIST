import { Router } from "express";
import { getRewardsSummary, redeemReward, getRewardsHistory } from "../controllers/rewardController.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, getRewardsSummary);
router.post("/redeem", optionalAuth, redeemReward);
router.get("/history", optionalAuth, getRewardsHistory);

export default router;
