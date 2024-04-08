const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const contactController = require("../controllers/contact.controller");
router.post("/upload", checkAuth, contactController.upload);
module.exports = router;
