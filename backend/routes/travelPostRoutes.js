const express = require("express");
const router = express.Router();
const travelPostController = require("../controllers/travelPostController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, travelPostController.createTravelPost);
router.patch("/:postId/close", protect, travelPostController.closeTravelPost);

module.exports = router;