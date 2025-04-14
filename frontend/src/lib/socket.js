const io = require("socket.io-client");

// Replace with your server's URL (e.g., http://localhost:3000)
const SERVER_URL = "http://localhost:5000";

// Connect to the server with a userId query parameter
const userId = "user123"; // Replace with a unique user ID
const socket = io(SERVER_URL, {
  query: { userId },
});

// Handle connection event
socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

// Handle disconnection event
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// Listen for the 'getOnlineUsers' event
socket.on("getOnlineUsers", (onlineUsers) => {
  console.log("Online users:", onlineUsers);
});

// Example: Simulate sending a private message after 5 seconds
setTimeout(() => {
  sendMessage("user456", "Hello, this is a private message!");
}, 5000);

// Example: Handle private messages received from other users
socket.on("privateMessage", (data) => {
  console.log(`Received private message: "${data.message}"`);
});