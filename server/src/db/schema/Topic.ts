import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Types;

export interface ITopic {
  name: string,
  imgUrl: string,
  createdBy: Types.ObjectId,
  groupId: Types.ObjectId,
  createdAt: number,
  updatedAt: number,
}

type TopicSchemaDef = {
  [key in keyof ITopic]: any;
};

const schemaDef: TopicSchemaDef = {
  name: { type: String, required: true },
  imgUrl: { type: String },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true, index: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
};
const topicSchema = new Schema<ITopic>(schemaDef);

const Topic = model<ITopic>('Topic', topicSchema);

export default Topic;
