const Chatroom = require("../models/Chatroom");

module.exports.createChatroom = async (req, res) => {
  const { name, owner }: Body = req.body;
  
  const chatRoomExist = await Chatroom.findOne({ name });
  if (chatRoomExist) throw "Chatroom with that name already exist";
  
  const chatRoom = new Chatroom({ name, owner });
  await chatRoom.save();
  res.status(200).json({ message: `ChatRoom ${name} successfully created` });
};

module.exports.getAllChatrooms =async (req,res)=>{
  
const chatrooms = await Chatroom.find({}).populate('owner','-password').populate('messages');

return res.status(200).json({chatrooms})
}