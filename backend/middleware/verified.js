// Middleware to check if the user is verified
const isVerified = async (req, res, next) => {
  try {
    // The `protect` middleware ensures `req.user` exists
    const user = req.user;

    if (!user.isVerified) {
      return res.status(403).json({ message: "User is not verified" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in isVerified middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = isVerified;
