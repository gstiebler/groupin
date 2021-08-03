import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

const messageSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

export interface IMessage extends Document {
  text: string;
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  createdAt: Types.ObjectId;
}

const Message = model('Message', messageSchema);

export default Message;
