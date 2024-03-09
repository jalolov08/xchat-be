const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const jwt = require("jsonwebtoken");
const Chat = require("../models/chat.model");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET;
async function getUserChats(userId) {
  try {
    const chats = await Chat.find({ participants: userId });
    io.to(userSocketMap[userId]).emit("chats", chats);
  } catch (error) {
    console.error("Error chats:", error);
  }
}

function getReceiverSocketId(receiverId) {
  return userSocketMap[receiverId];
}
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  const token = socket.handshake.query.token;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("Error verifying token:", err);
        return;
      }
      const userId = decoded._id;
      //   console.log("User ID:", userId);
      if (userId) userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      getUserChats(userId);
    });
  }

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
module.exports = { app, io, server, getReceiverSocketId, getUserChats };
