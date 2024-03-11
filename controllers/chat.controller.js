const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const { getReceiverSocketId, io, getUserChats } = require("../socket/socket");
async function sendMessage(req, res) {
  try {
    const { id: receiverId } = req.params;
    const { message, messageType, uri, answerFor } = req.body;
    const senderId = req.user._id;
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
      });
      getUserChats(senderId);
      getUserChats(receiverId);
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      messageType,
      uri,
      answerFor,
    });
    if (newMessage) {
      chat.messages.push(newMessage._id);
      chat.lastMessage = newMessage.message;
    }
    await Promise.all([chat.save(), newMessage.save()]);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { message: newMessage });
    }
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
      _id: { $in: messageIds },
      senderId: senderId,
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
      return res.status(404).json({ error: "Чат не найден" });
    }

    if (!chat.participants.includes(senderId)) {
      return res
        .status(403)
        .json({ error: "Вы не имеете права удалять этот чат" });
    }

    res.status(200).json({ message: "Чат успешно удален" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
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

module.exports = {
  sendMessage,
  getMessages,
  deleteMessages,
  deleteChat,
  getMyChats,
};
