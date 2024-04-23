const express = require("express");
const router = express.Router();
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const contactRoutes = require("./routes/contact.routes");
const checkAuth = require("./utils/checkAuth");
const isAdmin = require("./utils/isAdmin");
const chatController = require("./controllers/chat.controller");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/contact", contactRoutes);
router.get("/stats", checkAuth, isAdmin, chatController.getStats);
module.exports = router;
