const mongoose = require("mongoose");
const User = require("../models/userModel");
const TravelPost = require("../models/travelPostModel");
const Match = require("../models/matchModel");

const MATCH_SCORE_THRESHOLD = 50;

/**
 * Finds potential matches for a given travel post.
 * @param {string} postId - ID of the travel post to find matches for
 * @returns {Promise<Array>} - Array of matched user IDs and scores
 */
async function findPotentialMatches(postId) {
  try {
    console.log("🔍 Starting match-making process...");
    console.log("Post ID received:", postId);

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.warn("Invalid postId format:", postId);
      throw new Error("Invalid postId");
    }

    // Fetch the travel post by ID
    console.log("Fetching travel post from database...");
    const travelPost = await TravelPost.findById(postId);

    if (!travelPost) {
      console.warn("Travel post not found for ID:", postId);
      throw new Error("Travel post not found");
    }

    console.log("Found travel post:", {
      destination: travelPost.destination,
      budget: travelPost.budget,
      requirements: travelPost.requirements,
    });

    // Construct gender condition
    const genderCondition =
      travelPost.requirements.genderPreference === "any"
        ? {}
        : { gender: travelPost.requirements.genderPreference };

    console.log("Gender condition applied:", genderCondition);

    // Find users who meet the post's requirements
    console.log("Searching for matching users...");
    const query = {
      "travelPreferences.destinations": travelPost.destination,
      "travelPreferences.budgetRange.min": { $lte: travelPost.budget },
      "travelPreferences.budgetRange.max": { $gte: travelPost.budget },
      age: {
        $gte: travelPost.requirements.minAge,
        $lte: travelPost.requirements.maxAge,
      },
      ...genderCondition,
    };

    console.log("User query filter:", JSON.stringify(query, null, 2));

    const users = await User.find(query);
    console.log(`Found ${users.length} users matching criteria`);

    // Calculate match scores for each user
    console.log("Calculating match scores...");
    const matches = users.map((user) => {
      const score = calculateMatchScore(user, travelPost);
      return {
        userId: user._id,
        matchScore: score,
      };
    });

    console.log("Raw match scores calculated:", matches);

    // Filter matches with a score above the threshold
    const filteredMatches = matches.filter((match) => match.matchScore > MATCH_SCORE_THRESHOLD);
    console.log(`Found ${filteredMatches.length} matches above score threshold (${MATCH_SCORE_THRESHOLD})`);

    // Create Match entries in the database
    console.log("Saving matches to database...");
    for (const match of filteredMatches) {
      console.log(`Creating match for user: ${match.userId}, Score: ${match.matchScore}`);
      await Match.create({
        userId: match.userId,
        postId: travelPost._id,
        matchScore: match.matchScore,
        status: "pending", // Default status
      });
    }

    console.log("✅ Final matches:", filteredMatches);
    return filteredMatches;
  } catch (error) {
    console.error("❌ Error finding potential matches:", error.message);
    throw new Error(`Failed to find potential matches: ${error.message}`);
  }
}

/**
 * Calculates a compatibility score between a user and a travel post.
 * @param {Object} user - The user object
 * @param {Object} travelPost - The travel post object
 * @returns {number} - Match score between 0 and 100
 */
function calculateMatchScore(user, travelPost) {
  let score = 0;

  console.log("📊 Calculating match score for user:", user._id);

  // Ensure both user and travelPost have valid data
  if (!user.travelPreferences || !travelPost.requirements) {
    console.log("Incomplete data. Score: 0");
    return score; // Return 0 if data is incomplete
  }

  const { destinations, budgetRange } = user.travelPreferences;
  const { minAge, maxAge, genderPreference } = travelPost.requirements;

  // 1. Destination match
  if (Array.isArray(destinations) && destinations.includes(travelPost.destination)) {
    score += 30;
    console.log("✔️ Destination match: +30");
  } else {
    console.log("❌ No destination match");
  }

  // 2. Budget match
  if (
    budgetRange &&
    budgetRange.min <= travelPost.budget &&
    budgetRange.max >= travelPost.budget
  ) {
    score += 30;
    console.log("✔️ Budget match: +30");
  } else {
    console.log("❌ No budget match");
  }

  // 3. Age range match
  if (user.age >= minAge && user.age <= maxAge) {
    score += 20;
    console.log("✔️ Age match: +20");
  } else {
    console.log("❌ Age out of range");
  }

  // 4. Gender match
  if (genderPreference === "any" || genderPreference === user.gender) {
    score += 20;
    console.log("✔️ Gender match: +20");
  } else {
    console.log("❌ Gender mismatch");
  }

  console.log(`🎯 Total match score: ${score}`);
  return score;
}

module.exports = { findPotentialMatches };