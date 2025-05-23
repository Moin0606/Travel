const express = require("express");
const { registerUser, loginUser,logout,checkAuth ,allUser ,acceptUser, rejectUser} = require("../controllers/userController");
const  protectRoute  = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);
router.get("/getusers",allUser);

router.post('/accept/:userId', acceptUser);
router.post('/reject/:userId', rejectUser);

module.exports = router;
