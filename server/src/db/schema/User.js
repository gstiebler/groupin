const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
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

const User = mongoose.model('User', userSchema);

module.exports = User;
