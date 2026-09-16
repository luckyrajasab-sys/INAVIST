import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: {
    type: String,
    enum: ["user", "review", "travel_group", "destination"],
    required: true
  },
  targetId: { type: String, required: true },
  reason: { type: String, required: true },
  details: { type: String },
  status: {
    type: String,
    enum: ["pending", "reviewed", "action_taken", "dismissed"],
    default: "pending",
    index: true
  }
}, {
  timestamps: true
});

export const Report = mongoose.model("Report", reportSchema);
