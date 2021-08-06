import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

export interface ITopicLatestRead {
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  latestMoment: Date;
}
export interface TopicLatestRead extends ITopicLatestRead {
  _id: Types.ObjectId;
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

const TopicLatestReadModel = model<TopicLatestRead>('TopicLatestRead', topicLatestReadSchema);

export default TopicLatestReadModel;
