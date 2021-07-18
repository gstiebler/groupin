import * as server from '../lib/server';
import _ from 'lodash';
import { mergeMessages, getFirst, GiMessage } from '../lib/messages';

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';
import { TopicStore } from './topicStore';
import { GroupStore } from './groupStore';
import { LocalStorage } from '../rn_lib/localStorage';

export type Topic = {
  id: string;
  name: string;
  pinned: boolean;
  unread: boolean
};

export class RootStore {
  topicStore: TopicStore = new TopicStore(this);
  messages: GiMessage[] = [];
  topics: Topic[] = []; // TODO: change name to `topicsOfGroup`
  notificationToken: string = null;
  userId = '';
  currentlyViewedGroupId: string = null;
  currentlyViewedTopicId: string = null;
  hasOlderMessages = false;

  constructor(
    public groupStore: GroupStore
  ) {}

  setUserId(userId: string): void {
    this.userId = userId;
  }

  addNewMessages(newMessages: GiMessage[]): void {
    this.messages = mergeMessages(this.messages, newMessages);
  }

  async sendMessages(messages: GiMessage[]): Promise<void> {
    const firstMessage = messages[0];
    const newMessageId = await server.sendMessage({
      message: firstMessage.text,
      topicId: this.topicStore.topicId,
    });
    const newMessages = [{ ...firstMessage, _id: newMessageId }];
    this.addNewMessages(newMessages);
  }
  
  async getTopicsOfGroup(groupId: string): Promise<void> {
    this.topics = await server.getTopicsOfGroup(groupId, NUM_ITEMS_PER_FETCH, '');
  }
  
  async getTopicsOfCurrentGroup(): Promise<void> {
    if (!this.currentlyViewedGroupId) { return }
    this.topics = await server.getTopicsOfGroup(this.currentlyViewedGroupId, NUM_ITEMS_PER_FETCH, '');
  }
  
  async onOlderMessagesRequested(topicId: string): Promise<void> {
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
  
  async getMessagesOfCurrentTopic(storage: LocalStorage): Promise<void> {
    if (!this.currentlyViewedTopicId) { return }
    const topicId = this.currentlyViewedTopicId;
    this.messages = await server.getMessagesOfTopic({
      topicId, 
      limit: NUM_ITEMS_PER_FETCH,
    });
    // TODO: test line below
    await storage.setItem(topicId, this.messages);
  }
  
  async updateNotificationToken(notificationToken: string) {
    this.notificationToken = notificationToken;
    await server.updateFcmToken(notificationToken);
  }

  async setTopicPin(params: { topicId: string, pinned: boolean }) {
    const { topicId, pinned } = params;
    await server.setTopicPin({ topicId, pinned });
    if (!this.currentlyViewedGroupId) { return }
    await this.getTopicsOfGroup(this.currentlyViewedGroupId);
  }

  async setCurrentlyViewedGroup(groupId: string) {
    this.currentlyViewedGroupId = groupId;
    await this.getTopicsOfGroup(groupId);
  }
  
  setCurrentViewedTopicId(topicId: string) {
    this.currentlyViewedTopicId = topicId;
  }

  async leaveGroup() {
    this.currentlyViewedGroupId = null;
    this.topics = [];
  }
}
