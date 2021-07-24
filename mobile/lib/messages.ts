import _ from 'lodash';

export type MessageUser = {
  _id: string;
  name: string;
  avatar: string;
}

export type GiMessage = {
  _id: string;
  text: string;
  createdAt: Date;
  user: MessageUser;
}

export function mergeMessages(olderMessages: GiMessage[], newerMessages: GiMessage[]): GiMessage[] {
  return [...newerMessages, ...olderMessages];
}

export function getFirst(messages: GiMessage[]): GiMessage | undefined {
  return _.last(messages);
}

export function getLast(messages: GiMessage[]): GiMessage | undefined {
  return _.first(messages);
}

export function removeFirst(messages: GiMessage[]): GiMessage[] {
  return _.initial(messages);
}

export function getNNew(messages: GiMessage[], n: number) {
  return messages.slice(0, n);
}
