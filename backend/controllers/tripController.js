const Trip = require("../models/tripModel");

// Create a Trip
exports.createTrip = async (req, res) => {
  try {
    const {
      destination,
      travelDates,
      budget,
      accommodationDetails,
      checklist,
    } = req.body;

    const newTrip = new Trip({
      creatorId: req.user.id,
      destination,
      travelDates,
      budget,
      accommodationDetails,
      checklist,
      participants: [req.user.id], // Creator is automatically a participant
    });

    await newTrip.save();
    res
      .status(201)
      .json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message });
  }
};

// Get Trip Details
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate(
      "participants",
      "username email"
    );
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.status(200).json(trip);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching trip details", error: error.message });
  }
};

// Update Trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.creatorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this trip" });
    }

    Object.assign(trip, req.body);
    await trip.save();

    res.status(200).json({ message: "Trip updated successfully", trip });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating trip", error: error.message });
  }
};

// Join a Trip
exports.joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.participants.includes(req.user.id)) {
      return res.status(400).json({ message: "You are already a participant" });
    }

    trip.participants.push(req.user.id);
    await trip.save();

    res.status(200).json({ message: "Joined trip successfully", trip });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error joining trip", error: error.message });
  }
};

// Leave a Trip
exports.leaveTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (!trip.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You are not a participant of this trip" });
    }

    // Prevent the creator from leaving
    if (trip.creatorId.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "Trip creator cannot leave the trip" });
    }

    trip.participants = trip.participants.filter(
      (id) => id.toString() !== req.user.id
    );
    await trip.save();

    res.status(200).json({ message: "Left trip successfully", trip });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error leaving trip", error: error.message });
  }
};
