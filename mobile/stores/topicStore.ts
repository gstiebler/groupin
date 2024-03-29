import * as server from '../lib/server';
import * as _ from 'lodash';
import { mergeMessages, getFirst, getLast, removeFirst, getNNew, GiMessage } from '../lib/messages';

const formatDataTopicId = (topicId: string) => `data.${topicId}`;

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';
import { IStorage } from '../types/Storage.types';
import { GroupStore } from './groupStore';

type SubscribeFunction = (formattedTopicId: string) => void;

export class TopicStore {
  topicTitle = '';
  currentlyViewedTopicId? = '';
  messages: GiMessage[] = [];
  sentMessages: GiMessage[] = [];
  hasOlderMessages = false;

  setTopicTitleAction = (topicTitle: string) => { this.topicTitle = topicTitle; };
  setCurrentViewedTopicId = (topicId?: string) => { this.currentlyViewedTopicId = topicId; }
  setMessagesAction = (messages: GiMessage[]) => { this.messages = messages; };
  setSentMessagesAction = (messages: GiMessage[]) => { this.sentMessages = messages; };
  setHasOlderMessagesAction = (hasOlderMessages: boolean) => { this.hasOlderMessages = hasOlderMessages; };

  constructor(
    private groupStore: GroupStore,
    private storage: IStorage,
  ) {}

  get messagesView() {
    return mergeMessages(this.messages, this.sentMessages);
  }

  async onTopicOpened(params: {
    topicId: string,
    topicName: string,
    storage: IStorage,
    subscribeFn: SubscribeFunction
  }) {
    const { topicId, topicName, storage, subscribeFn } = params;
    this.setTopicTitleAction(topicName);
    this.setCurrentViewedTopicId(topicId);
    this.setHasOlderMessagesAction(true);
  
    const currentMessages = await storage.getMessages(topicId);
    this.setMessagesAction(currentMessages);
    const messagesEmpty = _.isEmpty(currentMessages);
    let messages;
    if (messagesEmpty) {
      messages = await server.getMessagesOfTopic({ topicId, limit: NUM_ITEMS_PER_FETCH });
    } else {
      const lastCurrMessageId = getLast(currentMessages)?._id;
      messages = await server.getMessagesOfTopic({ 
        topicId, 
        limit: NUM_ITEMS_PER_FETCH,
        afterId: lastCurrMessageId,
      });
      if (_.isEmpty(messages)) { return }
      const firstNewMessageId = getFirst(messages)?._id;
      // there's no hole, then messages can be merged
      if (lastCurrMessageId === firstNewMessageId) {
        messages = mergeMessages(currentMessages, removeFirst(messages));
      }
    }
    await storage.setMessages(topicId, getNNew(messages, NUM_ITEMS_PER_FETCH));
    this.setMessagesAction(messages);
    subscribeFn(formatDataTopicId(topicId));
  }

  clear() {
    this.setCurrentViewedTopicId(undefined);
    this.setMessagesAction([]);
    this.setSentMessagesAction([]);
  }
  
  async onTopicClosed(params: {
    topicId: string,
    unsubscribeFn: SubscribeFunction
  }) {
    this.clear();
    const { topicId, unsubscribeFn } = params;
    server.setTopicLatestRead(topicId);
    const currentTopic = _.find(this.groupStore.topics, { id: topicId });
    // TODO: move this logic to the server?
    if (!currentTopic?.pinned) {
      unsubscribeFn(formatDataTopicId(topicId));
    }
  }

  async createTopic(params: { groupId: string, name: string }) {
    await server.createTopic({ topicName: params.name, groupId: params.groupId });
  }

  async fetchMessagesOfCurrentTopic(): Promise<void> {
    if (!this.currentlyViewedTopicId) { return }
    const topicId = this.currentlyViewedTopicId;
    const messages = await server.getMessagesOfTopic({
      topicId,
      limit: NUM_ITEMS_PER_FETCH,
    });
    this.setSentMessagesAction([]);
    this.setMessagesAction(messages);
    await this.storage.setMessages(topicId, this.messages);
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

  addNewMessages(newMessages: GiMessage[]): void {
    this.setMessagesAction(mergeMessages(this.messages, newMessages));
  }

  async sendMessages(messages: GiMessage[]): Promise<void> {
    const sentMessages = mergeMessages(this.sentMessages, messages);
    this.setSentMessagesAction(sentMessages);

    const firstMessage = messages[0];
    await server.sendMessage({
      message: firstMessage.text,
      topicId: this.currentlyViewedTopicId!,
    });
  }
}
