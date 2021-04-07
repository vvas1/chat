const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Chatroom is required",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User is required",
    },
    text: {
      type: String,
      required: "Message is required",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Message", messageSchema, "Message");
