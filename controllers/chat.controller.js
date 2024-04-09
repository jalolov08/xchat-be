const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const { getReceiverSocketId, io, getUserChats } = require("../socket/socket");
const sendNotification = require("../utils/sendNotification");

async function sendMessage(req, res) {
  try {
    const { id: receiverId } = req.params;
    const { message, messageType, answerFor } = req.body;
    const senderId = req.user._id;
    const senderDetails = await User.findById(senderId);
    const receiverDetails = await User.findById(receiverId);

    if (receiverDetails.blockedUsers.includes(senderId)) {
      return res.status(403).json({
        error:
          "Вы заблокированы этим пользователем и не можете отправлять сообщения.",
      });
    }
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
      });
      const senderDetails = await User.findById(senderId);
      const receiverDetails = await User.findById(receiverId);

      chat.participantDetails.push({
        user: senderId,
        photo: senderDetails.photoUri,
        fullName: `${senderDetails.name} ${senderDetails.name}`,
      });

      chat.participantDetails.push({
        user: receiverId,
        photo: receiverDetails.photoUri,
        fullName: `${receiverDetails.name} ${receiverDetails.surname}`,
      });
      getUserChats(senderId);
      getUserChats(receiverId);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      messageType,
      uri:
        messageType === "image" || messageType === "document"
          ? `/api/${req.file.path}`
          : null,
      answerFor,
    });
    if (newMessage) {
      chat.messages.push(newMessage._id);
      if (messageType !== "image" && messageType !== "document") {
        chat.lastMessage = newMessage.message;
      }
    }

    await Promise.all([chat.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { message: newMessage });
    }
    const senderData = {
      _id: senderDetails._id.toString(),
      fullName: `${senderDetails.name} ${senderDetails.surname}`,
      photo: senderDetails.photoUri,
      user: senderDetails._id.toString(),
    };
    await sendNotification(
      receiverDetails.fcmToken,
      senderData.fullName,
      newMessage.message,
      {
        ...senderData,
        messageType: newMessage.messageType,
        uri: `${process.env.API}${newMessage.uri}`,
      }
    );
    await Promise.all([getUserChats(senderId), getUserChats(receiverId)]);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;
    const chat = await Chat.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    if (!chat) return res.status(200).json([]);
    const messages = chat.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
async function deleteMessages(req, res) {
  try {
    const { messageIds } = req.body;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { _id: { $in: messageIds }, senderId: senderId },
        { _id: { $in: messageIds }, receiverId: senderId },
      ],
    });

    if (!messages || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Эти сообщения не принадлежат вам." });
    }

    await Message.deleteMany({ _id: { $in: messageIds } });

    res.status(200).json({ message: "Сообщения успешно удалены" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

async function deleteChat(req, res) {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    const chat = await Chat.findOneAndDelete({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      return res.status(404).json({ message: "Чат не найден" });
    }

    if (!chat.participants.includes(senderId)) {
      return res
        .status(403)
        .json({ message: "Вы не имеете права удалять этот чат" });
    }

    res.status(200).json({ message: "Чат успешно удален" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
}
async function getMyChats(req, res) {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ participants: userId });
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function markMessageAsViewed(req, res) {
  try {
    const messageId = req.params.messageId;
    const userId = req.user._id;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, receiverId: userId, viewed: false },
      { viewed: true },
      { new: true }
    );

    if (!message) {
      return res
        .status(404)
        .json({ error: "Сообщение не найдено или уже прочитано" });
    }

    const receiverSocketId = getReceiverSocketId(message.senderId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageViewed", message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

module.exports = {
  sendMessage,
  getMessages,
  deleteMessages,
  deleteChat,
  getMyChats,
  markMessageAsViewed,
};
