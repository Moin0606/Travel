const TravelPost = require("../models/travelPostModel");
const Match = require("../models/matchModel");
const { findPotentialMatches } = require("../helpers/matchingAlgorithm");
const { createMatch } = require("../helpers/createMatch");

// Create a new travel post
exports.createTravelPost = async (req, res) => {
  try {
    const { destination, travelDates, description, budget, travelStyle, requirements } = req.body;
    const creatorId = req.user._id;

    const newTravelPost = new TravelPost({
      creatorId,
      destination,
      travelDates,
      description,
      budget,
      travelStyle,
      requirements,
    });

    await newTravelPost.save();

    // Trigger matching algorithm (pseudo-code for now)
    const matches = await findPotentialMatches(newTravelPost._id);

    // Create match entries for potential matches
    for (const match of matches) {
      await createMatch(match.userId, newTravelPost._id, match.matchScore);
    }

    res.status(201).json({ message: "Travel post created successfully", travelPost: newTravelPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create travel post", error });
  }
};

// Close a travel post
exports.closeTravelPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const closedPost = await TravelPost.findByIdAndUpdate(
      postId,
      { status: "closed" },
      { new: true }
    );

    if (!closedPost) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    res.status(200).json(closedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to close travel post", error });
  }
};