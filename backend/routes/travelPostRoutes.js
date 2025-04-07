const express = require("express");
const {
  createPost,
  getAllPosts,
  requestMatch,
  respondToMatch,
  getUserPosts,
  getMatchedUsers
} = require("../controllers/travelPostController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/posts/create
 * @desc    Create a new travel post
 * @access  Private
 * @body    {String} destination (required)
 *          {Object} travelDates {start: Date, end: Date} (required)
 *          {String} description
 *          {Number} budget
 *          {String} travelStyle
 *          {Object} requirements {minAge, maxAge, genderPreference}
 * @returns {Object} Created post object
 */
router.post("/create", protect, createPost);

/**
 * @route   GET /api/posts/
 * @desc    Get all travel posts with populated creator and match info
 * @access  Public
 * @returns {Array} List of all travel posts
 */
router.get("/", getAllPosts);

/**
 * @route   GET /api/posts/my-posts
 * @desc    Get all posts created by current user
 * @access  Private
 * @returns {Array} List of user's travel posts with match requests
 */
router.get("/my-posts", protect, getUserPosts);

/**
 * @route   POST /api/posts/request-match/:postId
 * @desc    Send match request to a travel post
 * @access  Private
 * @params  {String} postId (required)
 * @returns {Object} Updated post with new match request
 */
router.post("/request-match/:postId", protect, requestMatch);

/**
 * @route   PUT /api/posts/respond-match/:postId
 * @desc    Accept or reject a match request
 * @access  Private (post creator only)
 * @params  {String} postId (required)
 * @body    {String} userId (required) - ID of user who requested match
 *          {String} response (required) - "accept" or "reject"
 * @returns {Object} Updated post with modified match status
 */
router.put("/respond-match/:postId", protect, respondToMatch);

/**
 * @route   GET /api/posts/:postId/matches
 * @desc    Get all matched users for a specific travel post
 * @access  Private (only post creator or matched users should access)
 * 
 * @params  {String} postId - Required. ID of the travel post
 * @query   {String} [status] - Optional. Filter matches by status ("pending"/"accepted"/"rejected")
 * 
 * @returns {Object} On success:
 *                   - matchedUsers: {Array} List of matched users with populated user details
 *                   - count: {Number} Total number of matches (after filtering)
 * @returns {Object} On error:
 *                   - message: {String} Error description
 * 
 * @example GET /api/posts/507f1f77bcf86cd799439011/matches
 * @example GET /api/posts/507f1f77bcf86cd799439011/matches?status=accepted
 */
router.get('/:postId/matches', protect, getMatchedUsers);

module.exports = router;