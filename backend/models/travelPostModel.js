const mongoose = require("mongoose");

const TravelPostSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destination: { type: String, required: true },
  travelDates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  description: { type: String },
  budget: { type: Number },
  travelStyle: { type: String },
  requirements: {
    minAge: { type: Number },
    maxAge: { type: Number },
    genderPreference: { type: String },
  },
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TravelPost", TravelPostSchema);