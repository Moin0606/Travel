const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    console.log(decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports =  protectRoute ;