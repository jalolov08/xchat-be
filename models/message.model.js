const mongoose = require("mongoose");

const MessageTypeEnum = Object.freeze({
  TEXT: "text",
  DOCUMENT: "document",
  IMAGE: "image",
});

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.String,
      required: false,
    },
    messageType: {
      type: String,
      enum: Object.values(MessageTypeEnum),
      required: true,
    },
    answerFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    viewed: { type: Boolean, default: false },
    uri: {
      type: String,
      required: function () {
        return (
          this.messageType === MessageTypeEnum.DOCUMENT ||
          this.messageType === MessageTypeEnum.IMAGE
        );
      },
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
