import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Deluxe, Luxury Suite, Dorm Bed
  price: { type: Number, required: true },
  availableRooms: { type: Number, default: 5 },
  maxGuests: { type: Number, default: 2 }
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  destinationId: { type: String, index: true },
  destinationName: { type: String },
  city: { type: String, required: true, index: true },
  state: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ["hotel", "hostel", "resort", "homestay", "budget", "luxury"],
    default: "hotel",
    index: true
  },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  pricePerNight: { type: Number, required: true, index: true },
  images: [{ type: String }],
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  amenities: [{ type: String }], // WiFi, Swimming Pool, Mountain View, Ayurvedic Spa, etc.
  roomTypes: [roomTypeSchema],
  safetyFeatures: [{ type: String }],
  contact: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },
  isEcoCertified: { type: Boolean, default: false },
  checkInTime: { type: String, default: "02:00 PM" },
  checkOutTime: { type: String, default: "11:00 AM" }
}, {
  timestamps: true
});

hotelSchema.index({ name: "text", city: "text", state: "text", amenities: "text" });

export const Hotel = mongoose.model("Hotel", hotelSchema);
