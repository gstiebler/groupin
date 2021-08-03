import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

const topicLatestReadSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  latestMoment: { type: Date, default: Date.now, required: true },
});

export interface ITopicLatestRead extends Document {
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  latestMoment: number;
}

const TopicLatestRead = model('TopicLatestRead', topicLatestReadSchema);

export default TopicLatestRead;
