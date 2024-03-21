const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const limiter = require("../utils/limiter");
const checkAuth = require("../utils/checkAuth");
router.post("/login", limiter, authController.login);
router.post("/verify", authController.verify);
router.get("/me", checkAuth, authController.getMe);
module.exports = router;
