const express = require("express");
const { registerUser, loginUser,logout,checkAuth ,allUser ,acceptUser, rejectUser} = require("../controllers/userController");
const  protectRoute  = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadConfig");
const cloudinaryUpload = require("../middleware/cloudinary");

const router = express.Router();

router.post(
  "/register",
  upload,             // First: Parse form data and files
  cloudinaryUpload,   // Second: Upload to Cloudinary
  registerUser        // Third: Handle registration
);

router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);
router.get("/getusers",allUser);

router.post('/accept/:userId', acceptUser);
router.post('/reject/:userId', rejectUser);

module.exports = router;
