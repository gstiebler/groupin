import { defaultTypeOrmConfig } from './TypeormConnectionParams';
import { Topic } from './entity/Topic.entity';
import { UserGroup } from './entity/UserGroup.entity';
import { Group } from './entity/Group.entity';
import { Message } from './entity/Message.entity';
import { TopicLatestRead } from './entity/TopicLatestRead.entity';
import { PinnedTopic } from './entity/PinnedTopic.entity';
import { User } from './entity/User.entity';
import { Connection, createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

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
export async function createConnectionContext(typeormConfig: Partial<PostgresConnectionOptions>) {
  const mergedTypeormConfig: PostgresConnectionOptions = {
    ...defaultTypeOrmConfig,
    ...typeormConfig,
  };
  const connection = await createConnection(mergedTypeormConfig);
  return contextFromConnection(connection);
}
