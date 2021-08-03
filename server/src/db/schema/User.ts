import {
  Document,
  model,
  Schema,
} from 'mongoose';

export interface IUser extends Document {
  externalId: string;
  name: string;
  notificationToken?: string;
  imgUrl?: string;
  createdAt: number;
  updatedAt: number;
}

type UserSchemaDef = {
  [key in keyof IUser]: any;
};

const schemaDef: Partial<UserSchemaDef> = {
  externalId: { type: String, required: true },
  name: { type: String, required: true },
  notificationToken: { type: String },
  imgUrl: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
};

const userSchema = new Schema(schemaDef);

const User = model<IUser>('User', userSchema);

export default User;
