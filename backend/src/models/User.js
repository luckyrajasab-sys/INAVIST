import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, default: "Family" }
}, { _id: false });

const travelPreferencesSchema = new mongoose.Schema({
  travelStyle: { type: String, default: "Heritage & Nature" },
  preferredTransport: { type: String, default: "Train / Cab" },
  budgetLevel: { type: String, default: "Moderate" },
  dietary: { type: String, default: "Vegetarian / Mixed" }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String },
  authProvider: { type: String, enum: ["local", "google", "apple"], default: "local" },
  avatar: { type: String, default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
  isVerified: { type: Boolean, default: false },
  verificationType: { type: String, default: "Standard User" },
  nationality: { type: String, default: "Indian" },
  isForeigner: { type: Boolean, default: false },
  
  // International Tourist metadata
  passportNumber: { type: String, default: "" },
  passportExpiry: { type: String, default: "" },
  visaNumber: { type: String, default: "" },
  visaType: { type: String, default: "" },
  visaExpiry: { type: String, default: "" },
  arrivalPort: { type: String, default: "" },
  homeCountryContact: { type: String, default: "" },

  homeCity: { type: String, default: "New Delhi, India" },
  travelStyle: { type: String, default: "Spiritual & Mountain Heritage" },

  registeredLocation: {
    city: { type: String, default: "Bengaluru" },
    state: { type: String, default: "Karnataka" },
    country: { type: String, default: "India" },
    formattedAddress: { type: String, default: "Bengaluru, Karnataka, India" },
    isApproximate: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
  },

  savedUpiIds: [
    {
      upiId: { type: String, required: true },
      bankHandle: { type: String, default: "UPI" },
      isDefault: { type: Boolean, default: false },
      maskedName: { type: String, default: "Verified User" },
      addedAt: { type: Date, default: Date.now }
    }
  ],

  emergencyContacts: [emergencyContactSchema],
  travelPreferences: { type: travelPreferencesSchema, default: () => ({}) },

  savedDestinations: [{ type: String, ref: "Destination" }],
  favoritePlaces: [{ type: String }],
  searchHistory: [{ type: String }],

  refreshTokens: [{ type: String }],
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  emailVerificationToken: { type: String },
  emailVerificationExpire: { type: Date },

  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Password verification helper
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.model("User", userSchema);
