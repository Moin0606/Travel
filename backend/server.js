require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const http = require("http");
const cookieParser = require('cookie-parser');
const protect = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const travelPostRoutes = require("./routes/travelPostRoutes");
const tripRoutes = require("./routes/tripRoutes");
const messageRoutes = require("./routes/messageRoutes");
const matchRoutes = require("./routes/matchRoutes");


const hotelRoutes=require("./routes/hotelRoutes");
const bookingRoutes=require("./routes/bookingRoutes");

const { app, server } = require("./config/socket"); 



connectDB(); // Connect to MongoDB

// const app = express();
// const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: "http://localhost:8080", // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use((err, req, res, next) => {
  console.error("🚨 Middleware error:", err);
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ message: "Too many files uploaded or invalid field name" });
  }
  res.status(500).json({ message: "Internal server error" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", travelPostRoutes);

app.use("/api/trip", tripRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api/hotel",hotelRoutes)

app.use("/api/book",bookingRoutes)


app.use("/api/matches", protect, matchRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something broke!",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;