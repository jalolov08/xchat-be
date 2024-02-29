const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
    verificationAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", OtpSchema);
