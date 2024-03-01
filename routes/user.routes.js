const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const checkAuth = require("../utils/checkAuth");

router.post("/change", checkAuth, userController.changeProfile);
router.get("/:userId", checkAuth, userController.getUserInfo);
router.post("/sync", checkAuth, userController.syncContacts);
module.exports = router;
