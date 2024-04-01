const Chat = require("../models/chat.model");
const User = require("../models/user.model");

async function changeProfile(req, res) {
  try {
    const { name, surname, photoUri } = req.body;
    const user = req.user;

    if (!name || !surname || !photoUri) {
      return res.status(400).json({ message: "Не все поля заполнены" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          name,
          surname,
          photoUri,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await Chat.updateMany(
      { "participantDetails.user": user._id },
      {
        $set: {
          "participantDetails.$.fullName": name,
        },
      }
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("Ошибка при изменении профиля:", error);
    res.status(500).json({ message: "Произошла ошибка при изменении профиля" });
  }
}

async function getUserInfo(req, res) {
  try {
    const { userId } = req.params;

    const userInfo = await User.findById(userId);

    if (!userInfo) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.status(200).json({ userInfo });
  } catch (error) {
    console.error("Ошибка при получении информации о пользователе:", error);
    res.status(500).json({
      message: "Произошла ошибка при получении информации о пользователе",
    });
  }
}
async function syncContacts(req, res) {
  try {
    const { phones } = req.body;

    // if (!phones || !Array.isArray(phones) || phones.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Массив номеров отсутствует или пуст" });
    // }

    const users = await User.find({ phone: { $in: phones } });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Ошибка синхронизации контактов:", error);
    res.status(500).json({
      message: "Произошла ошибка при синхронизации контактов",
    });
  }
}
async function userBlock(req, res) {
  try {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const index = currentUser.blockedUsers.indexOf(userId);
    if (index !== -1) {
      currentUser.blockedUsers.splice(index, 1);
      await currentUser.save();
      res.status(200).json({ message: "Пользователь успешно разблокирован" });
    } else {
      currentUser.blockedUsers.push(userId);
      await currentUser.save();
      res.status(200).json({ message: "Пользователь успешно заблокирован" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

module.exports = {
  changeProfile,
  getUserInfo,
  syncContacts,
  userBlock,
};
