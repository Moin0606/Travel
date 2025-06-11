const express = require("express");
const router = express.Router();
const travelPostController = require("../controllers/travelPostController");
const protect = require("../middleware/authMiddleware");
const cloudinaryUpload = require('../middleware/cloudinary');
const upload = require('../middleware/uploadConfig');
/**
 * @route   POST /posts
 * @desc    Create a new travel post.
 * @access  Private (requires authentication)
 * @body    {string} destination - The destination of the travel post.
 * @body    {object} travelDates - The start and end dates of the trip.
 * @body    {string} travelDates.start - The start date of the trip (ISO 8601 format).
 * @body    {string} travelDates.end - The end date of the trip (ISO 8601 format).
 * @body    {string} [image] - Optional image URL for the travel post.
 * @body    {string} [description] - Optional description of the travel post.
 * @body    {number} [budget] - Optional budget for the trip.
 * @body    {string} [travelStyle] - Optional travel style (e.g., "adventure", "luxury").
 * @body    {object} [requirements] - Optional requirements for potential matches.
 * @body    {number} [requirements.minAge] - Minimum age requirement.
 * @body    {number} [requirements.maxAge] - Maximum age requirement.
 * @body    {string} [requirements.genderPreference] - Gender preference (e.g., "male", "female", "any").
 * @returns {object} Created travel post object with the following fields:
 *          - _id {string}: The unique ID of the travel post.
 *          - creatorId {string}: The ID of the user who created the post.
 *          - destination {string}: The destination of the travel post.
 *          - travelDates {object}: The start and end dates of the trip.
 *          - image {string}: Optional image URL for the travel post.
 *          - description {string}: Optional description of the travel post.
 *          - budget {number}: Optional budget for the trip.
 *          - travelStyle {string}: Optional travel style.
 *          - requirements {object}: Optional requirements for potential matches.
 *          - status {string}: The status of the travel post ("active" or "closed").
 *          - createdAt {string}: The timestamp when the post was created.
 *          - updatedAt {string}: The timestamp when the post was last updated.
 */
router.post("/", protect, upload, cloudinaryUpload, travelPostController.createTravelPost);

/**
 * @route   GET /posts
 * @desc    Get all travel posts with optional filters.
 * @access  Public
 * @query   {string} [creatorId] - Filter by the ID of the user who created the post.
 * @query   {string} [budget] - Filter by budget range (format: "min,max").
 * @query   {string} [travelStyle] - Filter by travel style (e.g., "adventure", "luxury").
 * @query   {number} [minAge] - Filter by minimum age requirement.
 * @query   {number} [maxAge] - Filter by maximum age requirement.
 * @query   {string} [genderPreference] - Filter by gender preference (e.g., "male", "female", "any").
 * @query   {string} [description] - Perform a case-insensitive text search in the description.
 * @returns {object} List of filtered travel posts with the following fields:
 *          - count {number}: Total number of matching travel posts.
 *          - travelPosts {array}: Array of travel post objects.
 *            - _id {string}: The unique ID of the travel post.
 *            - creatorId {string}: The ID of the user who created the post.
 *            - destination {string}: The destination of the travel post.
 *            - travelDates {object}: The start and end dates of the trip.
 *            - image {string}: Optional image URL for the travel post.
 *            - description {string}: Optional description of the travel post.
 *            - budget {number}: Optional budget for the trip.
 *            - travelStyle {string}: Optional travel style.
 *            - requirements {object}: Optional requirements for potential matches.
 *            - status {string}: The status of the travel post ("active" or "closed").
 *            - createdAt {string}: The timestamp when the post was created.
 *            - updatedAt {string}: The timestamp when the post was last updated.
 */
router.get("/", travelPostController.getAllTravelPosts);

