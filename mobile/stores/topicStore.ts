import * as server from '../lib/server';
import * as _ from 'lodash';
import { mergeMessages, getFirst, getLast, removeFirst, getNNew, GiMessage } from '../lib/messages';

const formatDataTopicId = (topicId: string) => `data.${topicId}`;

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';
import { RootStore } from './rootStore';
import { IStorage } from '../types/Storage.types';

type SubscribeFunction = (formattedTopicId: string) => void;

export class TopicStore {
  topicTitle = '';
  topicId = '';

  setTopicTitleAction = (topicTitle: string) => { this.topicTitle = topicTitle; };
  setTopicIdAction = (topicId: string) => { this.topicId = topicId; };

  constructor(
    private rootStore: RootStore
  ) {
    this.rootStore = rootStore;
  }

  async onTopicOpened(params: {
    topicId: string,
    topicName: string,
    storage: IStorage,
    subscribeFn: SubscribeFunction
  }) {
    const { topicId, topicName, storage, subscribeFn } = params;
    this.setTopicTitleAction(topicName);
    this.setTopicIdAction(topicId);
    // TODO: is `currentlyViewedTopicId` redundant with `topicId`?
    this.rootStore.setCurrentViewedTopicId(topicId);
    this.rootStore.setHasOlderMessagesAction(true);
  
    const currentMessages = await storage.getMessages(topicId);
    this.rootStore.setMessagesAction(currentMessages);
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
    this.rootStore.setMessagesAction(messages);
    subscribeFn(formatDataTopicId(topicId));
  }
  
  async onTopicClosed(params: {
    topicId: string,
    unsubscribeFn: SubscribeFunction
  }) {
    const { topicId, unsubscribeFn } = params;
    this.rootStore.setCurrentViewedTopicId(undefined);
    this.rootStore.setMessagesAction([]);
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
