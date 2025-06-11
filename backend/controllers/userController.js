const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/utils");
const cloudinary = require("../config/cloudinary");

const registerUser = async (req, res) => {
  console.log("📥 Incoming request body:", req.body);
  console.log("🖼️ req.files:", req.files);
  console.log("☁️ Cloudinary URL:", req.cloudinaryUrl);
  console.log("📄 Document URL:", req.docUrl);

  const {
    username,
    email,
    password,
    age,
    gender,
    address,
    phoneNumber,
    travelPreferences,
    role,
  } = req.body;

  console.log("🧾 Raw travelPreferences:", travelPreferences);

  // Validate basic fields
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Missing required fields",
      missing: { username: !username, email: !email, password: !password },
    });
  }

  let travelPreferencesObj = {};
  try {
    travelPreferencesObj = JSON.parse(travelPreferences);
  } catch (err) {
    console.error("❌ Failed to parse travelPreferences:", err.message);
    return res.status(400).json({ message: "Invalid travelPreferences format" });
  }

  const { destinations, budgetRange, travelStyles } = travelPreferencesObj;


  const parsedBudgetRange = {
  min: parseFloat(budgetRange?.min),
  max: parseFloat(budgetRange?.max),
  };

  travelPreferencesObj.budgetRange = parsedBudgetRange;

    console.log("🗺️ Parsed travelPreferences:", travelPreferencesObj);

  const parsedAge = parseInt(age);

  console.log("🎯 Destinations:", destinations);
  console.log("💰 Budget Range:", parsedBudgetRange);
  console.log("🧳 Travel Styles:", travelStyles);
  console.log("Age: ", parsedAge);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log('past existing user check');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('hashed');
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: req.cloudinaryUrl,
      age: parsedAge,
      gender,
      address,
      phoneNumber,
      verificationDocument: req.docUrl,
      travelPreferences: travelPreferencesObj,
      role,
    });
    console.log('new user obj created');
    const validationError = newUser.validateSync();
    if (validationError) {
      console.error("❌ Validation failed:", validationError);
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(validationError.errors).map(e => ({
          path: e.path,
          message: e.message
        }))
      });
    }

    console.log("📦 New user object:", newUser.toObject());

    await newUser.save();
    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });
} catch (error) {
  console.error("🔥 Registration Error:", {
    message: error.message,
    name: error.name,
    errors: error.errors ? Object.entries(error.errors).map(([field, err]) => ({
      field,
      message: err.message
    })) : null,
    stack: error.stack,
  });

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(error.errors).map(e => e.message)
    });
  }

  return res.status(500).json({
    message: "Error registering user",
    error: error.message
  });
}
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    generateToken(user._id, res);

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, res),
      role: user.role,
    });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    return res.status(400).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    console.log("Logout Successfully");
    return res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log("Error in Logout controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
    // console.log("req.user : ", req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const allUser = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// userController.js
const acceptUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User verified successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User rejected successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    // console.log("req.body", req.body);

    // console.log("profile pic", profilePic);

    const userId = req.user._id;
    // console.log("userId", userId);

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Picture is required" });
    }

    const response = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: response.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logout,
  // updateProfile,
  checkAuth,
  allUser,
  acceptUser,
  rejectUser,
  updateProfile,
};
