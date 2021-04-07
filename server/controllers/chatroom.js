const Chatroom = require("../models/Chatroom");

module.exports.createChatroom = async (req, res) => {
  const { name, owner } = req.body;

  const chatRoomExist = await Chatroom.findOne({ name });
  if (chatRoomExist) throw "Chatroom with that name already exist";

  const chatRoom = new Chatroom({ name, owner });
  await chatRoom.save();
  res.status(200).json({ message: `ChatRoom ${name} successfully created` });
};

module.exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.aggregate([
    {
      $lookup: {
        from: "Message",
        localField: "_id",
        foreignField: "chatroom",
        as: "messages",
      },
    },
  ]);

  return res.status(200).json({ chatrooms });
};
