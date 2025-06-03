const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); 
const TravelPost = require("../models/travelPostModel");
const User = require("../models/userModel");
const { generateToken } = require("../config/utils");  

describe("Travel Post Controller (Integration Tests)", () => { 
  let token, mockUser, mockRes;

  beforeAll(async () => {
    // Create a mock user in the database
    mockUser = {
      _id: new mongoose.Types.ObjectId(),
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
      username: "testuser",
    };
    await User.create(mockUser);
    console.log("Mock User Created:", mockUser);

    // Create a mock response object
    mockRes = {
      cookie: jest.fn(), // Mock the `cookie` method
    };

    // Generate a token for the mock user
    token = generateToken(mockUser._id.toString(), mockRes); 
    console.log("Generated Token:", token);

    // Verify that the `cookie` method was called
    expect(mockRes.cookie).toHaveBeenCalledWith(
      "jwt", // Cookie name
      token, // Token value
      {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      }
    );
  });

  afterAll(async () => { 
    await mongoose.disconnect();
  });

  afterEach(async () => { 
  });

  describe("POST /api/posts", () => {
    it("should create a new travel post successfully", async () => {
      const mockPostData = {
        creatorId: new mongoose.Types.ObjectId(),
        destination: "Paris",
        travelDates: { start: "2024-01-01", end: "2024-01-10" },
        description: "Exploring Paris!",
        budget: 1500,
      };

      const res = await request(app)
        .post("/api/posts")
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .send(mockPostData)
        .expect(201);

      expect(res.body.message).toBe("Travel post created successfully");
      expect(res.body.travelPost.destination).toBe("Paris");
      expect(res.body.travelPost.creatorId).toBe(mockUser._id.toString());

      // Verify the post was saved in the database
      const savedPost = await TravelPost.findById(res.body.travelPost._id);
      expect(savedPost).not.toBeNull();
      expect(savedPost.destination).toBe("Paris");
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/posts")
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .send({})
        .expect(400);

      expect(res.body.message).toBe(
        "Destination and travel dates (start & end) are required."
      );
    });
  });

  describe("GET /api/posts", () => {
    it("should fetch all travel posts successfully", async () => {
      // Create a sample travel post in the database
      const mockPost = new TravelPost({
        creatorId: mockUser._id,
        destination: "Paris",
        travelDates: { start: "2024-01-01", end: "2024-01-10" },
        budget: 1500,
      });
      await mockPost.save();

      const res = await request(app)
        .get("/api/posts")
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .expect(200);

      expect(res.body.count).toBe(1);
      expect(res.body.travelPosts[0].destination).toBe("Paris");
    });

    it("should filter travel posts by budget range", async () => {
      // Create two sample travel posts
      const mockPost1 = new TravelPost({
        creatorId: mockUser._id,
        destination: "Paris",
        travelDates: { start: "2024-01-01", end: "2024-01-10" },
        budget: 1500,
      });
      const mockPost2 = new TravelPost({
        creatorId: mockUser._id,
        destination: "London",
        travelDates: { start: "2024-02-01", end: "2024-02-10" },
        budget: 2500,
      });
      await mockPost1.save();
      await mockPost2.save();

      const res = await request(app)
        .get("/api/posts?budget=1000,2000")
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .expect(200);

      expect(res.body.count).toBe(1);
      expect(res.body.travelPosts[0].destination).toBe("Paris");
    });
  });

  describe("DELETE /api/posts/:postId", () => {
    it("should delete a travel post successfully", async () => {
      // Create a sample travel post
      const mockPost = new TravelPost({
        creatorId: mockUser._id,
        destination: "Paris",
        travelDates: { start: "2024-01-01", end: "2024-01-10" },
        budget: 1500,
      });
      await mockPost.save();

      const res = await request(app)
        .delete(`/api/posts/${mockPost._id}`)
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .expect(200);

      expect(res.body.message).toBe("Travel post deleted successfully");

      // Verify the post was deleted from the database
      const deletedPost = await TravelPost.findById(mockPost._id);
      expect(deletedPost).toBeNull();
    });

    it("should return 404 if travel post is not found", async () => {
      const fakePostId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/posts/${fakePostId}`)
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .expect(404);

      expect(res.body.message).toBe("Travel post not found");
    });
  });

  describe("PATCH /api/posts/:postId/close", () => {
    it("should close a travel post successfully", async () => {
      // Create a sample travel post
      const mockPost = new TravelPost({
        creatorId: mockUser._id,
        destination: "Paris",
        travelDates: { start: "2024-01-01", end: "2024-01-10" },
        budget: 1500,
      });
      await mockPost.save();

      const res = await request(app)
        .patch(`/api/posts/${mockPost._id}/close`)
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .expect(200);

      expect(res.body.message).toBe("Travel post closed successfully");
      expect(res.body.travelPost.status).toBe("closed");

      // Verify the post status was updated in the database
      const updatedPost = await TravelPost.findById(mockPost._id);
      expect(updatedPost.status).toBe("closed");
    });

    it("should return 404 if travel post is not found", async () => {
      const fakePostId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .patch(`/api/posts/${fakePostId}/close`)
        .set("Cookie", [`jwt=${token}`]) // Include the token
        .expect(404);

      expect(res.body.message).toBe("Travel post not found");
    });
  });
});