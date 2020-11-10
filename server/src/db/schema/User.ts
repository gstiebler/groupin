import { Schema, Document, Types, model, Model } from 'mongoose';

const { ObjectId } = Types;

const userSchema = new Schema({
  uid: { type: String, required: true, index: true }, // At this time, `uid` from Firebase Auth
  name: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String },
  fcmToken: { type: String },
  imgUrl: { type: String },
  groups: [{
    _id: false,
    id: { type: ObjectId, ref: 'Group' },
    pinned: { type: Boolean, default: false },
  }],
  pinnedTopics: [{ type: ObjectId, ref: 'Topic' }],
  createdAt: { type: Date, default: Date.now, required: true },
});

export interface IUser extends Document {
  uid: string;
  name: string;
  email?: string;
  phoneNumber: string;
  fcmToken?: string;
  imgUrl?: string;
  groups: {
    id: Types.ObjectId;
    pinned: boolean;
  }[],
  pinnedTopics?: Types.ObjectId[],
  createdAt?: number;
}

export interface UserModel extends Model<IUser> {
  test?: string;
}

const User = model<IUser, UserModel>('User', userSchema);

export default User;
