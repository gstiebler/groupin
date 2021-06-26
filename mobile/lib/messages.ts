const _ = require('lodash');

function mergeMessages(olderMessages, newerMessages) {
  return [...newerMessages, ...olderMessages];
}

function getFirst(messages) {
  return _.last(messages);
}

function getLast(messages) {
  return _.first(messages);
}

function removeFirst(messages) {
  return _.initial(messages);
}

function getNNew(messages, n) {
  return messages.slice(0, n);
}

module.exports = {
  mergeMessages,
  getFirst,
  getLast,
  removeFirst,
  getNNew,
}
