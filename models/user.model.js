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
    photoUri: String,
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default:[],
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
