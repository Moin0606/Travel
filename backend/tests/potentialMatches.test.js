const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { findPotentialMatches } = require("../helpers/matchingAlgorithm");
const User = require("../models/userModel");
const TravelPost = require("../models/travelPostModel");

describe("findPotentialMatches", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await TravelPost.deleteMany({});
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
    console.log("Created Travel Post:", travelPost);

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
    console.log("Created Users:", await User.find({}));

    // Log all users in the database
    console.log("All Users in Database:", await User.find({}));

    // Test individual query conditions
    console.log(
      "Users matching age:",
      await User.find({
        age: {
          $gte: travelPost.requirements.minAge,
          $lte: travelPost.requirements.maxAge,
        },
      })
    );

    const genderCondition =
      travelPost.requirements.genderPreference === "any"
        ? {}
        : { gender: travelPost.requirements.genderPreference };
    console.log("Users matching gender:", await User.find(genderCondition));

    console.log(
      "Users matching destinations:",
      await User.find({
        "travelPreferences.destinations": travelPost.destination,
      })
    );

    console.log(
      "Users matching budget min:",
      await User.find({
        "travelPreferences.budgetRange.min": { $lte: travelPost.budget },
      })
    );

    console.log(
      "Users matching budget max:",
      await User.find({
        "travelPreferences.budgetRange.max": { $gte: travelPost.budget },
      })
    );

    // Call the function
    const matches = await findPotentialMatches(travelPost._id);
    console.log("Fetched Matches:", matches); // Log the matches returned by the function

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
});
