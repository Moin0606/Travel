const express = require("express");
const {
  createPost,
  getAllPosts,
  requestMatch,
  acceptRequest,
} = require("../controllers/travelPostController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createPost);
router.get("/", getAllPosts);
router.post("/request-match/:postId", protect, requestMatch);
router.put("/accept-request/:postId", protect, acceptRequest);

module.exports = router;
