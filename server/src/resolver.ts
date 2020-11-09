/* eslint-disable no-underscore-dangle */
const User = require('./db/schema/User');

const { subscribeToAll } = require('./lib/subscription');

const messageResolver = require('./resolvers/message.resolver');
const groupResolver = require('./resolvers/group.resolver');
const topicResolver = require('./resolvers/topic.resolver');

async function getHello({ pass }) {
  return pass === 'foca' ? 'OK' : 'ERROR';
}

async function getUserId(args, { user }) {
  if (!user) {
    return { id: 'NO USER' };
  }
  return { id: user._id.toHexString() };
}

async function register({ name }, { firebaseId, phoneNumber }) {
  const previousUser = await User.findOne({ phoneNumber });
  if (previousUser) {
    throw new Error('User is already registered');
  }
  const user = await User.create({
    name,
    phoneNumber,
    uid: firebaseId,
  });

  return {
    errorMessage: '',
    id: user._id,
  };
}

async function updateFcmToken({ fcmToken }, { user }) {
  if (!user) {
    throw new Error('A user is required to update FCM token');
  }
  await User.updateOne(
    { _id: user._id },
    { $set: { fcmToken } },
  );
  await subscribeToAll(user, fcmToken);
}

module.exports = {
  getHello,
  getUserId,
  register,
  updateFcmToken,
  ...messageResolver,
  ...groupResolver,
  ...topicResolver,
};
