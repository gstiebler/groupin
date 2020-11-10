import { 
  SET_MESSAGES,
  HAS_OLDER_MESSAGES,
  CURRENTLY_VIEWED_TOPIC_ID,
  CHAT_TITLE,
  CHAT_TOPIC_ID,
} from "../constants/action-types";
import * as server from '../lib/server';
import * as  _ from 'lodash';
import { 
  mergeMessages, 
  getFirst,
  getLast, 
  removeFirst,
  getNNew,
} from '../lib/messages';

const formatDataTopicId = (topicId) => `data.${topicId}`;

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';

export const onTopicOpened = ({topicId, topicName, storage, subscribeFn}) => async (dispatch) => {
  dispatch({ type: CHAT_TITLE, payload: { title: topicName } });
  dispatch({ type: CHAT_TOPIC_ID, payload: { topicId } });
  // is `currentlyViewedTopicId` redundant with `topicId`?
  dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { currentlyViewedTopicId: topicId } });

  dispatch({ type: HAS_OLDER_MESSAGES, payload: { hasOlderMessages: true } });
  const currentMessages = await storage.getItem(topicId);
  dispatch({ type: SET_MESSAGES, payload: { messages: currentMessages } });
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
  dispatch({ type: SET_MESSAGES, payload: { messages } });
  subscribeFn(formatDataTopicId(topicId));
}

export const onTopicClosed = ({topicId, unsubscribeFn}) => async (dispatch, getState) => {
  dispatch({ type: CURRENTLY_VIEWED_TOPIC_ID, payload: { currentlyViewedTopicId: null } });
  dispatch({ type: SET_MESSAGES, payload: { messages: [] } });
  server.setTopicLatestRead(topicId);
  const currentTopic = _.find(getState().topics, { id: topicId });
  // TODO: move this logic to the server?
  if (!currentTopic.pinned) {
    unsubscribeFn(formatDataTopicId(topicId));
  }
};
