/**
 * Stores the latest moment the user saw a topic
 */

import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Types;

const groupLatestReadSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true },
  latestMoment: { type: Date, default: Date.now, required: true },
});

export interface IGroupLatestRead extends Document {
  userId: Types.ObjectId;
  groupId: Types.ObjectId;
  latestMoment: Date;
}

const GroupLatestRead = model<IGroupLatestRead>('GroupLatestRead', groupLatestReadSchema);

export default GroupLatestRead;
