import * as mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: ObjectId, ref: 'User', index: true, required: true },
  topic: { type: ObjectId, ref: 'Topic', index: true, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;