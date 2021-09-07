import jwt from 'jsonwebtoken';
import { envConfig } from '../config/envConfig';
import { JwtDecodedToken } from './types';

export function encodeAuthToken(jwtDecodedToken: JwtDecodedToken): string {
  return jwt.sign(jwtDecodedToken, envConfig.JWT_SECRET!);
}

export function decodeAuthToken(token: string): JwtDecodedToken {
  const decoded = jwt.verify(token, envConfig.JWT_SECRET!);
  return decoded! as JwtDecodedToken;
}
