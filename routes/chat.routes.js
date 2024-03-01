const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const checkAuth = require("../utils/checkAuth");
router.post("/send/:id", checkAuth, chatController.sendMessage);
router.get("/:id", checkAuth, chatController.getMessages);
router.delete("/delete", checkAuth, chatController.deleteMessages);
router.delete("/delete/all/:id", checkAuth, chatController.deleteChat);
module.exports = router;
