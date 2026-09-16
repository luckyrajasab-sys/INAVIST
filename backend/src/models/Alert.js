import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  destinationId: { type: String, index: true },
  destinationName: { type: String },
  state: { type: String, default: "Pan-India", index: true },
  district: { type: String },
  severity: {
    type: String,
    enum: ["low", "moderate", "high", "critical", "info", "warning"],
    default: "moderate",
    index: true
  },
  alertType: {
    type: String,
    enum: [
      "weather",
      "heavy_rain",
      "flood",
      "landslide",
      "road_closure",
      "transport_disruption",
      "gov_notice",
      "safety"
    ],
    default: "weather",
    index: true
  },
  description: { type: String, required: true },
  advice: { type: String, default: "" },
  issuedBy: { type: String, default: "YĀTRI Real-Time Ops & Disaster Command" },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true, index: true },
  source: { type: String, default: "IMD / NDMA / State Traffic Police" }
}, {
  timestamps: true
});

export const Alert = mongoose.model("Alert", alertSchema);
