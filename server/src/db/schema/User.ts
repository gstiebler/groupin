import {
  model,
  Schema,
  Types,
} from 'mongoose';

export interface IUser {
  externalId: string;
  name: string;
  notificationToken?: string;
  imgUrl?: string;
  createdAt: number;
  updatedAt: number;
}
export interface User extends IUser {
  _id: Types.ObjectId;
}

type UserSchemaDef = {
  [key in keyof IUser]: any;
};

const schemaDef: UserSchemaDef = {
  externalId: { type: String, required: true },
  name: { type: String, required: true },
  notificationToken: { type: String },
  imgUrl: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
};
const userSchema = new Schema<IUser>(schemaDef);

const UserModel = model<User>('User', userSchema);

export default UserModel;
