import mongoose from "mongoose";

const travelHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  destinationId: { type: String, required: true, index: true },
  destinationName: { type: String, required: true },
  state: { type: String },
  status: {
    type: String,
    enum: ["want_to_visit", "planning", "visited"],
    default: "visited",
    index: true
  },
  visitDate: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String },
  photos: [{ type: String }],
  memories: [{ type: String }]
}, {
  timestamps: true
});

travelHistorySchema.index({ userId: 1, destinationId: 1 }, { unique: true });

export const TravelHistory = mongoose.model("TravelHistory", travelHistorySchema);
