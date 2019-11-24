/**
 * Stores the latest moment the user saw a topic
 */

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const topicLatestReadSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  topicId: { type: ObjectId, ref: 'Topic', required: true },
  latestMoment: { type: Date, default: Date.now, required: true },
});

const TopicLatestRead = mongoose.model('TopicLatestRead', topicLatestReadSchema);

module.exports = TopicLatestRead;
