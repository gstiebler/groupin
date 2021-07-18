import _ from 'lodash';

export interface GiMessage {
  id: string;
  text: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    avatar: string;
  }
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
