import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

interface IMessage {
  text: string;
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  createdAt: Date;
}
export interface Message extends IMessage, Document<Types.ObjectId> {}

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

const MessageModel = model<IMessage>('Message', messageSchema);

export default MessageModel;
