import jwt_decode from "jwt-decode";

type JwtDecodedToken = {
  userId?: string;
  externalId: string;
};

export function decodeAuthToken(authToken: string) {
  const decodedObj = jwt_decode(authToken);
  return decodedObj as JwtDecodedToken;
}
