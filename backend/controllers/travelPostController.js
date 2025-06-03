const mongoose = require("mongoose");
const TravelPost = require("../models/travelPostModel");
const Match = require("../models/matchModel");
const { findPotentialMatches } = require("../helpers/matchingAlgorithm");
const { createMatch } = require("../helpers/createMatch");

// Create a new travel post
exports.createTravelPost = async (req, res) => {
  try {
    console.log("Reached createTravelPost controller");
    console.log("req.body:", req.body);

    const travelDates = JSON.parse(req.body.travelDates || '{}');
    const requirements = JSON.parse(req.body.requirements || '{}');

    const {
      destination,
      description,
      budget,
      travelStyle
    } = req.body;

    const image = req.cloudinaryUrl || null; // Allow image to be optional

    console.log(
      destination,
      travelDates,
      image,
      description,
      budget,
      travelStyle,
      requirements
    );

    // Validate required fields
    if (!destination || !travelDates.start || !travelDates.end) {
      return res.status(400).json({
        message: "Destination and travel dates (start & end) are required.",
      });
    }

    // Validate travel dates
    if (new Date(travelDates.start) >= new Date(travelDates.end)) {
      return res.status(400).json({
        message: "Travel start date must be before the end date.",
      });
    }

    const creatorId = req.user._id;

    // Create a new travel post
    const newTravelPost = new TravelPost({
      creatorId,
      destination,
      travelDates,
      image, // may be null
      description,
      budget,
      travelStyle,
      requirements,
    });

    await newTravelPost.save();

    // Trigger matching algorithm
    const matches = await findPotentialMatches(newTravelPost._id);

    // Create match entries for potential matches
    for (const match of matches) {
      await createMatch(match.userId, newTravelPost._id, match.matchScore);
    }

    res.status(201).json({
      message: "Travel post created successfully",
      travelPost: newTravelPost,
    });
  } catch (error) {
    console.error("Error creating travel post:", error);
    res.status(500).json({
      message: "Failed to create travel post",
      error: error.message,
    });
  }
};
// Close a travel post
exports.closeTravelPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId format" });
    }

    // Find and update the travel post to "closed" status
    const closedPost = await TravelPost.findByIdAndUpdate(
      postId,
      { status: "closed" },
      { new: true }
    );

    if (!closedPost) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    res.status(200).json({
      message: "Travel post closed successfully",
      travelPost: closedPost,
    });
  } catch (error) {
    console.error("Error closing travel post:", error);
    res.status(500).json({
      message: "Failed to close travel post",
      error: error.message,
    });
  }
};

// Get all travel posts with optional filters
exports.getAllTravelPosts = async (req, res) => {
  try {
    const {
      creatorId,
      budget,
      travelStyle,
      minAge,
      maxAge,
      genderPreference,
      description,
    } = req.query;

    const filter = {};

    // Filter by creatorId
    if (creatorId) {
      if (!mongoose.Types.ObjectId.isValid(creatorId)) {
        return res.status(400).json({ message: "Invalid creatorId format" });
      }
      filter.creatorId = creatorId;
    }

    // Filter by budget range
    if (budget) {
      const [minBudget, maxBudget] = budget.split(",").map(Number);
      if (isNaN(minBudget) || isNaN(maxBudget)) {
        return res.status(400).json({ message: "Invalid budget range" });
      }
      filter.budget = { $gte: minBudget, $lte: maxBudget };
    }

    // Filter by travelStyle
    if (travelStyle) {
      filter.travelStyle = travelStyle;
    }

    // Filter by requirements (minAge, maxAge, genderPreference)
    if (minAge || maxAge || genderPreference) {
      filter.requirements = {};
      if (minAge) filter.requirements.minAge = { $gte: Number(minAge) };
      if (maxAge) filter.requirements.maxAge = { $lte: Number(maxAge) };
      if (genderPreference)
        filter.requirements.genderPreference = genderPreference;
    }

    // Text search in description
    if (description) {
      filter.description = { $regex: description, $options: "i" }; // Case-insensitive search
    }

    // Fetch filtered travel posts
    const travelPosts = await TravelPost.find(filter)
      .populate("creatorId", "_id username profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Travel posts fetched successfully",
      count: travelPosts.length,
      travelPosts,
    });
  } catch (error) {
    console.error("Error fetching travel posts:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch travel posts", error: error.message });
  }
};

// Delete a travel post
exports.deleteTravelPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId format" });
    }

    // Find and delete the travel post
    const deletedPost = await TravelPost.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    res
      .status(200)
      .json({ message: "Travel post deleted successfully", deletedPost });
  } catch (error) {
    console.error("Error deleting travel post:", error);
    res
      .status(500)
      .json({ message: "Failed to delete travel post", error: error.message });
  }
};

// Update a travel post
exports.updateTravelPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;

    // Validate postId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid postId format" });
    }

    // Find and update the travel post
    const updatedPost = await TravelPost.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    res.status(200).json({
      message: "Travel post updated successfully",
      travelPost: updatedPost,
    });
  } catch (error) {
    console.error("Error updating travel post:", error);
    res
      .status(500)
      .json({ message: "Failed to update travel post", error: error.message });
  }
};
