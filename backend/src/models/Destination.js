import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  state: { type: String, required: true, trim: true, index: true },
  district: { type: String, required: true, trim: true, index: true },
  region: { type: String, default: "North", index: true },
  category: { type: String, default: "nature", index: true },
  isHiddenGem: { type: Boolean, default: false, index: true },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  images: [{ type: String }],
  description: { type: String, required: true },
  detailedDescription: { type: String },
  
  // Coordinates for Geospatial queries
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat] for 2dsphere
  },

  viewpointStatus: { type: String, default: "OPEN" },
  viewpointTimings: {
    open: { type: String, default: "06:00 AM" },
    close: { type: String, default: "06:00 PM" },
    bestTime: { type: String }
  },
  crowdLevel: { type: String, default: "Moderate" },
  crowdPercentage: { type: Number, default: 50 },

  estimatedCosts: {
    travel: { type: Number, default: 1500 },
    stay: { type: Number, default: 2000 },
    food: { type: Number, default: 600 },
    entry: { type: Number, default: 50 },
    activities: { type: Number, default: 400 }
  },
  entryFee: { type: Number, default: 0 },

  safetyRating: { type: Number, default: 4.5 },
  safetyTips: [{ type: String }],
  emergencyInfo: {
    policePhone: { type: String, default: "112" },
    medicalPhone: { type: String, default: "108" },
    nearestHospital: { type: String },
    disasterHelp: { type: String, default: "1077" }
  },

  foodRecommendations: [{ type: String }],
  availableTransport: [{ type: String }],
  nearbyAttractions: [{ type: String }],
  hiddenPlacesNearby: [{ type: String }],
  localLanguages: [{ type: String }],
  tags: [{ type: String, index: true }],
  popularityScore: { type: Number, default: 100 }
}, {
  timestamps: true
});

// Sync location.coordinates with [lng, lat]
destinationSchema.pre("save", function (next) {
  if (this.coordinates && this.coordinates.lat && this.coordinates.lng) {
    this.location = {
      type: "Point",
      coordinates: [this.coordinates.lng, this.coordinates.lat]
    };
  }
  next();
});

// Indexes for high performance searches
destinationSchema.index({ location: "2dsphere" });
destinationSchema.index({ name: "text", description: "text", state: "text", district: "text", tags: "text" });

export const Destination = mongoose.model("Destination", destinationSchema);
