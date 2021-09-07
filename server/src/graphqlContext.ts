import './lib/firebase';
import * as admin from 'firebase-admin';
import logger from './config/winston';
import { ConnCtx, createConnectionContext } from './db/ConnectionContext';
import { User } from './db/schema/User';

export type Context = {
  user: User | null;
  externalId?: string;
  db: ConnCtx;
};

const connectionContextPromise = createConnectionContext();

export async function getContext(
  authFbToken: string
): Promise<Context> {
  const connection = await connectionContextPromise;
  let user: User | null = null;
  let firebaseId: string | null = null;
  // ***
  if (authFbToken) {
    logger.debug(`authFbToken: ${authFbToken}`);
    // authFbToken comes from the client app
    const decodedToken = await admin.auth().verifyIdToken(authFbToken);
    firebaseId = decodedToken.uid;
    user = await connection.User.findOne({ externalId: firebaseId });
    return { user, externalId: firebaseId, db: connection };
  }
  return { user: null, externalId: undefined, db: connection };
}
