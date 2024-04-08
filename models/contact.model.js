const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
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
    required: true,
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
});
module.exports = mongoose.model("Contact", ContactSchema);
