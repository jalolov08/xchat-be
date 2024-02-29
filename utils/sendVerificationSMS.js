const axios = require("axios");
require("dotenv").config();

async function sendVerificationSMS(phone, code) {
  try {
    await axios.get(
      `https://${process.env.MAIL}:${process.env.AERO_KEY}@gate.smsaero.ru/v2/sms/send?number=${phone}&text=Ваш код: ${code}&sign=SMS Aero`
    );
  } catch (error) {
    throw new Error("Error sending verification SMS");
  }
}

module.exports = sendVerificationSMS;
