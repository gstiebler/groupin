import {
  model,
  Schema,
  Types,
} from 'mongoose';

const { ObjectId } = Schema.Types;

export interface UserGroup {
  userId: Types.ObjectId;
  groupId: Types.ObjectId;
  pinned: boolean;
  latestRead: Date;
  createdAt: Date;
  updatedAt: Date;
}

type UserGroupSchemaDef = {
  [key in keyof UserGroup]: any;
};

const schemaDef: UserGroupSchemaDef = {
  userId: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true },
  pinned: { type: Boolean, required: true },
  latestRead: { type: Date, default: Date.now, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
};
const userGroupSchema = new Schema<UserGroup>(schemaDef);

const UserGroupModel = model<UserGroup>('UserGroup', userGroupSchema);

export default UserGroupModel;
