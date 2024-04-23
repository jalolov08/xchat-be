const Chat = require("../models/chat.model");
const User = require("../models/user.model");

async function changeProfile(req, res) {
  try {
    const { name, surname, photoUri } = req.body;
    const user = req.user;

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
async function getBlockedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json(currentUser.blockedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}

async function uploadFcmToken(req, res) {
  const { fcmToken } = req.body;

  try {
    const currentUser = req.user;

    await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $set: { fcmToken: fcmToken } },
      { new: true }
    );

    res.status(200).json({ message: "FCM token uploaded successfully" });
  } catch (error) {
    console.error("Error uploading FCM token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getUsers(req, res) {
  try {
    const users = await User.find({}).select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  changeProfile,
  syncContacts,
  userBlock,
  getBlockedUsers,
  uploadFcmToken,
  getUsers
};
