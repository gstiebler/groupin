import createConnection from './createTypeormConnection';
import { Topic } from './entity/Topic.entity';
import { UserGroup } from './entity/UserGroup.entity';
import { Group } from './entity/Group.entity';
import { Message } from './entity/Message.entity';
import { TopicLatestRead } from './entity/TopicLatestRead.entity';
import { PinnedTopic } from './entity/PinnedTopic.entity';
import { User } from './entity/User.entity';
import { Connection } from 'typeorm';

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

export type ConnectionContext = ReturnType<typeof contextFromConnection>;

export async function createConnectionContext() {
  const connection = await createConnection();
  return contextFromConnection(connection);
}
