const MatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  preferences: {
    destination: { type: String },
    travelPartnerType: { type: String },
    travelStyle: { type: String },
  },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Match = mongoose.model("Match", MatchSchema);

module.exports = { User, TravelPost, Trip, Chat, Match };
