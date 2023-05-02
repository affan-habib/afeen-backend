import ChatModel from '../../Models/chatModel.js';
import catchAsync from '../../utils/catchAsync.js';

export const createChat = catchAsync(async (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;
  const newChat = new ChatModel({
    members: [senderId, receiverId]
  });
  console.log(newChat._id);
  const chat = await newChat.save();
  console.log('chat id', chat);
  res.status(200).json('chat has been created successfully');
});

export const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const result = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] }
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
