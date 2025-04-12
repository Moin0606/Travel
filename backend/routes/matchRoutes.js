const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

/**
 * @route   PATCH /matches/:matchId/status
 * @desc    Update the status of a specific match (e.g., accept, reject, or set to pending).
 * @access  Private (requires authentication)
 * @param   {string} matchId - The ID of the match to update.
 * @body    {string} status - The new status of the match ("accepted", "rejected", or "pending").
 * @returns {object} Updated match object with the following fields:
 *          - _id {string}: The unique ID of the match.
 *          - userId {string}: The ID of the user associated with the match.
 *          - postId {string}: The ID of the travel post associated with the match.
 *          - status {string}: The updated status of the match.
 *          - createdAt {string}: The timestamp when the match was created.
 *          - updatedAt {string}: The timestamp when the match was last updated.
 */
router.patch("/:matchId/status", matchController.updateMatchStatus);

/**
 * @route   POST /matches/approve/:matchId
 * @desc    Approve a match. If both users approve, a trip is created.
 * @access  Private (requires authentication)
 * @param   {string} matchId - The ID of the match to approve.
 * @returns {object} Updated match object with the following fields:
 *          - _id {string}: The unique ID of the match.
 *          - userId {string}: The ID of the user associated with the match.
 *          - postId {string}: The ID of the travel post associated with the match.
 *          - status {string}: The updated status of the match.
 *          - createdAt {string}: The timestamp when the match was created.
 *          - updatedAt {string}: The timestamp when the match was last updated.
 */
router.post("/approve/:matchId", matchController.approveMatch);

/**
 * @route   POST /matches/create
 * @desc    Manually create a match for a user (status: accepted) and the travel post creator (status: pending).
 * @access  Private (requires authentication)
 * @body    {string} postId - The ID of the travel post.
 * @body    {string} userId - The ID of the user to create the match for.
 * @returns {object} Object containing two match objects:
 *          - matchForRequestingUser {object}: Match object for the requesting user with the following fields:
 *              - _id {string}: The unique ID of the match.
 *              - userId {string}: The ID of the requesting user.
 *              - postId {string}: The ID of the travel post.
 *              - status {string}: The status of the match ("accepted").
 *              - createdAt {string}: The timestamp when the match was created.
 *              - updatedAt {string}: The timestamp when the match was last updated.
 *          - matchForCreator {object}: Match object for the travel post creator with the following fields:
 *              - _id {string}: The unique ID of the match.
 *              - userId {string}: The ID of the travel post creator.
 *              - postId {string}: The ID of the travel post.
 *              - status {string}: The status of the match ("pending").
 *              - createdAt {string}: The timestamp when the match was created.
 *              - updatedAt {string}: The timestamp when the match was last updated.
 */
router.post("/create", matchController.createMatchManually);

/**
 * @route   GET /matches/user
 * @desc    Fetch all matches for the authenticated user.
 * @access  Private (requires authentication)
 * @returns {array} List of match objects, where each match contains the following fields:
 *          - _id {string}: The unique ID of the match.
 *          - userId {string}: The ID of the user associated with the match.
 *          - postId {string}: The ID of the travel post associated with the match.
 *          - status {string}: The status of the match ("pending", "accepted", or "rejected").
 *          - createdAt {string}: The timestamp when the match was created.
 *          - updatedAt {string}: The timestamp when the match was last updated.
 */
router.get("/user", matchController.getUserMatches);

/**
 * @route   GET /matches/:postId/other-user-status
 * @desc    Get the match status of the other user for a given travel post.
 * @access  Private (requires authentication)
 * @param   {string} postId - The ID of the travel post.
 * @returns {object} Object containing the status of the other user's match:
 *          - message {string}: A success message indicating the status was retrieved.
 *          - status {string}: The status of the other user's match ("pending", "accepted", or "rejected").
 */
router.get("/:postId/other-user-status", matchController.getOtherUserMatchStatus);

module.exports = router;