const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true }, // At this time, `uid` from Firebase Auth
  name: { type: String, required: true },
  email: { type: String },
  phoneNumber: { type: String },
  // temporary password sent by SMS to the user
  tempPassword: { type: String },
  fcmToken: { type: String },
  imgUrl: { type: String },
  groups: [{type: ObjectId, ref: 'Group', index: true}],
  createdAt: { type: Date, default: Date.now, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
