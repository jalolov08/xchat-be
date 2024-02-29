const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      phone: user.phone,
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "4y" }
  );
}
module.exports = generateToken;
