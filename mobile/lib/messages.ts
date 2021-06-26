import _ from 'lodash';
import { Message } from 'react-native-gifted-chat';

    /*{
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },*/
export interface GiMessage extends Message {
  _id: string;
  text: string;
}

export function mergeMessages(olderMessages: GiMessage[], newerMessages: GiMessage[]): GiMessage[] {
  return [...newerMessages, ...olderMessages];
}

export function getFirst(messages: GiMessage[]): GiMessage {
  return _.last(messages);
}

export function getLast(messages: GiMessage[]): GiMessage {
  return _.first(messages);
}

export function removeFirst(messages: GiMessage[]): GiMessage[] {
  return _.initial(messages);
}

export function getNNew(messages: Message[], n: number) {
  return messages.slice(0, n);
}
