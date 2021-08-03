import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Types;

const topicSchema = new Schema({
  name: { type: String, required: true },
  imgUrl: { type: String },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true, index: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export interface ITopic extends Document {
  name: string,
  imgUrl: string,
  createdBy: Types.ObjectId,
  groupId: Types.ObjectId,
  createdAt: number,
  updatedAt: number,
}

const Topic = model<ITopic>('Topic', topicSchema);

export default Topic;
