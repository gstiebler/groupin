import * as server from '../lib/server';
import _ from 'lodash';
import { mergeMessages, getFirst, GiMessage } from '../lib/messages';

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';
import { TopicStore } from './topicStore';
import { GroupStore } from './groupStore';
import { IStorage } from '../types/Storage.types';

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
  notificationToken: string;
  userId = '';
  currentlyViewedGroupId?: string;
  currentlyViewedTopicId?: string;
  hasOlderMessages = false;

  constructor(
    private storage: IStorage,
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
    const newMessages = [{ ...firstMessage, id: newMessageId }];
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
      beforeId: firstMessage?._id,
    });
  
    this.messages = mergeMessages(olderMessages, this.messages);
    if (olderMessages.length < NUM_ITEMS_PER_FETCH) {
      this.hasOlderMessages = false;
    }
  }
  
  async getMessagesOfCurrentTopic(): Promise<void> {
    if (!this.currentlyViewedTopicId) { return }
    const topicId = this.currentlyViewedTopicId;
    this.messages = await server.getMessagesOfTopic({
      topicId, 
      limit: NUM_ITEMS_PER_FETCH,
    });
    // TODO: test line below
    await this.storage.setItem(topicId, this.messages);
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
    this.currentlyViewedGroupId = undefined;
    this.topics = [];
  }
}
