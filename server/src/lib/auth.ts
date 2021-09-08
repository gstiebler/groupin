import * as jwt from 'jsonwebtoken';
import * as firebaseAdmin from 'firebase-admin';
import { envConfig } from '../config/envConfig';
import { JwtDecodedToken } from './types';

export function encodeAuthToken(jwtDecodedToken: JwtDecodedToken): string {
  return jwt.sign(jwtDecodedToken, envConfig.JWT_SECRET!);
}

export function decodeAuthToken(token: string): JwtDecodedToken {
  const decoded = jwt.verify(token, envConfig.JWT_SECRET!);
  return decoded! as JwtDecodedToken;
}

export async function getFirebaseUserId(firebaseAuthToken: string): Promise<string> {
  const decodedFirebaseToken = await firebaseAdmin.auth().verifyIdToken(firebaseAuthToken);
  return decodedFirebaseToken.sub;
}
