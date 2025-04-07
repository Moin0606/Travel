require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const http = require("http");
const configureSocket = require("./config/socketConfig");
const cookieParser = require('cookie-parser');

const userRoutes = require("./routes/userRoutes");
const travelPostRoutes = require("./routes/travelPostRoutes");
const tripRoutes = require("./routes/tripRoutes");
// const messageRoutes = require("./routes/messageRoutes");
//const matchRoutes = require("./routes/matchRoutes");

connectDB(); // Connect to MongoDB

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts/", travelPostRoutes);
app.use("/api/trip", tripRoutes);
// app.use("/api/messages", messageRoutes);

//app.use("/api/chats", chatRoutes);
//app.use("/api/matches", matchRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

//WebSocket
const io = configureSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
