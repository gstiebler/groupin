import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

export interface IPinnedTopic {
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  createdAt: number;
  updatedAt: number;
}
export interface PinnedTopic extends IPinnedTopic {
  _id: Types.ObjectId;
}

type PinnedTopicDef = {
  [key in keyof IPinnedTopic]: any;
};

const schemaDef: PinnedTopicDef = {
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
};
const pinnedTopicSchema = new Schema<IPinnedTopic>(schemaDef);

const PinnedTopicModel = model<PinnedTopic>('PinnedTopic', pinnedTopicSchema);

export default PinnedTopicModel;
