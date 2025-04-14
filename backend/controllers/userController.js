const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/utils");

const registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    profilePicture,
    age,
    gender,
    address,
    phoneNumber,
    verificationDocument,
    role
  }  = req.body;


  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const user = await User.create({
    //   username,
    //   email,
    //   password: hashedPassword,
    // });
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      age,
      gender,
      address,
      phoneNumber,
      verificationDocument,
      role,
    });
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      return res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        
      });
    } else {
      return res.status(400).json({ message: "User registration failed" });
    }
    // res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error in register controller:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
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
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, res),
      role:user.role
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
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  // updateProfile,
  checkAuth,
  allUser
};
