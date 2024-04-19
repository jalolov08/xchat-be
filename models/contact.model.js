const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    company: {
      type: String,
      required: false,
    },
    displayName: {
      type: String,
      required: false,
    },
    familyName: {
      type: String,
      required: false,
    },
    givenName: {
      type: String,
      required: false,
    },
    phoneNumbers: [
      {
        number: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { versionKey: "version" }
);

module.exports = mongoose.model("Contact", ContactSchema);
