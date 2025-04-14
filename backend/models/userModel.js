const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  age: { type: Number },
  address: { type: String },
  phoneNumber: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "user" },
  gender : {type : String},

  // Track posts this user has matched with
  matchedPosts: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "TravelPost" },
      matchedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],

  // Travel preferences (for matching algorithm)
  travelPreferences: {
    destinations: [{ type: String }],
    budgetRange: { min: Number, max: Number },
    travelStyles: [{ type: String }], // e.g., "solo", "group", "luxury"
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
