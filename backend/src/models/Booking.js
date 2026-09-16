import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  idType: { type: String, enum: ["Aadhaar", "Passport", "Driving License", "Voter ID"], default: "Aadhaar" },
  idNumberMasked: { type: String, default: "" },
  seatNumber: { type: String, default: "" },
  berthPreference: { type: String, default: "No Preference" }
}, { _id: false });

const sectorSchema = new mongoose.Schema({
  sectorIndex: { type: Number, default: 0 },
  mode: { type: String, enum: ["train", "bus", "flight", "cab"], required: true },
  operator: { type: String, required: true },
  routeNumber: { type: String },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  stops: { type: String }
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  baseFare: { type: Number, required: true },
  taxes: { type: Number, default: 0 },
  convenienceFee: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  pointsRedeemed: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }
}, { _id: false });

const paymentDetailsSchema = new mongoose.Schema({
  method: { type: String, default: "UPI" },
  upiId: { type: String },
  transactionId: { type: String, required: true },
  gatewayRef: { type: String },
  status: { type: String, enum: ["PENDING", "VERIFIED", "FAILED", "REFUNDED"], default: "VERIFIED" },
  paidAt: { type: Date, default: Date.now }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  bookingId: { type: String, required: true, unique: true, index: true },
  pnr: { type: String, required: true, unique: true, index: true },
  type: {
    type: String,
    enum: ["train", "bus", "flight", "cab", "multi_modal", "hotel", "package"],
    required: true
  },
  title: { type: String, required: true },
  originCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  travelDate: { type: String, required: true },
  passengerCount: { type: Number, default: 1 },
  passengers: [passengerSchema],
  sectors: [sectorSchema],
  pricing: pricingSchema,
  amount: { type: Number, required: true },
  paymentDetails: paymentDetailsSchema,
  rewardPointsEarned: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Confirmed", "Pending", "Cancelled", "Completed"],
    default: "Confirmed"
  },
  contactEmail: { type: String },
  contactPhone: { type: String },
  importantInstructions: [{ type: String }]
}, {
  timestamps: true
});

export const Booking = mongoose.model("Booking", bookingSchema);
