/* eslint-disable no-underscore-dangle */
import User, { IUser } from './db/schema/User';

import { subscribeToAll } from './lib/subscription';

import * as messageResolver from './resolvers/message.resolver';
import * as groupResolver from './resolvers/group.resolver';
import * as topicResolver from './resolvers/topic.resolver';

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
  const user = await User.create<Partial<IUser>>({
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

export default {
  getHello,
  getUserId,
  register,
  updateFcmToken,
  ...messageResolver,
  ...groupResolver,
  ...topicResolver,
};
