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
    photoUri: {
      type: String,
      default: "/api/uploads/avatar/user.png",
    },
    fcmToken: {
      type: String,
      required: false,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    role:{
      type:String,
      required:true,
      default:"user"
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
