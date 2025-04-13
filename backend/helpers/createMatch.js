const Match = require("../models/matchModel");

async function createMatch(userId, postId, matchScore) {
  try {
    const newMatch = new Match({
      userId,
      postId,
      matchScore,
      status: "pending", // Default status
    });

    await newMatch.save();
  } catch (error) {
    throw new Error(`Failed to create match: ${error.message}`);
  }
}

module.exports = { createMatch };