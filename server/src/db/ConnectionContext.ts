import { defaultTypeOrmConfig } from './TypeormConnectionParams';
import { Topic } from './entity/Topic.entity';
import { UserGroup } from './entity/UserGroup.entity';
import { Group } from './entity/Group.entity';
import { Message } from './entity/Message.entity';
import { TopicLatestRead } from './entity/TopicLatestRead.entity';
import { PinnedTopic } from './entity/PinnedTopic.entity';
import { User } from './entity/User.entity';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

const contextFromConnection = (connection: Connection) => ({
  connection,
  userRepository: connection.getRepository(User),
  groupRepository: connection.getRepository(Group),
  topicRepository: connection.getRepository(Topic),
  messageRepository: connection.getRepository(Message),
  userGroupRepository: connection.getRepository(UserGroup),
  topicLatestReadRepository: connection.getRepository(TopicLatestRead),
  pinnedTopicRepository: connection.getRepository(PinnedTopic),
});

export type ConnCtx = ReturnType<typeof contextFromConnection>;

// TODO: generic DB here
export async function createConnectionContext() {
  const mergedTypeormConfig: ConnectionOptions = {
    ...defaultTypeOrmConfig,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  };
  const connection = await createConnection(mergedTypeormConfig);
  return contextFromConnection(connection);
}
