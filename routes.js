const express = require("express");
const router = express.Router();
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
router.use("/auth", authRoutes);
router.use("/user", userRoutes);

module.exports = router;
