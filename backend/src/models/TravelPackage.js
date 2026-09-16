import mongoose from "mongoose";

const travelPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  destination: { type: String, required: true, index: true },
  state: { type: String, required: true },
  durationDays: { type: Number, required: true },
  durationNights: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 120 },
  image: { type: String, required: true },
  placesCovered: [{ type: String }],
  hotel: {
    name: { type: String },
    type: { type: String, default: "4-Star Deluxe Resort / Heritage Stay" },
    rating: { type: Number, default: 4.7 }
  },
  activities: [{ type: String }],
  transportIncluded: { type: String, default: "AC Private Cab / Sightseeing Transfers" },
  rewardPointsEarnable: { type: Number, default: 500 },
  tags: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  itinerary: [{
    day: { type: Number },
    title: { type: String },
    description: { type: String }
  }]
}, {
  timestamps: true
});

export const TravelPackage = mongoose.model("TravelPackage", travelPackageSchema);
