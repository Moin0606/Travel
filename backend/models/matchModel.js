const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TravelPost",
    required: true,
  },
  matchScore: { type: Number }, // e.g., 85 (out of 100)
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Match = mongoose.model("Match", MatchSchema);

module.exports = Match;
