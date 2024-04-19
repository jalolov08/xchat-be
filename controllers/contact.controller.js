const Contact = require("../models/contact.model");
async function upload(req, res) {
  try {
    const contactsData = req.body.contacts;

    const contacts = await Promise.all(
      contactsData.map(async (contactData) => {
        const { displayName, familyName, givenName, phoneNumbers } =
          contactData;

        try {
          const existingContact = await Contact.findOneAndUpdate(
            {
              userId: req.user._id,
              displayName: displayName,
            },
            {
              familyName: familyName,
              givenName: givenName,
              phoneNumbers: phoneNumbers,
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );

          return existingContact;
        } catch (err) {
          if (err instanceof mongoose.Error.VersionError) {
            return upload(req, res);
          } else {
            throw err;
          }
        }
      })
    );

    res.status(201).json({ message: "Contacts uploaded successfully" });
  } catch (err) {
    console.error("Error uploading contacts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  upload,
};
