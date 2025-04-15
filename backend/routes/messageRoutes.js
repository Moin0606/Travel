const express = require("express");
const  protectRoute  = require("../middleware/authMiddleware");
const {
  getMessages,
  getUserForSidebar,
  sendMessages,
  // getAllConnectedUsers,
} = require("../controllers/messageController");

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);
// router.get("/usersConnected", protectRoute, getAllConnectedUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);

module.exports = router;
