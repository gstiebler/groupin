import * as admin from 'firebase-admin';
import * as _ from 'lodash';
import logger from './config/winston';
import { User } from './db/entity/User';
import { connectionPromise } from './db/createTypeormConnection';

type ContextOutter = ReturnType<typeof getContext>;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type Context = ThenArg<ContextOutter>;

export async function getContext(
  authFbToken: string
) {
  const connection = await connectionPromise;
  let user: User | undefined = undefined;
  let firebaseId: string | null = null;
  // ***
  if (authFbToken) {
    logger.debug(authFbToken);
    // authFbToken comes from the client app
    const decodedToken = await admin.auth().verifyIdToken(authFbToken);
    firebaseId = decodedToken.uid;
    const userRepository = connection.getRepository(User);
    user = await userRepository.findOne({ externalId: firebaseId });
    return { user, externalId: firebaseId, db: connection };
  }
  return { user: undefined, externalId: undefined, db: connection };
}
