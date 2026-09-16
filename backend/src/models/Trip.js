import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  time: { type: String, default: "10:00 AM" },
  title: { type: String, required: true },
  cost: { type: Number, default: 0 },
  location: { type: String }
}, { _id: false });

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  theme: { type: String, default: "" },
  activities: [activitySchema],
  stayCost: { type: Number, default: 0 }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  userEmail: { type: String },
  title: { type: String, required: true, trim: true },
  startCity: { type: String, default: "New Delhi" },
  destinationId: { type: String, index: true },
  destinationName: { type: String },
  destinations: [{
    id: { type: String },
    name: { type: String },
    days: { type: Number, default: 1 }
  }],
  startDate: { type: String },
  endDate: { type: String },
  travellers: { type: Number, default: 1, min: 1 },
  days: { type: Number, default: 3, min: 1 },
  itinerary: [itineraryDaySchema],
  transportation: {
    type: { type: String, default: "Flight / Train" },
    details: { type: String },
    cost: { type: Number, default: 0 }
  },
  accommodation: {
    name: { type: String },
    type: { type: String, default: "Heritage Homestay / Resort" },
    costPerNight: { type: Number, default: 0 },
    nights: { type: Number, default: 1 }
  },
  totalEstimatedBudget: { type: Number, default: 0 },
  budgetPerPerson: { type: Number, default: 0 },
  actualBudget: { type: Number, default: 0 },
  notes: { type: String, default: "" },
  status: { type: String, enum: ["planning", "active", "completed", "cancelled"], default: "active", index: true },
  crisisHistory: [{
    crisisType: { type: String },
    customProblem: { type: String },
    appliedAction: { type: String },
    resolvedAt: { type: Date, default: Date.now }
  }],
  isPublic: { type: Boolean, default: false },
  shareToken: { type: String, index: true }
}, {
  timestamps: true
});

export const Trip = mongoose.model("Trip", tripSchema);
