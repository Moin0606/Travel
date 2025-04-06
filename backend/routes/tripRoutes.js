const express = require("express");
const {
  createTrip,
  getTrip,
  updateTrip,
  joinTrip,
  leaveTrip,
} = require("../controllers/tripController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createTrip);
router.get("/:tripId", protect, getTrip);
router.put("/:tripId", protect, updateTrip);
router.post("/join/:tripId", protect, joinTrip);
router.delete("/leave/:tripId", protect, leaveTrip);

module.exports = router;
