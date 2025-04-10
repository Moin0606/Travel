const { Server } = require("socket.io");
const Chat = require("../models/chatModel");
const TravelPost = require("../models/travelPostModel");

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  // Store user socket mappings
  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user authentication and store mapping
    socket.on("authenticate", (userId) => {
      userSockets.set(userId.toString(), socket.id);
      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    // Real-time messaging
    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        const chatMessage = new Chat({ senderId, receiverId, message });
        await chatMessage.save();

        const receiverSocketId = userSockets.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", chatMessage);
        }
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });

    // Real-time match notifications
    socket.on("subscribeToPost", (postId) => {
      socket.join(postId);
      console.log(`Socket ${socket.id} subscribed to post ${postId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Clean up user mapping
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });

  // Make io instance available globally
  global.io = io;
  
  return io;
};

// Notification emitter helper
function emitNotification(userId, type, data) {
  const socketId = global.io.sockets.adapter.sids.get(userId.toString());
  if (socketId) {
    global.io.to(socketId).emit('notification', { type, ...data });
  }
}

module.exports = { configureSocket, emitNotification };