/**
 * @route   DELETE /posts/:postId
 * @desc    Delete a travel post by ID.
 * @access  Private (requires authentication)
 * @param   {string} postId - The ID of the travel post to delete.
 * @returns {object} Deleted travel post object with the following fields:
 *          - _id {string}: The unique ID of the travel post.
 *          - creatorId {string}: The ID of the user who created the post.
 *          - destination {string}: The destination of the travel post.
 *          - travelDates {object}: The start and end dates of the trip.
 *          - image {string}: Optional image URL for the travel post.
 *          - description {string}: Optional description of the travel post.
 *          - budget {number}: Optional budget for the trip.
 *          - travelStyle {string}: Optional travel style.
 *          - requirements {object}: Optional requirements for potential matches.
 *          - status {string}: The status of the travel post ("active" or "closed").
 *          - createdAt {string}: The timestamp when the post was created.
 *          - updatedAt {string}: The timestamp when the post was last updated.
 */
router.delete("/:postId", protect, travelPostController.deleteTravelPost);

/**
 * @route   PATCH /posts/:postId
 * @desc    Update a travel post by ID.
 * @access  Private (requires authentication)
 * @param   {string} postId - The ID of the travel post to update.
 * @body    {string} [destination] - Updated destination of the travel post.
 * @body    {object} [travelDates] - Updated start and end dates of the trip.
 * @body    {string} [travelDates.start] - Updated start date of the trip (ISO 8601 format).
 * @body    {string} [travelDates.end] - Updated end date of the trip (ISO 8601 format).
 * @body    {string} [image] - Updated image URL for the travel post.
 * @body    {string} [description] - Updated description of the travel post.
 * @body    {number} [budget] - Updated budget for the trip.
 * @body    {string} [travelStyle] - Updated travel style (e.g., "adventure", "luxury").
 * @body    {object} [requirements] - Updated requirements for potential matches.
 * @body    {number} [requirements.minAge] - Updated minimum age requirement.
 * @body    {number} [requirements.maxAge] - Updated maximum age requirement.
 * @body    {string} [requirements.genderPreference] - Updated gender preference (e.g., "male", "female", "any").
 * @returns {object} Updated travel post object with the following fields:
 *          - _id {string}: The unique ID of the travel post.
 *          - creatorId {string}: The ID of the user who created the post.
 *          - destination {string}: The destination of the travel post.
 *          - travelDates {object}: The start and end dates of the trip.
 *          - image {string}: Optional image URL for the travel post.
 *          - description {string}: Optional description of the travel post.
 *          - budget {number}: Optional budget for the trip.
 *          - travelStyle {string}: Optional travel style.
 *          - requirements {object}: Optional requirements for potential matches.
 *          - status {string}: The status of the travel post ("active" or "closed").
 *          - createdAt {string}: The timestamp when the post was created.
 *          - updatedAt {string}: The timestamp when the post was last updated.
 */
router.patch("/:postId", protect, travelPostController.updateTravelPost);

/**
 * @route   PATCH /posts/:postId/close
 * @desc    Close a travel post by ID (set status to "closed").
 * @access  Private (requires authentication)
 * @param   {string} postId - The ID of the travel post to close.
 * @returns {object} Updated travel post object with the following fields:
 *          - _id {string}: The unique ID of the travel post.
 *          - creatorId {string}: The ID of the user who created the post.
 *          - destination {string}: The destination of the travel post.
 *          - travelDates {object}: The start and end dates of the trip.
 *          - image {string}: Optional image URL for the travel post.
 *          - description {string}: Optional description of the travel post.
 *          - budget {number}: Optional budget for the trip.
 *          - travelStyle {string}: Optional travel style.
 *          - requirements {object}: Optional requirements for potential matches.
 *          - status {string}: The status of the travel post ("closed").
 *          - createdAt {string}: The timestamp when the post was created.
 *          - updatedAt {string}: The timestamp when the post was last updated.
 */
router.patch("/:postId/close", protect, travelPostController.closeTravelPost);

module.exports = router;