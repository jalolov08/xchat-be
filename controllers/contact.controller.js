const Contact = require("../models/contact.model");

async function upload(req, res) {
  try {
    const contactsData = req.body.contacts;

    const contacts = await Promise.all(
      contactsData.map(async (contactData) => {
        const { displayName, familyName, givenName, phoneNumbers } =
          contactData;

        const existingContact = await Contact.findOne({
          userId: req.user._id,
          displayName: displayName,
        });

        if (existingContact) {
          existingContact.familyName = familyName;
          existingContact.givenName = givenName;
          existingContact.phoneNumbers = phoneNumbers;

          await existingContact.save();

          return existingContact;
        } else {
          const contact = new Contact({
            userId: req.user._id,
            displayName,
            familyName,
            givenName,
            phoneNumbers,
          });

          await contact.save();

          return contact;
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
