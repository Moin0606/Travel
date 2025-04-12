const Match = require("../models/matchModel");
const Trip = require("../models/tripModel");
const TravelPost = require("../models/travelPostModel");
const mongoose = require("mongoose");

async function approveMatch(userId, matchId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the match by ID
    const match = await Match.findById(matchId).session(session);
    if (!match) {
      throw new Error("Match not found");
    }

    console.log("Found Match:", match);

    // Ensure the user is authorized to approve this match
    if (match.userId.toString() !== userId.toString()) {
      throw new Error("Unauthorized to approve this match");
    }

    // Update the match status to "accepted"
    match.status = "accepted";
    await match.save({ session });
    console.log("Updated Match Status to Accepted:", match);

    // Fetch the travel post to get the creatorId
    const travelPost = await TravelPost.findById(match.postId).session(session);
    if (!travelPost) {
      throw new Error("Travel post not found");
    }

    // Determine the other user's ID
    const otherUserId = travelPost.creatorId.toString() === userId.toString()
      ? match.userId // If the current user is the creator, the other user is the match's userId
      : travelPost.creatorId; // Otherwise, the other user is the creator

    console.log("Travel Post Creator ID:", travelPost.creatorId.toString());
    console.log("Current User ID:", userId.toString());
    console.log("Match User ID:", match.userId.toString());
    console.log("Calculated Other User ID:", otherUserId.toString());

    // Prevent creating a trip if the user IDs match
    if (otherUserId.toString() === userId.toString()) {
      console.log("User IDs match. Skipping trip creation.");
      await session.commitTransaction();
      return match;
    }

    // Check if the other user has also approved
    const otherMatch = await Match.findOne({
      postId: match.postId,
      userId: otherUserId,
      status: "accepted",
    }).session(session);

    console.log("Other Match Found:", otherMatch);

    if (otherMatch) {
      // Ensure the participants array contains unique IDs
      const participants = [userId, otherUserId].filter((id, index, array) => array.indexOf(id) === index);
      console.log("Participants:", participants.map((id) => id.toString()));

      // Create the trip
      const trip = await Trip.create(
        [
          {
            postId: match.postId,
            participants: participants,
            status: "active",
            createdAt: new Date(),
          },
        ],
        { session }
      );

      console.log("Trip Created Successfully:", trip);
    }

    await session.commitTransaction();
    return match;
  } catch (error) {
    await session.abortTransaction();
    console.error("Error approving match:", error.message);
    throw new Error(`Failed to approve match: ${error.message}`);
  } finally {
    session.endSession();
  }
}

module.exports = approveMatch;