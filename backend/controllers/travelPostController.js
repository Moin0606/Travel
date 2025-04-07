const TravelPost = require("../models/travelPostModel");

// Create a Travel Post
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
      status: "active" // Default status
    });

    await newPost.save();
    res.status(201).json({ message: "Travel post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating travel post", 
      error: error.message 
    });
  }
};

// Get All Travel Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await TravelPost.find()
      .populate("creatorId", "username email profilePicture")
      .populate("matchedUsers.userId", "username profilePicture");
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching posts", 
      error: error.message 
    });
  }
};

// Request a Match
exports.requestMatch = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await TravelPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    // Check if user already matched with this post
    const existingMatch = post.matchedUsers.find(
      match => match.userId.toString() === req.user.id
    );
    
    if (existingMatch) {
      return res.status(400).json({ message: "You've already matched with this post" });
    }

    // Add new match request
    post.matchedUsers.push({
      userId: req.user.id,
      status: "pending"
    });

    await post.save();
    
    res.status(200).json({ 
      message: "Match request sent successfully", 
      post 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error sending match request", 
      error: error.message 
    });
  }
};

// Accept/Reject a Match Request
exports.respondToMatch = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, response } = req.body; // response = "accept" or "reject"

    const post = await TravelPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    // Verify the requester is the post creator
    if (post.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Find the match request
    const matchRequest = post.matchedUsers.find(
      match => match.userId.toString() === userId
    );

    if (!matchRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    // Update status based on response
    matchRequest.status = response === "accept" ? "accepted" : "rejected";
    await post.save();

    res.status(200).json({ 
      message: `Match request ${response === "accept" ? "accepted" : "rejected"} successfully`,
      post 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error processing match request", 
      error: error.message 
    });
  }
};

// Get Posts by User
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await TravelPost.find({ creatorId: req.user.id })
      .populate("matchedUsers.userId", "username profilePicture");
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching user posts", 
      error: error.message 
    });
  }
};

// Get matched users for a specific post
exports.getMatchedUsers = async (req, res) => {
  try {
    const post = await TravelPost.findById(req.params.postId)
      .populate({
        path: 'matchedUsers.userId',
        select: 'username profilePicture age gender' // Include fields you want to display
      })
      .select('matchedUsers'); // Only return matchedUsers array

    if (!post) {
      return res.status(404).json({ message: "Travel post not found" });
    }

    // Filter based on status if query parameter exists
    const statusFilter = req.query.status; // e.g., ?status=accepted
    let matchedUsers = post.matchedUsers;
    
    if (statusFilter) {
      matchedUsers = post.matchedUsers.filter(
        match => match.status === statusFilter
      );
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