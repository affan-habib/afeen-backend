import mongoose from 'mongoose';
const MessageSchema = mongoose.Schema(
  {
    chatId: {
      type: String,
      requried: true
    },
    senderId: {
      type: String,
      requried: true
    },

    text: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const MessageModel = mongoose.model('Message', MessageSchema);
export default MessageModel;
