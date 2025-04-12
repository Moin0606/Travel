const mongoose = require("mongoose");
const User = require("../models/userModel");
const TravelPost = require("../models/travelPostModel");
const Match = require("../models/matchModel");

const MATCH_SCORE_THRESHOLD = 50;

async function findPotentialMatches(postId) {
  try {
    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid postId");
    }

    // Fetch the travel post by ID
    const travelPost = await TravelPost.findById(postId);
    if (!travelPost) {
      throw new Error("Travel post not found");
    }

    // Construct gender condition
    const genderCondition =
      travelPost.requirements.genderPreference === "any"
        ? {}
        : { gender: travelPost.requirements.genderPreference };

    // Find users who meet the post's requirements
    const users = await User.find({
      "travelPreferences.destinations": travelPost.destination,
      "travelPreferences.budgetRange.min": { $lte: travelPost.budget },
      "travelPreferences.budgetRange.max": { $gte: travelPost.budget },
      age: { $gte: travelPost.requirements.minAge, $lte: travelPost.requirements.maxAge },
      ...genderCondition,
    });

    // Calculate match scores for each user
    const matches = users.map((user) => ({
      userId: user._id,
      matchScore: calculateMatchScore(user, travelPost),
    }));

    // Filter matches with a score above the threshold
    const filteredMatches = matches.filter((match) => match.matchScore > MATCH_SCORE_THRESHOLD);

    // Create Match entries in the database
    for (const match of filteredMatches) {
      await Match.create({
        userId: match.userId,
        postId: travelPost._id,
        matchScore: match.matchScore,
        status: "pending", // Default status
      });
    }

    return filteredMatches;
  } catch (error) {
    console.error("Error finding potential matches:", error.message);
    throw new Error(`Failed to find potential matches: ${error.message}`);
  }
}
function calculateMatchScore(user, travelPost) {
  let score = 0;

  // Ensure both user and travelPost have valid data
  if (!user.travelPreferences || !travelPost.requirements) {
    return score; // Return 0 if data is incomplete
  }

  const { destinations, budgetRange } = user.travelPreferences;
  const { minAge, maxAge, genderPreference } = travelPost.requirements;

  // 1. Check if the user's preferred destinations include the post's destination
  if (
    Array.isArray(destinations) &&
    destinations.includes(travelPost.destination)
  ) {
    score += 30; // High weight for matching destination
  }

  // 2. Check if the user's budget range overlaps with the post's budget
  if (
    budgetRange &&
    budgetRange.min <= travelPost.budget &&
    budgetRange.max >= travelPost.budget
  ) {
    score += 30; // High weight for matching budget
  }

  // 3. Check if the user's age is within the post's required range
  if (user.age >= minAge && user.age <= maxAge) {
    score += 20; // Medium weight for age match
  }

  // 4. Check if the user's gender matches the post's gender preference
  if (genderPreference === "any" || genderPreference === user.gender) {
    score += 20; // Medium weight for gender match
  }

  return score;
}

module.exports = { findPotentialMatches };
