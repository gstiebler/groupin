import * as server from '../lib/server';
import * as _ from 'lodash';
import { mergeMessages, getFirst, getLast, removeFirst, getNNew, GiMessage } from '../lib/messages';

const formatDataTopicId = (topicId: string) => `data.${topicId}`;

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';
import { RootStore } from './rootStore';
import { IStorage } from '../types/Storage.types';

type SubscribeFunction = (formattedTopicId: string) => void;

export class TopicStore {
  topicTitle: string;
  topicId: string;

  constructor(
    private rootStore: RootStore
  ) {
    this.rootStore = rootStore;
    this.topicTitle = '';
    this.topicId = '';
  }

  async onTopicOpened(params: {
    topicId: string,
    topicName: string,
    storage: IStorage,
    subscribeFn: SubscribeFunction
  }) {
    const { topicId, topicName, storage, subscribeFn } = params;
    this.topicTitle = topicName;
    this.topicId = topicId;
    // TODO: is `currentlyViewedTopicId` redundant with `topicId`?
    this.rootStore.currentlyViewedTopicId = topicId;
    this.rootStore.hasOlderMessages = true;
  
    const currentMessages = await storage.getMessages(topicId);
    this.rootStore.messages = currentMessages;
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
    this.rootStore.messages = messages;
    subscribeFn(formatDataTopicId(topicId));
  }
  
  async onTopicClosed(params: {
    topicId: string,
    unsubscribeFn: SubscribeFunction
  }) {
    const { topicId, unsubscribeFn } = params;
    this.rootStore.currentlyViewedTopicId = undefined;
    this.rootStore.messages = [];
    server.setTopicLatestRead(topicId);
    const currentTopic = _.find(this.rootStore.topics, { id: topicId });
    // TODO: move this logic to the server?
    if (!currentTopic?.pinned) {
      unsubscribeFn(formatDataTopicId(topicId));
    }
  }

  async createTopic(params: { groupId: string, name: string }) {
    await server.createTopic({ topicName: params.name, groupId: params.groupId });
  }
}
