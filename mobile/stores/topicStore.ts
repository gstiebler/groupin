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
    private rootActions: RootStore
  ) {
    this.rootActions = rootActions;
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
    // is `currentlyViewedTopicId` redundant with `topicId`?
    this.rootActions.currentlyViewedTopicId = topicId;
    this.rootActions.hasOlderMessages = true;
  
    const currentMessages = (await storage.getItem(topicId)) as GiMessage[];
    this.rootActions.messages = currentMessages;
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
    await storage.setItem(topicId, getNNew(messages, NUM_ITEMS_PER_FETCH));
    this.rootActions.messages = messages;
    subscribeFn(formatDataTopicId(topicId));
  }
  
  async onTopicClosed(params: {
    topicId: string,
    unsubscribeFn: SubscribeFunction
  }) {
    const { topicId, unsubscribeFn } = params;
    this.rootActions.currentlyViewedTopicId = undefined;
    this.rootActions.messages = [];
    server.setTopicLatestRead(topicId);
    const currentTopic = _.find(this.rootActions.topics, { id: topicId });
    // TODO: move this logic to the server?
    if (!currentTopic?.pinned) {
      unsubscribeFn(formatDataTopicId(topicId));
    }
  }

  async createTopic(params: { groupId: string, name: string }) {
    await server.createTopic({ topicName: params.name, groupId: params.groupId });
  }
}
