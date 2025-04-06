const { Server } = require("socket.io");
const Chat = require("../models/chatModel");

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
      try {
        const chatMessage = new Chat({ senderId, receiverId, message });
        await chatMessage.save();

        // Emit the message to the receiver
        io.to(receiverId).emit("receiveMessage", chatMessage);
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = configureSocket;
