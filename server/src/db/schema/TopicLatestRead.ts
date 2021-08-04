import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

export interface ITopicLatestRead {
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  latestMoment: number;
}

type TopicLatestReadDef = {
  [key in keyof ITopicLatestRead]: any;
};

const schemaDef: TopicLatestReadDef = {
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  latestMoment: { type: Date, default: Date.now, required: true },
};
const topicLatestReadSchema = new Schema<TopicLatestReadDef>(schemaDef);

const TopicLatestRead = model('TopicLatestRead', topicLatestReadSchema);

export default TopicLatestRead;
