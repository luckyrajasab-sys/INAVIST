import mongoose from "mongoose";

const govSchemeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  ministry: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  benefits: [{ type: String }],
  eligibility: { type: String },
  officialUrl: { type: String },
  state: { type: String, default: "National / Pan-India" }
}, {
  timestamps: true
});

export const GovScheme = mongoose.model("GovScheme", govSchemeSchema);
