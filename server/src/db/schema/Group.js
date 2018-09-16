const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imgUrl: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
