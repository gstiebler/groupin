import jwt from 'jsonwebtoken';

type JwtDecodedToken = {
  userId?: string;
  externalId: string;
};

export function decodeAuthToken(authToken: string) {
  const decodedObj = jwt.decode(authToken);
  return decodedObj as JwtDecodedToken;
}
