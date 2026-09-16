import mongoose from "mongoose";

const ratingsBreakdownSchema = new mongoose.Schema({
  experience: { type: Number, default: 5, min: 1, max: 5 },
  cleanliness: { type: Number, default: 5, min: 1, max: 5 },
  safety: { type: Number, default: 5, min: 1, max: 5 },
  accessibility: { type: Number, default: 5, min: 1, max: 5 },
  valueForMoney: { type: Number, default: 5, min: 1, max: 5 }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  destinationId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  ratings: { type: ratingsBreakdownSchema, default: () => ({}) },
  comment: { type: String, required: true, trim: true },
  travelTips: { type: String, default: "" },
  photos: [{ type: String }],
  status: {
    type: String,
    enum: ["approved", "pending", "flagged", "rejected"],
    default: "approved",
    index: true
  },
  reportsCount: { type: Number, default: 0 },
  helpfulVotes: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Review = mongoose.model("Review", reviewSchema);
