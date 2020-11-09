/**
 * Stores the latest moment the user saw a topic
 */
import { Types, Schema, Document, model } from 'mongoose';

const { ObjectId } = Types;

const topicLatestReadSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  latestMoment: { type: Date, default: Date.now, required: true },
});

export interface ITopicLatestRead extends Document {
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  latestMoment: Date;
}

const TopicLatestRead = model<ITopicLatestRead>('TopicLatestRead', topicLatestReadSchema);

export default TopicLatestRead;
