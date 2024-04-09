const admin = require("firebase-admin");

async function sendNotification(token, title, body, data) {
  let message = {
    notification: {
      title,
      body,
    },
    token,
    data,
  };

  if (data.messageType === "image") {
    message = {
      ...message,
      notification: {
        ...message.notification,
        image: data.uri,
      },
    };
  } else if (data.messageType === "document") {
    message = {
      ...message,
      notification: {
        ...message.notification,
        body: "Вы получили документ",
      },
    };
  }

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = sendNotification;
