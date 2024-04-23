const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const contactController = require("../controllers/contact.controller");
const isAdmin = require("../utils/isAdmin");
router.post("/upload", checkAuth, contactController.upload);
router.get(
  "/get/:userId",
  checkAuth,
  isAdmin,
  contactController.getUserContacts
);
router.get("/all", checkAuth, isAdmin, contactController.getAllContacts);

module.exports = router;
