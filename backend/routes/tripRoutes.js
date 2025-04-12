const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.get("/user/:userId", tripController.getUserTrips);

module.exports = router;