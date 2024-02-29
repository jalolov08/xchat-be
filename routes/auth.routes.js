const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const limiter = require("../utils/limiter");

router.post("/login", limiter, authController.login);
router.post("/verify", authController.verify);

module.exports = router;
