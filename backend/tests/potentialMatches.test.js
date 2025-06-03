const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { findPotentialMatches } = require("../helpers/matchingAlgorithm");
const User = require("../models/userModel");
const TravelPost = require("../models/travelPostModel");
const Match = require("../models/matchModel");
const approveMatch = require("../helpers/approveMatch"); 
const Trip = require("../models/tripModel"); 
const connectDB = require("../config/db");
require("dotenv").config();

describe("findPotentialMatches", () => {
  let mongoServer;

  beforeAll(async () => {
    connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => { 
  });

  it("should find potential matches based on age, gender, and preferences", async () => {
    // Create a mock travel post
    const travelPost = new TravelPost({
      creatorId: new mongoose.Types.ObjectId(),
      destination: "Paris",
      travelDates: { start: new Date(), end: new Date() },
      description: "Exploring Paris!",
      budget: 1500,
      travelStyle: "luxury",
      requirements: {
        minAge: 25,
        maxAge: 40,
        genderPreference: "any",
      },
    });
    await travelPost.save(); 

    // Create mock users
    const user1 = new User({
      username: "Alice",
      email: "alice@example.com",
      password: "password123",
      age: 30,
      gender: "female",
      travelPreferences: {
        destinations: ["Paris"],
        budgetRange: { min: 1000, max: 2000 },
        travelStyles: ["luxury"],
      },
    });
    await user1.save();

    const user2 = new User({
      username: "Bob",
      email: "bob@example.com",
      password: "password123",
      age: 50,
      gender: "male",
      travelPreferences: {
        destinations: ["Tokyo"],
        budgetRange: { min: 1000, max: 2000 },
        travelStyles: ["backpacking"],
      },
    });
    await user2.save(); 


    // Call the function
    const matches = await findPotentialMatches(travelPost._id); 

    // Assertions
    expect(matches.length).toBe(1); // Only Alice matches the criteria
    expect(matches[0].userId.toString()).toBe(user1._id.toString());
    expect(matches[0].matchScore).toBeGreaterThan(50);
  });

  it("should return an empty array if no matches are found", async () => {
    // Create a mock travel post
    const travelPost = new TravelPost({
      creatorId: new mongoose.Types.ObjectId(),
      destination: "Paris",
      travelDates: { start: new Date(), end: new Date() },
      description: "Exploring Paris!",
      budget: 1500,
      travelStyle: "luxury",
      requirements: {
        minAge: 25,
        maxAge: 40,
        genderPreference: "female",
      },
    });
    await travelPost.save();

    // Create a mock user who does not meet the criteria
    const user1 = new User({
      username: "Charlie",
      email: "charlie@example.com",
      password: "password123",
      age: 30,
      gender: "male", // Does not meet gender preference
      travelPreferences: {
        destinations: ["Paris"],
        budgetRange: { min: 1000, max: 2000 },
        travelStyles: ["luxury"],
      },
    });
    await user1.save();

    // Call the function
    const matches = await findPotentialMatches(travelPost._id);

    // Assertions
    expect(matches.length).toBe(0); // No matches found
  });

  it("should create a trip when both users approve the match", async () => {
    const user1Id = new mongoose.Types.ObjectId();
    const user2Id = new mongoose.Types.ObjectId(); 
    // Create mock users
    const user1 = new User({
      _id: user1Id,
      username: "Alice",
      email: "alice@example.com",
      password: "password123",
      age: 30,
      gender: "female",
      travelPreferences: {
        destinations: ["Paris"],
        budgetRange: { min: 1000, max: 2000 },
        travelStyles: ["luxury"],
      },
    });
    await user1.save();
    
    const travelPost = new TravelPost({
      creatorId: user1._id, // Set the creatorId to the first user's ID
      destination: "Paris",
      travelDates: { start: new Date(), end: new Date() },
      description: "Exploring Paris!",
      budget: 1500,
      travelStyle: "luxury",
      requirements: {
        minAge: 25,
        maxAge: 40,
        genderPreference: "any",
      },
    });
    await travelPost.save();

    const user2 = new User({
      _id: user2Id,
      username: "Bob",
      email: "bob@example.com",
      password: "password123",
      age: 35,
      gender: "male",
      travelPreferences: {
        destinations: ["Paris"],
        budgetRange: { min: 1000, max: 2000 },
        travelStyles: ["luxury"],
      },
    });
    await user2.save();
  
    // Find potential matches
    const matches = await findPotentialMatches(travelPost._id);
  
    // Approve the match from both sides
    const match1 = await Match.findOne({ userId: user1._id });
    const match2 = await Match.findOne({ userId: user2._id });
  
    await approveMatch(user1._id, match1._id); // User 1 approves
    await approveMatch(user2._id, match2._id); // User 2 approves
  
    // Verify that a trip was created
    const trip = await Trip.findOne({ postId: travelPost._id });
    expect(trip).toBeDefined();
    expect(trip.participants.map((id) => id.toString())).toEqual(
      expect.arrayContaining([user1._id.toString(), user2._id.toString()])
    );
    expect(trip.status).toBe("active");
  });
});
