import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

export interface IUserGroup {
  userId: Types.ObjectId;
  groupId: Types.ObjectId;
  pinned: boolean;
  latestRead: number;
  createdAt: number;
  updatedAt: number;
}

type UserGroupSchemaDef = {
  [key in keyof IUserGroup]: any;
};

const schemaDef: UserGroupSchemaDef = {
  userId: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true },
  pinned: { type: Boolean, required: true },
  latestRead: { type: Date, default: Date.now, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
};

const userGroupSchema = new Schema<UserGroupSchemaDef>(schemaDef);

const UserGroup = model('UserGroup', userGroupSchema);

export default UserGroup;
