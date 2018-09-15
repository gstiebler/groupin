const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imgUrl: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
