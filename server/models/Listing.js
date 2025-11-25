// server/models/Listing.js
import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["hostel", "pg", "flat"], default: "hostel" },
  description: { type: String, default: "" },
  city: { type: String, required: true, index: true },
  pincode: { type: String },
  price: { type: Number, required: true, index: true },
  sharing: { type: Number, default: 1 }, // 1 = single, 2 = two-sharing etc.
  ac: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  images: { type: [String], default: [] },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// geospatial index for location queries
ListingSchema.index({ location: "2dsphere" });

export default mongoose.model("Listing", ListingSchema);
