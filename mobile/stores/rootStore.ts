import * as server from '../lib/server';
import _ from 'lodash';
import { mergeMessages, getFirst, GiMessage } from '../lib/messages';

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';
import { TopicStore } from './topicStore';

export type Topic = {
  id: string;
  pinned: boolean;
};

export class RootStore {
  topicStore: TopicStore = new TopicStore(this);
  messages: GiMessage[] = [];
  topics: Topic[] = []; // TODO: change name to `topicsOfGroup`
  fcmToken: string = null;
  userId = '';
  currentlyViewedGroupId: string = null;
  currentlyViewedTopicId: string = null;
  hasOlderMessages = false;

  constructor(
    public groupStore
  ) {}

  setUserId(userId: string) {
    this.userId = userId;
  }

  addNewMessages(newMessages: GiMessage[]) {
    this.messages = mergeMessages(this.messages, newMessages);
  }

  async sendMessages(messages: GiMessage[]) {
    const firstMessage = messages[0];
    const newMessageId = await server.sendMessage({
      message: firstMessage.text,
      topicId: this.topicStore.topicId,
    });
    const newMessages = [{ ...firstMessage, _id: newMessageId }];
    this.addNewMessages(newMessages);
  }
  
  async getTopicsOfGroup(groupId: string) {
    this.topics = await server.getTopicsOfGroup(groupId, NUM_ITEMS_PER_FETCH, '');
  }
  
  async getTopicsOfCurrentGroup() {
    if (!this.currentlyViewedGroupId) { return }
    this.topics = await server.getTopicsOfGroup(this.currentlyViewedGroupId, NUM_ITEMS_PER_FETCH, '');
  }
  
  async onOlderMessagesRequested(topicId: string) {
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
  
  async updateFcmToken(fcmToken: string) {
    this.fcmToken = fcmToken;
    await server.updateFcmToken(fcmToken);
  }

  async setTopicPin({ topicId, pinned }) {
    await server.setTopicPin({ topicId, pinned });
    if (!this.currentlyViewedGroupId) { return }
    await this.getTopicsOfGroup(this.currentlyViewedGroupId);
  }

  async setCurrentlyViewedGroup(groupId: string) {
    this.currentlyViewedGroupId = groupId;
    this.getTopicsOfGroup(groupId);
  }

  async leaveGroup() {
    this.currentlyViewedGroupId = null;
    this.topics = [];
  }
}
