// testUtils.js
const jwt = require("jsonwebtoken");

// Helper function to generate a mock token
module.exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "1h",
  });
};
