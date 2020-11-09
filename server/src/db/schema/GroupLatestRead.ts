/**
 * Stores the latest moment the user saw a topic
 */

const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const groupLatestReadSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  groupId: { type: ObjectId, ref: 'Group', required: true },
  latestMoment: { type: Date, default: Date.now, required: true },
});

const GroupLatestRead = mongoose.model('GroupLatestRead', groupLatestReadSchema);

module.exports = GroupLatestRead;
