import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: {
    type: String,
    enum: [
      "trip_reminder",
      "weather_alert",
      "travel_alert",
      "booking_update",
      "join_request",
      "sos_event",
      "system"
    ],
    default: "system"
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false, index: true },
  readAt: { type: Date }
}, {
  timestamps: true
});

export const Notification = mongoose.model("Notification", notificationSchema);
