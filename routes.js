const express = require("express");
const router = express.Router();
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const contactRoutes = require("./routes/contact.routes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/contact", contactRoutes);

module.exports = router;
