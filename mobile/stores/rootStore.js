const server = require('../lib/server');
const _ = require('lodash');
const { 
  mergeMessages, 
  getFirst,
} = require('../lib/messages');

const { NUM_ITEMS_PER_FETCH } = require('../constants/domainConstants');
const TopicStore = require('./topicStore');

class RootStore {

  constructor(groupStore) {
    this.groupStore = groupStore;
    this.topicStore = new TopicStore(this);
    this.messages = [
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
    ];
    this.topics = [], // TODO: change name to `topicsOfGroup`
    this.fcmToken = null,
    this.userId = '',
    this.currentlyViewedGroupId = null;
    this.currentlyViewedTopicId = null;
    this.hasOlderMessages = false;
  }

  addNewMessages(newMessages) {
    this.messages = mergeMessages(this.messages, newMessages);
  }

  async sendMessages(messages) {
    const firstMessage = messages[0];
    const newMessageId = await server.sendMessage({
      message: firstMessage.text,
      topicId: this.topicStore.topicId,
    });
    const newMessages = [{ ...firstMessage, _id: newMessageId }];
    this.addNewMessages(newMessages);
  }
  
  async getTopicsOfGroup(groupId) {
    this.topics = await server.getTopicsOfGroup(groupId, NUM_ITEMS_PER_FETCH, '');
  }
  
  async getTopicsOfCurrentGroup() {
    if (!this.currentlyViewedGroupId) { return }
    this.topics = await server.getTopicsOfGroup(this.currentlyViewedGroupId, NUM_ITEMS_PER_FETCH, '');
  }
  
  async onOlderMessagesRequested(topicId) {
    if (_.isEmpty(this.messages)) { return }
    const firstMessage = getFirst(this.messages);
    const olderMessages = await server.getMessagesOfTopic({ 
      topicId, 
      limit: NUM_ITEMS_PER_FETCH, 
      beforeId: firstMessage._id,
    });
  
    this.messages = mergeMessages(olderMessages, this.messages);
    if (olderMessages.length < NUM_ITEMS_PER_FETCH) {
      this.hasOlderMessages = false;
    }
  }
  
  async getMessagesOfCurrentTopic(storage) {
    if (!this.currentlyViewedTopicId) { return }
    const topicId = this.currentlyViewedTopicId;
    this.messages = await server.getMessagesOfTopic({
      topicId, 
      limit: NUM_ITEMS_PER_FETCH,
    });
    // TODO: test line below
    await storage.setItem(topicId, this.messages);
  }
  
  async updateFcmToken(fcmToken) {
    this.fcmToken = fcmToken;
    await server.updateFcmToken(fcmToken);
  }

  async setTopicPin({ topicId, pinned }) {
    await server.setTopicPin({ topicId, pinned });
    if (!this.currentlyViewedGroupId) { return }
    await this.getTopicsOfGroup(this.currentlyViewedGroupId);
  }

}

module.exports = RootStore;
