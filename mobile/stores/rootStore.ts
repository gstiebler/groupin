import * as server from '../lib/server';
import * as _ from 'lodash';
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
  userId = '';
  currentlyViewedGroupId = '';
  currentlyViewedTopicId = '';
  hasOlderMessages = false;

  setMessagesAction = (messages: GiMessage[]) => { this.messages = messages; };
  setTopicsAction = (topics: Topic[]) => { this.topics = topics; };
  setUserIdAction = (userId: string) => { this.userId = userId; };
  setHasOlderMessagesAction = (hasOlderMessages: boolean) => { this.hasOlderMessages = hasOlderMessages; };
  setCurrentViewedTopicId = (topicId: string) => { this.currentlyViewedGroupId = topicId; }
  setCurrentViewedGroupId = (topicId: string) => { this.currentlyViewedTopicId = topicId; }

  constructor(
    private storage: IStorage,
    public groupStore: GroupStore
  ) {}

  addNewMessages(newMessages: GiMessage[]): void {
    this.setMessagesAction(mergeMessages(this.messages, newMessages));
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
    this.setTopicsAction(await server.getTopicsOfGroup(groupId, NUM_ITEMS_PER_FETCH));
  }
  
  async getTopicsOfCurrentGroup(): Promise<void> {
    if (!this.currentlyViewedGroupId) { return }
    this.setTopicsAction(await server.getTopicsOfGroup(this.currentlyViewedGroupId, NUM_ITEMS_PER_FETCH));
  }
  
  async onOlderMessagesRequested(topicId: string): Promise<void> {
    if (_.isEmpty(this.messages)) { return }
    const firstMessage = getFirst(this.messages);
    const olderMessages = await server.getMessagesOfTopic({ 
      topicId, 
      limit: NUM_ITEMS_PER_FETCH, 
      beforeId: firstMessage?._id,
    });
  
    this.setMessagesAction(mergeMessages(olderMessages, this.messages));
    if (olderMessages.length < NUM_ITEMS_PER_FETCH) {
      this.setHasOlderMessagesAction(false);
    }
  }
  
  async getMessagesOfCurrentTopic(): Promise<void> {
    if (!this.currentlyViewedTopicId) { return }
    const topicId = this.currentlyViewedTopicId;
    const messages = await server.getMessagesOfTopic({
      topicId, 
      limit: NUM_ITEMS_PER_FETCH,
    });
    this.setMessagesAction(messages);
    await this.storage.setMessages(topicId, this.messages);
  }

  async setTopicPin(params: { topicId: string, pinned: boolean }) {
    const { topicId, pinned } = params;
    await server.setTopicPin({ topicId, pinned });
    if (!this.currentlyViewedGroupId) { return }
    await this.getTopicsOfGroup(this.currentlyViewedGroupId);
  }

  async setCurrentlyViewedGroup(groupId: string) {
    this.setCurrentViewedGroupId(groupId);
    await this.getTopicsOfGroup(groupId);
  }

  leaveGroup() {
    this.setCurrentViewedTopicId(undefined);
    this.topics = [];
  }
}
