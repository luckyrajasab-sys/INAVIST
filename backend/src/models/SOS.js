import mongoose from "mongoose";

const emergencyContactNotificationSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  status: { type: String, enum: ["queued", "sent", "failed"], default: "queued" }
}, { _id: false });

const sosSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  userName: { type: String, required: true },
  userPhone: { type: String },
  userEmail: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  emergencyContactsNotified: [emergencyContactNotificationSchema],
  message: { type: String, default: "EMERGENCY: Traveler triggered YĀTRI SOS! Immediate assistance needed." },
  status: {
    type: String,
    enum: ["triggered", "acknowledged", "dispatched", "resolved"],
    default: "triggered",
    index: true
  },
  resolutionNotes: { type: String },
  resolvedAt: { type: Date }
}, {
  timestamps: true
});

export const SOS = mongoose.model("SOS", sosSchema);
