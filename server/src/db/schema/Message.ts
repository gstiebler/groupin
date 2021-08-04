import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

export interface IMessage {
  text: string;
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  createdAt: Types.ObjectId;
}

type MessageDef = {
  [key in keyof IMessage]: any;
};

const schemaDef: MessageDef = {
  text: { type: String, required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
}
const messageSchema = new Schema<IMessage>(schemaDef);

const Message = model('Message', messageSchema);

export default Message;
