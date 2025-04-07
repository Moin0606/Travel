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
    end: { type: Date, required: true }
  },
  description: { type: String },
  budget: { type: Number },
  travelStyle: { type: String }, // e.g., "backpacking", "luxury"
  images: [{type: String}],
  matchedUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      matchedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],

  requirements: {
    minAge: { type: Number },
    maxAge: { type: Number },
    genderPreference: { type: String }, // e.g., "male", "female", "any"
  },

  status: { type: String, enum: ["active", "closed"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TravelPost", TravelPostSchema);
