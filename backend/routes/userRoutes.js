const express = require("express");
const { registerUser, loginUser,logout,checkAuth } = require("../controllers/userController");
const  protectRoute  = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

module.exports = router;
