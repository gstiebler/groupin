import * as server from '../lib/server';
import _ from 'lodash';
import { mergeMessages, getFirst, getLast, removeFirst, getNNew } from '../lib/messages';

const formatDataTopicId = (topicId) => `data.${topicId}`;

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';

export class TopicStore {
  topicTitle: string;
  topicId: string;

  constructor(
    private rootActions
  ) {
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
