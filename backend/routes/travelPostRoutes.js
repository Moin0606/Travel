const express = require("express");
const { upload }= require('../middleware/uploadMiddleware');
const {
  createPost,
  getAllPosts,
  requestMatch,
  respondToMatch,
  getUserPosts,
  getMatchedUsers,
  closePost
} = require("../controllers/travelPostController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new travel post with optional images
 * @access  Private
 * @body    {String} destination - Required
 *          {Object} travelDates - Required {start: Date, end: Date}
 *          {String} [description]
 *          {Number} [budget]
 *          {String} [travelStyle]
 *          {Object} [requirements] - {minAge, maxAge, genderPreference}
 * @files   {Array} [images] - Up to 5 images
 * @returns {Object} 201 - Newly created post with populated creator
 * @returns {Object} 400 - Invalid input data
 * @returns {Object} 500 - Server error
 */
router.post("/", protect, upload.array('images', 5), createPost);

/**
 * @route   GET /api/posts
 * @desc    Get all active travel posts with filtering options
 * @access  Public
 * @query   {String} [destination] - Filter by destination (case-insensitive)
 *          {Date} [startDate] - Filter by trips starting after this date
 *          {Date} [endDate] - Filter by trips ending before this date
 *          {String} [style] - Filter by travel style
 * @returns {Array} 200 - Array of travel posts with populated creator and matches
 * @returns {Object} 500 - Server error
 */
router.get("/", getAllPosts);

/**
 * @route   GET /api/posts/my-posts
 * @desc    Get all posts created by the authenticated user
 * @access  Private
 * @returns {Array} 200 - Array of user's posts with populated match data
 * @returns {Object} 500 - Server error
 */
router.get("/my-posts", protect, getUserPosts);

/**
 * @route   POST /api/posts/:postId/matches
 * @desc    Request to match with a travel post
 * @access  Private
 * @params  {String} postId - Required ID of the post to match with
 * @returns {Object} 200 - Updated post with new match request
 * @returns {Object} 400 - Already matched or invalid request
 * @returns {Object} 404 - Post not found
 * @returns {Object} 500 - Server error
 */
router.post("/:postId/matches", protect, requestMatch);

/**
 * @route   PUT /api/posts/:postId/matches/:matchId
 * @desc    Respond to a match request (accept/reject)
 * @access  Private (post creator only)
 * @params  {String} postId - Required ID of the post
 *          {String} matchId - Required ID of the match request
 * @body    {String} response - Required "accept" or "reject"
 * @returns {Object} 200 - Updated post with modified match status
 * @returns {Object} 403 - Not authorized
 * @returns {Object} 404 - Post or match not found
 * @returns {Object} 500 - Server error
 */
router.put("/:postId/matches/:matchId", protect, respondToMatch);

/**
 * @route   GET /api/posts/:postId/matches
 * @desc    Get matched users for a specific post with filtering
 * @access  Private (post creator or matched users only)
 * @params  {String} postId - Required ID of the post
 * @query   {String} [status] - Filter by status ("pending"/"accepted"/"rejected")
 *          {String} [sort] - Sort by "newest"
 * @returns {Object} 200 - {matchedUsers: Array, count: Number}
 * @returns {Object} 403 - Not authorized
 * @returns {Object} 404 - Post not found
 * @returns {Object} 500 - Server error
 */
router.get("/:postId/matches", protect, getMatchedUsers);

/**
 * @route   PUT /api/posts/:postId/close
 * @desc    Close a travel post (mark as inactive)
 * @access  Private (post creator only)
 * @params  {String} postId - Required ID of the post
 * @returns {Object} 200 - Updated post with status "closed"
 * @returns {Object} 403 - Not authorized
 * @returns {Object} 404 - Post not found
 * @returns {Object} 500 - Server error
 */
router.put("/:postId/close", protect, closePost);

module.exports = router;