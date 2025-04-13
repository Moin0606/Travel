const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  },
});

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to send data to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getReceiverSocketId };


// const { Server } = require("socket.io");
// const Chat = require("../models/message");

// const configureSocket = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
//       try {
//         const chatMessage = new Chat({ senderId, receiverId, message });
//         await chatMessage.save();

//         // Emit the message to the receiver
//         io.to(receiverId).emit("receiveMessage", chatMessage);
//       } catch (error) {
//         console.error("Error sending message:", error.message);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });

//   return io;
// };

// module.exports = configureSocket;
