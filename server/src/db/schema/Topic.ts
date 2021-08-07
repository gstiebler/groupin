import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

export interface ITopic {
  name: string;
  imgUrl: string;
  createdBy: Types.ObjectId;
  groupId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface Topic extends ITopic {
  _id: Types.ObjectId;
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
topicSchema.index({ groupId: 1, updatedAt: -1 });

const TopicModel = model<Topic>('Topic', topicSchema);

export default TopicModel;
