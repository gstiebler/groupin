export type JwtDecodedToken = {
  userId?: string;
  externalId: string;
};

// TODO: share with mobile
export type MessageType = 'NEW_MESSAGE' | 'NEW_TOPIC';
