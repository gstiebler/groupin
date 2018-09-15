const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imgUrl: { type: String },
  groupId: { type: ObjectId, ref: 'Group', index: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
