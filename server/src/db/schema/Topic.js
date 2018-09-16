const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imgUrl: { type: String },
  createdBy: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true, index: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
