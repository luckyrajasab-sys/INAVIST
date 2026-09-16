import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ["leader", "member"], default: "member" },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const joinRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  message: { type: String, default: "Would love to join your travel group!" },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const companionGroupSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  creatorName: { type: String, required: true },
  creatorAvatar: { type: String },
  title: { type: String, required: true, trim: true },
  destination: { type: String, required: true, index: true },
  destinationId: { type: String },
  travelDates: {
    startDate: { type: Date },
    endDate: { type: Date },
    displayStr: { type: String, required: true }
  },
  travelersNeeded: { type: Number, default: 2 },
  travelersCount: { type: Number, default: 1 },
  budgetPerPerson: { type: Number, default: 5000 },
  interests: [{ type: String }],
  bio: { type: String },
  description: { type: String },
  requiredVerification: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["open", "full", "completed", "cancelled"],
    default: "open",
    index: true
  },
  members: [memberSchema],
  joinRequests: [joinRequestSchema]
}, {
  timestamps: true
});

companionGroupSchema.index({ destination: "text", title: "text", description: "text" });

export const CompanionGroup = mongoose.model("CompanionGroup", companionGroupSchema);
