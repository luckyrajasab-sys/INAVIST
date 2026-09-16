import mongoose from "mongoose";

const transportSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ["flight", "train", "bus", "cab", "rental", "ferry", "shared_cab", "helicopter", "tempo_traveller", "e_rickshaw", "water_taxi"],
    required: true,
    index: true
  },
  operator: { type: String, required: true }, // IndiGo, Air India, Vande Bharat, KSRTC, Ola/Uber
  routeNumber: { type: String, required: true }, // 6E-204, 22436, KA-01-EXP
  originCity: { type: String, required: true, index: true },
  destinationCity: { type: String, required: true, index: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  frequency: { type: String, default: "Daily" },
  basePrice: { type: Number, required: true },
  classes: [{
    className: { type: String }, // Economy, Executive, AC Sleeper, Sedan, SUV
    price: { type: Number },
    availableSeats: { type: Number, default: 20 }
  }],
  vehicleType: { type: String },
  rating: { type: Number, default: 4.6 }
}, {
  timestamps: true
});

transportSchema.index({ originCity: 1, destinationCity: 1, mode: 1 });

export const Transport = mongoose.model("Transport", transportSchema);
