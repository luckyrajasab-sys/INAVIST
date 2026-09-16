import mongoose from "mongoose";

const rewardTransactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["EARNED", "REDEEMED", "BONUS", "EXPIRED"], required: true },
  points: { type: Number, required: true },
  description: { type: String, required: true },
  bookingId: { type: String },
  date: { type: String, default: () => new Date().toISOString().split("T")[0] },
  expiryDate: { type: String }
}, { _id: false });

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  discountValue: { type: Number, required: true },
  pointsCost: { type: Number, required: true },
  category: { type: String, enum: ["travel", "hotel", "package", "lounge", "food"], default: "travel" },
  description: { type: String },
  isRedeemed: { type: Boolean, default: false },
  redeemedAt: { type: String }
}, { _id: false });

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  totalPoints: { type: Number, default: 2450 },
  lifetimePointsEarned: { type: Number, default: 3200 },
  pointsRedeemed: { type: Number, default: 750 },
  membershipTier: {
    type: String,
    enum: ["Bronze Explorer", "Silver Traveller", "Gold Voyager", "Platinum Elite"],
    default: "Silver Traveller"
  },
  tierPointsProgress: { type: Number, default: 2450 },
  nextTierThreshold: { type: Number, default: 5000 },
  transactions: [rewardTransactionSchema],
  activeCoupons: [couponSchema]
}, {
  timestamps: true
});

export const Reward = mongoose.model("Reward", rewardSchema);
