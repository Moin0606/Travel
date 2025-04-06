const express = require("express");
const {
  sendMessage,
  getChatHistory,
} = require("../controllers/chatController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/history", protect, getChatHistory);

module.exports = router;
