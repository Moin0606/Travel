const TravelPost = require("../models/travelPostModel");
const User = require("../models/userModel");

exports.findPotentialMatches = async (postId) => {
  const post = await TravelPost.findById(postId);

  return User.find({
    $and: [
      { _id: { $ne: post.creatorId } },
      { "travelPreferences.destinations": post.destination },
      {
        age: {
          $gte: post.requirements.minAge || 18,
          $lte: post.requirements.maxAge || 99,
        },
      },
      { "travelPreferences.budgetRange.min": { $lte: post.budget || 10000 } },
    ],
  });
};
