import logger from '../config/winston';
import { createMongooseConnection } from './mongooseConnection';
import * as mongoose from 'mongoose';
import GroupModel from './schema/Group';
import MessageModel from './schema/Message';
import UserModel from './schema/User';
import PinnedTopicModel from './schema/PinnedTopic';
import TopicModel from './schema/Topic';
import TopicLatestReadModel from './schema/TopicLatestRead';
import UserGroupModel from './schema/UserGroup';
import { envConfig } from '../config/envConfig';

const contextFromConnection = (connection: typeof mongoose) => ({
  connection,
  User: UserModel,
  Group: GroupModel,
  Message: MessageModel,
  PinnedTopic: PinnedTopicModel,
  Topic: TopicModel,
  TopicLatestRead: TopicLatestReadModel,
  UserGroup: UserGroupModel,
});

export type ConnCtx = ReturnType<typeof contextFromConnection>;

// TODO: generic DB here
export async function createConnectionContext() {
  try {
    const connection = await createMongooseConnection(envConfig.MONGODB_URL ?? '');
    return contextFromConnection(connection!);
  } catch (error) {
    logger.error(`Error connecting to ${envConfig.MONGODB_URL}: ${error}`);
    throw new Error(error);
  }
}
