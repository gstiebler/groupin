import {
  model,
  Schema,
  Types,
} from 'mongoose';
import shortid from 'shortid';

const { ObjectId } = Schema.Types;

export interface IGroup {
  friendlyId?: string;
  name: string;
  imgUrl: string;
  description?: string;
  visibility: 'SECRET' | 'PUBLIC',
  createdBy: Types.ObjectId;
  createdAt?: number;
  updatedAt?: number;
}

type GroupSchemaDef = {
  [key in keyof IGroup]: any;
};

const schemaDef: GroupSchemaDef = {
  friendlyId: { type: String, default: shortid.generate },
  name: { type: String, required: true },
  imgUrl: { type: String },
  description: { type: String },
  visibility: { type: String, enum: ['SECRET', 'PUBLIC'] },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
};

const groupSchema = new Schema<IGroup>(schemaDef);

groupSchema.index({ name: 1, createdAt: 1 });

const Group = model<IGroup>('Group', groupSchema);

export default Group;
