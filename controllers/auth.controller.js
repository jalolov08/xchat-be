const Otp = require("../models/otp.model");
const User = require("../models/user.model");
const generateCode = require("../utils/generateCode");
const generateToken = require("../utils/generateToken");
const sendVerificationSMS = require("../utils/sendVerificationSMS");
const bcrypt = require("bcrypt");
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_TIMEOUT_MINUTES = 30;

async function login(req, res) {
  try {
    const { phone } = req.body;

    let otp = await Otp.findOne({ phone });

    if (!otp) {
      otp = new Otp({ phone, verificationAttempts: 0 });
    }

    if (otp.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
      const timeElapsed = (new Date() - otp.updatedAt) / (1000 * 60);
      if (timeElapsed < VERIFICATION_TIMEOUT_MINUTES) {
        return res.status(400).json({
          error: `Превышено ограничение на количество попыток верификации. Повторите попытку через ${VERIFICATION_TIMEOUT_MINUTES} минут`,
        });
      } else {
        otp.verificationAttempts = 0;
      }
    }

    const code = generateCode().toString();
    console.log(code); //  удалить в продакшене

    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(code, salt);

    otp.code = hashedCode;
    await otp.save();

    return res
      .status(200)
      .json({ message: "Код верификации успешно отправлен" });
  } catch (error) {
    console.error("Ошибка отправки кода верификации:", error);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

async function verify(req, res) {
  try {
    const { phone, code } = req.body;

    let otp = await Otp.findOne({ phone });

    if (!otp || otp.verificationAttempts >= 5) {
      return res.status(400).json({
        error: "Превышено ограничение на количество попыток верификации или указан неверный номер телефона",
      });
    }

    if (!(await bcrypt.compare(code, otp.code))) {
      otp.verificationAttempts += 1;
      await otp.save();
      return res.status(400).json({ error: "Неверный код" });
    }

    await Otp.deleteOne({ phone });

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Ошибка верификации OTP:", error);
    return res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

module.exports = {
  login,
  verify,
};
