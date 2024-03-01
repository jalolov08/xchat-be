const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.String,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
