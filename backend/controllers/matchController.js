const Match = require("../models/matchModel");
const Trip = require("../models/tripModel");
const TravelPost = require("../models/travelPostModel");
const approveMatch = require("../helpers/approveMatch");
const mongoose = require("mongoose");

// Update match status (e.g., accept or reject)
exports.approveMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id; // Extract user ID from authentication middleware

    // Call the helper function to approve the match
    const updatedMatch = await approveMatch(userId, matchId);

    res.status(200).json({
      message: "Match approved successfully",
      match: updatedMatch,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMatchManually = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { postId, userId } = req.body;

    // Validate postId and userId
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid postId or userId");
    }

    // Fetch the travel post
    const travelPost = await TravelPost.findById(postId).session(session);
    if (!travelPost) {
      throw new Error("Travel post not found");
    }

    const creatorId = travelPost.creatorId;

    // Ensure the requesting user is not the creator of the travel post
    if (creatorId.toString() === userId.toString()) {
      throw new Error("Cannot create a match with yourself");
    }

    // Create a match for the requesting user (status: accepted)
    const matchForRequestingUser = new Match({
      userId,
      postId,
      status: "accepted",
    });
    await matchForRequestingUser.save({ session });

    // Create a match for the travel post creator (status: pending)
    const matchForCreator = new Match({
      userId: creatorId,
      postId,
      status: "pending",
    });
    await matchForCreator.save({ session });

    await session.commitTransaction();
    res.status(201).json({
      message: "Matches created successfully",
      matchForRequestingUser,
      matchForCreator,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

exports.updateMatchStatus = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { status },
      { new: true }
    );

    if (!updatedMatch) {
      return res.status(404).json({ message: "Match not found" });
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
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    // Extract the user ID from the authenticated user
    const { _id: userId } = req.user;

    // Find all matches where the user is involved
    const matches = await Match.find({ userId })
      .populate({
        path: "postId",
        populate: {
          path: "creatorId", // Populate the creatorId from the postId
          model: "User" // Assuming the creatorId refers to the User model
        }
      }) // Populate the travel post details
      .populate("userId") // Populate the user details
      .sort({ createdAt: -1 }); // Sort by most recent

    // Return the matches
    res.status(200).json({
      message: "Matches fetched successfully",
      matches,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({
      message: "Failed to fetch matches",
      error: error.message,
    });
  }
};

exports.getOtherUserMatchStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id; // Extract user ID from authentication middleware

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId" });
    }

    // Fetch the travel post
    const travelPost = await TravelPost.findById(postId);
    if (!travelPost) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    // Determine the other user's ID
    const otherUserId = travelPost.creatorId.toString() === userId.toString()
      ? travelPost.creatorId // If the current user is the creator, the other user is the match's userId
      : travelPost.creatorId; // Otherwise, the other user is the creator

    // Find the match for the other user
    const otherUserMatch = await Match.findOne({
      postId,
      userId:  { $ne: userId },
    }).populate('userId');

    if (!otherUserMatch) {
      return res.status(404).json({ message: "No match found for the other user" });
    }

    // Return the status of the other user's match
    res.status(200).json({
      message: "Match status retrieved successfully",
      status: otherUserMatch.status,
      match: otherUserMatch,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve match status", error: error.message });
  }
};