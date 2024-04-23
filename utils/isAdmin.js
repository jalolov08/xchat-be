function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Вы не админ." });
  }
}
module.exports = isAdmin;
