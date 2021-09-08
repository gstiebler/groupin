import jwt from 'jsonwebtoken';
import * as server from './server';

type JwtDecodedToken = {
  userId?: string;
  externalId: string;
};

export async function getDecodedAuthToken(firebaseAuthToken: string): Promise<JwtDecodedToken> {
  const authToken = await server.getAuthToken(firebaseAuthToken);
  const decodedObj = jwt.decode(authToken);
  return decodedObj as JwtDecodedToken;
}
