import { subscribeToAll } from './lib/subscription';

import * as messageResolver from './resolvers/message.resolver';
import * as groupResolver from './resolvers/group.resolver';
import * as topicResolver from './resolvers/topic.resolver';
import { User } from './db/entity/User';
import { Connection } from 'typeorm';

async function getHello({ pass }) {
  return pass === 'foca' ? 'OK' : 'ERROR';
}

async function getUserId(args, { user }, ) {
  if (!user) {
    return { id: 'NO USER' };
  }
  return { id: user._id.toHexString() };
}

async function register({ name }, { firebaseId, connection }: { firebaseId: string, connection: Connection }) {
  const previousUser = await connection.getRepository(User).findOne({ externalId: firebaseId });
  if (previousUser) {
    throw new Error('User is already registered');
  }
  const user = await connection.getRepository(User).save({
    name,
    externalId: firebaseId,
  });

  return {
    errorMessage: '',
    id: user.id,
  };
}

async function updateFcmToken({ fcmToken }, { user, connection }: { user: User, connection: Connection }) {
  if (!user) {
    throw new Error('A user is required to update FCM token');
  }
  user.notificationToken = fcmToken;
  await connection.getRepository(User).save(user);
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
