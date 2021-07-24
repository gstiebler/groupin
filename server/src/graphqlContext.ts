import * as admin from 'firebase-admin';
import logger from './config/winston';
import { User } from './db/entity/User.entity';
import createConnection from './db/createTypeormConnection';
import { Topic } from './db/entity/Topic.entity';
import { UserGroup } from './db/entity/UserGroup.entity';
import { Group } from './db/entity/Group.entity';
import { Message } from './db/entity/Message.entity';
import { TopicLatestRead } from './db/entity/TopicLatestRead.entity';
import { PinnedTopic } from './db/entity/PinnedTopic.entity';


type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type ContextOutter = ReturnType<typeof getContext>;
export type Context = ThenArg<ContextOutter>;

type ConnectionContextOutter = ReturnType<typeof createConnectionContext>;
export type ConnCtx = ThenArg<ConnectionContextOutter>;

async function createConnectionContext() {
  const connection = await createConnection();
  return {
    connection,
    userRepository: connection.getRepository(User),
    groupRepository: connection.getRepository(Group),
    topicRepository: connection.getRepository(Topic),
    messageRepository: connection.getRepository(Message),
    userGroupRepository: connection.getRepository(UserGroup),
    topicLatestReadRepository: connection.getRepository(TopicLatestRead),
    pinnedTopicRepository: connection.getRepository(PinnedTopic),
  };
}

const connectionContextPromise = createConnectionContext();

export async function getContext(
  authFbToken: string
) {
  const connection = await connectionContextPromise;
  let user: User | undefined = undefined;
  let firebaseId: string | null = null;
  // ***
  if (authFbToken) {
    logger.debug(authFbToken);
    // authFbToken comes from the client app
    const decodedToken = await admin.auth().verifyIdToken(authFbToken);
    firebaseId = decodedToken.uid;
    user = await connection.userRepository.findOne({ externalId: firebaseId });
    return { user, externalId: firebaseId, db: connection };
  }
  return { user: undefined, externalId: undefined, db: connection };
}
