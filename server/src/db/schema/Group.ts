import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';
import shortid from 'shortid';

const { ObjectId } = Schema.Types;

const groupSchema = new Schema({
  friendlyId: { type: String, default: shortid.generate },
  name: { type: String, required: true },
  imgUrl: { type: String },
  description: { type: String },
  visibility: { type: String, enum: ['SECRET', 'PUBLIC'] },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

groupSchema.index({ name: 1, createdAt: 1 });

export interface IGroup extends Document {
  friendlyId?: string;
  name: string;
  imgUrl: string;
  description?: string;
  visibility: 'SECRET' | 'PUBLIC',
  createdBy: Types.ObjectId;
  createdAt?: number;
  updatedAt?: number;
}

const Group = model<IGroup>('Group', groupSchema);

export default Group;
