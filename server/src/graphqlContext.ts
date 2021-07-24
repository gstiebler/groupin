import * as admin from 'firebase-admin';
import logger from './config/winston';
import { ConnCtx, createConnectionContext } from './db/ConnectionContext';
import { User } from './db/entity/User.entity';

export type Context = {
  user?: User;
  externalId?: string;
  db: ConnCtx;
};

const connectionContextPromise = createConnectionContext({
  host: 'localhost',
  database: 'groupin_dev',
});

export async function getContext(
  authFbToken: string
): Promise<Context> {
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
