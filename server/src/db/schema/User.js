const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  imgUrl: { type: String },
  groups: [{type: ObjectId, ref: 'Group', index: true}],
  createdAt: { type: Date, default: Date.now, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
