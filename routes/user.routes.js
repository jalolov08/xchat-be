const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const checkAuth = require("../utils/checkAuth");
const fileUpload = require("../utils/fileUpload");
const avatarUpload = fileUpload("avatar", ["image/jpeg", "image/png"]);
router.post(
  "/upload/avatar",
  checkAuth,
  avatarUpload.single("image"),
  (req, res) => {
    res.json({ url: `/api/uploads/avatar/${req.file.filename}` });
  }
);
router.post("/change", checkAuth, userController.changeProfile);
router.get("/:userId", checkAuth, userController.getUserInfo);
router.post("/sync", checkAuth, userController.syncContacts);
module.exports = router;
