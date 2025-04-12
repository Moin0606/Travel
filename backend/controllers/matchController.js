const Match = require("../models/matchModel");
const Trip = require("../models/tripModel");
const TravelPost = require("../models/travelPostModel");

// Update match status (e.g., accept or reject)
exports.updateMatchStatus = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { status },
      { new: true }
    );

    if (!updatedMatch) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Check if both parties have accepted the match
    if (status === "accepted") {
      const match = await Match.findById(matchId)
        .populate("postId")
        .populate("userId");

      const otherMatch = await Match.findOne({
        postId: match.postId._id,
        userId: match.postId.creatorId,
        status: "accepted",
      });

      if (otherMatch) {
        // Both parties have accepted, create a trip
        await createTrip(match.postId._id, [
          match.userId._id,
          match.postId.creatorId,
        ]);
      }
    }

    res.status(200).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: "Failed to update match status", error });
  }
};

async function createTrip(postId, participants) {
  const newTrip = new Trip({
    postId,
    participants,
    itinerary: [], // Empty itinerary initially
  });

  await newTrip.save();

  // Close the travel post since a trip has been created
  await TravelPost.findByIdAndUpdate(postId, { status: "closed" });
}

exports.getUserMatches = async (req, res) => {
  try {
    const { userId } = req.user._id;

    // Find all matches where the user is involved
    const matches = await Match.find({ userId })
      .populate("postId", "destination") // Populate the travel post details
      .sort({ createdAt: -1 }); // Sort by most recent

    res.status(200).json(matches);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch matches", error: error.message });
  }
};
