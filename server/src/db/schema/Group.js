const mongoose = require('mongoose');
const shortid = require('shortid');
const ObjectId = mongoose.Schema.Types.ObjectId;

const groupSchema = new mongoose.Schema({
  friendlyId: { type: String, default: shortid.generate },
  name: { type: String, required: true },
  imgUrl: { type: String },
  description: { type: String },
  visibility: { type: String, enum: ['SECRET', 'PUBLIC'] },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
