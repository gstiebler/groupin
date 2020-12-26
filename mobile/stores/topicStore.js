const server = require('../lib/server');
const _ = require('lodash');
const { 
  mergeMessages, 
  getFirst,
  getLast, 
  removeFirst,
  getNNew,
} = require('../lib/messages');

const formatDataTopicId = (topicId) => `data.${topicId}`;

const { NUM_ITEMS_PER_FETCH } = require('../constants/domainConstants');

class TopicStore {

  constructor(rootActions) {
    this.rootActions = rootActions;
    this.topicTitle = '';
    this.topicId = '';
  }

  async onTopicOpened({topicId, topicName, storage, subscribeFn}) {
    this.topicTitle = topicName;
    this.topicId = topicId;
    // is `currentlyViewedTopicId` redundant with `topicId`?
    this.rootActions.currentlyViewedTopicId = topicId;
    this.rootActions.hasOlderMessages = true;
  
    const currentMessages = await storage.getItem(topicId);
    this.rootActions.messages = currentMessages;
    const messagesEmpty = _.isEmpty(currentMessages);
    let messages;
    if (messagesEmpty) {
      messages = await server.getMessagesOfTopic({ topicId, limit: NUM_ITEMS_PER_FETCH });
    } else {
      const lastCurrMessageId = getLast(currentMessages)._id;
      messages = await server.getMessagesOfTopic({ 
        topicId, 
        limit: NUM_ITEMS_PER_FETCH,
        afterId: lastCurrMessageId,
      });
      if (_.isEmpty(messages)) { return }
      const firstNewMessageId = getFirst(messages)._id;
      // there's no hole, then messages can be merged
      if (lastCurrMessageId === firstNewMessageId) {
        messages = mergeMessages(currentMessages, removeFirst(messages));
      }
    }
    await storage.setItem(topicId, getNNew(messages, NUM_ITEMS_PER_FETCH));
    this.rootActions.messages = messages;
    subscribeFn(formatDataTopicId(topicId));
  }
  
  async onTopicClosed({topicId, unsubscribeFn}) {
    this.rootActions.currentlyViewedTopicId = null;
    this.rootActions.messages = [];
    server.setTopicLatestRead(topicId);
    const currentTopic = _.find(this.rootActions.topics, { id: topicId });
    // TODO: move this logic to the server?
    if (!currentTopic.pinned) {
      unsubscribeFn(formatDataTopicId(topicId));
    }
  }

}

module.exports = TopicStore;
