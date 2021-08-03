import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

const pinnedTopicSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export interface IPinnedTopic extends Document {
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  createdAt: number;
  updatedAt: number;
}

const PinnedTopic = model('PinnedTopic', pinnedTopicSchema);

export default PinnedTopic;
