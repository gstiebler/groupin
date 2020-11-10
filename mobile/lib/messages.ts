import * as _ from 'lodash';

export function mergeMessages(olderMessages, newerMessages) {
  return [...newerMessages, ...olderMessages];
}

export function getFirst(messages): any {
  return _.last(messages);
}

export function getLast(messages): any {
  return _.first(messages);
}

export function removeFirst(messages) {
  return _.initial(messages);
}

export function getNNew(messages, n) {
  return messages.slice(0, n);
}
