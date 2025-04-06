const TravelPost = require("../models/travelPostModel");

// Create a Travel Post
exports.createPost = async (req, res) => {
  try {
    const { destination, description, images } = req.body;
    const newPost = new TravelPost({
      userId: req.user.id,
      destination,
      description,
      images,
    });

    await newPost.save();
    res.status(201).json({ message: "Travel post created", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Get All Travel Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await TravelPost.find().populate("userId", "username email");
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// Request a Match
exports.requestMatch = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await TravelPost.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if match request already exists
    const existingRequest = post.matchRequests.find(
      (req) => req.userId.toString() === req.user.id
    );
    if (existingRequest)
      return res.status(400).json({ message: "Match request already sent" });

    post.matchRequests.push({ userId: req.user.id, status: "pending" });
    await post.save();

    res.status(200).json({ message: "Match request sent", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending match request", error: error.message });
  }
};

// Accept a Match Request
exports.acceptRequest = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // ID of the user whose request is accepted

    const post = await TravelPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const request = post.matchRequests.find(
      (r) => r.userId.toString() === userId
    );
    if (!request)
      return res.status(404).json({ message: "Match request not found" });

    request.status = "accepted";
    await post.save();

    res.status(200).json({ message: "Match request accepted", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting request", error: error.message });
  }
};
