const Chat = require("../models/chatModel");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ message: "Receiver ID and message are required" });
    }

    const chatMessage = new Chat({
      senderId: req.user.id,
      receiverId,
      message,
    });

    await chatMessage.save();

    res.status(201).json({ message: "Message sent", chat: chatMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { receiverId } = req.query;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    const messages = await Chat.find({
      $or: [
        { senderId: req.user.id, receiverId },
        { senderId: receiverId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching chat history", error: error.message });
  }
};
