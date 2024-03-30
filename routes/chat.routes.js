const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const checkAuth = require("../utils/checkAuth");
const fileUpload = require("../utils/fileUpload");
const upload = fileUpload("messages", [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.ms-excel",
  "text/plain",
  "application/vnd.ms-powerpoint",
  "image/vnd.microsoft.icon",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
router.post(
  "/send/:id",
  upload.single("file"),
  checkAuth,
  chatController.sendMessage
);
router.get("/:id", checkAuth, chatController.getMessages);
router.get("/", checkAuth, chatController.getMyChats);
router.delete("/delete", checkAuth, chatController.deleteMessages);
router.delete("/delete/all/:id", checkAuth, chatController.deleteChat);
router.put("/:messageId/viewed", checkAuth, chatController.markMessageAsViewed);
module.exports = router;
