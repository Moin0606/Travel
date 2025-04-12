const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TravelPost",
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  itinerary: [{ activity: String, date: Date }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", TripSchema);