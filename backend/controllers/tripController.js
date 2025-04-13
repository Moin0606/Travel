const Trip = require("../models/tripModel");

// Get all trips for a specific user
exports.getUserTrips = async (req, res) => {
  try {
    const { userId } = req.params;

    const trips = await Trip.find({ participants: userId }).populate("postId", "destination");
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trips", error });
  }
};