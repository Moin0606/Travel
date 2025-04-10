const TravelPost = require("../models/travelPostModel");
const User = require("../models/userModel");
const { emitNotification }= require('../config/socketConfig');
const { findPotentialMatches } = require("../utils/matchingAlgorithm");

// Create a Travel Post with Image Upload Support
exports.createPost = async (req, res) => {
  try {
    const { destination, travelDates, description, budget, travelStyle, requirements } = req.body;
    
    const newPost = new TravelPost({
      creatorId: req.user.id,
      destination,
      travelDates,
      description,
      budget,
      travelStyle,
      requirements,
      images: req.files?.map(file => file.path) || [], // Handle uploaded files
      status: "active"
    });

    await newPost.save();
    
    // Find and notify potential matches
    const matches = await findPotentialMatches(newPost._id);
    matches.forEach(user => {
      emitNotification(user._id, 'new_post', {
        postId: newPost._id,
        message: `New trip to ${newPost.destination} matches your preferences`
      });
    });

    res.status(201).json({ 
      message: "Travel post created successfully", 
      post: await newPost.populate('creatorId', 'username profilePicture')
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating travel post", 
      error: error.message 
    });
  }
};

// Get All Travel Posts with Advanced Filtering
exports.getAllPosts = async (req, res) => {
  try {
    const { destination, startDate, endDate, style } = req.query;
    const filter = { status: "active" };
    
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (startDate) filter['travelDates.start'] = { $gte: new Date(startDate) };
    if (endDate) filter['travelDates.end'] = { $lte: new Date(endDate) };
    if (style) filter.travelStyle = style;

    const posts = await TravelPost.find(filter)
      .populate("creatorId", "username email profilePicture")
      .populate("matchedUsers.userId", "username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching posts", 
      error: error.message 
    });
  }
};

// Enhanced Match Request with Notifications
exports.requestMatch = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await TravelPost.findById(postId).populate('creatorId');

    if (!post) return res.status(404).json({ message: "Travel post not found" });
    if (post.creatorId._id.equals(req.user.id)) {
      return res.status(400).json({ message: "Cannot match with your own post" });
    }

    const existingMatch = post.matchedUsers.find(
      match => match.userId.equals(req.user.id)
    );
    
    if (existingMatch) {
      return res.status(400).json({ message: "You've already matched with this post" });
    }

    post.matchedUsers.push({
      userId: req.user.id,
      status: "pending"
    });

    await post.save();
    
    // Notify post owner
    emitNotification(post.creatorId._id, 'new_match', {
      postId: post._id,
      userId: req.user.id,
      message: `${req.user.username} wants to join your trip to ${post.destination}`
    });

    res.status(200).json({ 
      message: "Match request sent successfully", 
      post: await TravelPost.populate(post, {
        path: 'matchedUsers.userId',
        select: 'username profilePicture'
      })
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error sending match request", 
      error: error.message 
    });
  }
};

// Enhanced Match Response with Notifications
exports.respondToMatch = async (req, res) => {
  try {
    const { postId, matchId } = req.params;
    const { response } = req.body;

    const post = await TravelPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Travel post not found" });

    // Verify the requester is the post creator
    if (!post.creatorId.equals(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const match = post.matchedUsers.id(matchId);
    if (!match) return res.status(404).json({ message: "Match request not found" });

    // Update status
    match.status = response === "accept" ? "accepted" : "rejected";
    await post.save();

    // Notify the matched user
    emitNotification(match.userId, 'match_update', {
      postId: post._id,
      status: match.status,
      message: `Your match request for ${post.destination} was ${match.status}`
    });

    res.status(200).json({ 
      message: `Match request ${match.status} successfully`,
      post: await TravelPost.populate(post, {
        path: 'matchedUsers.userId',
        select: 'username profilePicture'
      })
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error processing match request", 
      error: error.message 
    });
  }
};

// Close a Travel Post
exports.closePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await TravelPost.findById(postId);

    if (!post) return res.status(404).json({ message: "Travel post not found" });
    if (!post.creatorId.equals(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    post.status = "closed";
    await post.save();

    res.status(200).json({ 
      message: "Post closed successfully",
      post 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error closing post", 
      error: error.message 
    });
  }
};

// Get User's Posts with Enhanced Data
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await TravelPost.find({ creatorId: req.user.id })
      .populate({
        path: 'matchedUsers.userId',
        select: 'username profilePicture age gender'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching user posts", 
      error: error.message 
    });
  }
};

// Get Matched Users with Advanced Filtering
exports.getMatchedUsers = async (req, res) => {
  try {
    const post = await TravelPost.findById(req.params.postId)
      .populate({
        path: 'matchedUsers.userId',
        select: 'username profilePicture age gender'
      });

    if (!post) return res.status(404).json({ message: "Travel post not found" });

    // Verify access rights
    if (!post.creatorId.equals(req.user.id) && 
        !post.matchedUsers.some(m => m.userId._id.equals(req.user.id))) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { status, sort } = req.query;
    let matchedUsers = post.matchedUsers;

    if (status) {
      matchedUsers = matchedUsers.filter(m => m.status === status);
    }

    if (sort === 'newest') {
      matchedUsers.sort((a, b) => b.matchedAt - a.matchedAt);
    }

    res.status(200).json({
      matchedUsers,
      count: matchedUsers.length
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching matched users",
      error: error.message
    });
  }
};