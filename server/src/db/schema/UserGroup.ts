import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

const userGroupSchema = new Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true },
  pinned: { type: Boolean, required: true },
  latestRead: { type: Date, default: Date.now, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

export interface IUserGroup extends Document {
  userId: Types.ObjectId;
  topicId: Types.ObjectId;
  latestMoment: number;
}

const UserGroup = model('UserGroup', userGroupSchema);

export default UserGroup;
