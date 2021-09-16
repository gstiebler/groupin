import './lib/firebase';
import logger from './config/winston';
import { ConnCtx, createConnectionContext } from './db/ConnectionContext';
import { decodeAuthToken } from './lib/auth';

export type Context = {
  userId?: string;
  externalId?: string;
  db: ConnCtx;
};

const connectionContextPromise = createConnectionContext();

export async function getContext(authToken: string): Promise<Context> {
  const connection = await connectionContextPromise;
  if (authToken) {
    const decodedToken = decodeAuthToken(authToken);
    return {
      userId: decodedToken.userId,
      externalId: decodedToken.externalId,
      db: connection
    };
  }
  return { db: connection };
}
