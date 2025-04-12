const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.patch("/:matchId/status", matchController.updateMatchStatus);

router.get("/user", matchController.getUserMatches);


module.exports = router;