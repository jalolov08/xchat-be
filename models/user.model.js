const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    surname: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    photoUri: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
