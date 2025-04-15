const Message = require("../models/message");
const User = require("../models/userModel");
const cloudinary = require("cloudinary");
const { getReceiverSocketId, io } = require("../config/socket");

const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const fillteredUser = await User.find({ _id: { $ne: loggedInUser } });
    res.status(200).json(fillteredUser);
  } catch (error) {
    console.log("Error in getUsersForSiderbar : ", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const getAllConnectedUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const user = await User.findById(loggedInUser).populate(
      "connections.connection_id"
    );
    const connectedUsers = user.connections
      .filter((connection) => connection.status === "accepted")
      .map((connection) => connection.connection_id);
    res.status(200).json(connectedUsers);
  } catch (error) {
    console.log("Error in getAllConnectedUsers : ", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages : ", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //Real time chat using socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessages : ", error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getMessages,
  getUserForSidebar,
  sendMessages,
  getAllConnectedUsers,
};
