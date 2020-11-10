import { 
  ADD_NEW_MESSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
  FCM_TOKEN,
  HAS_OLDER_MESSAGES,
} from "../constants/action-types";
import * as server from '../lib/server';
import * as _ from 'lodash';
import { 
  mergeMessages, 
  getFirst,
} from '../lib/messages';

import { NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';

export const sendMessages = (messages) => async (dispatch, getState) => {
  const { topicId } = getState().chat;
  const firstMessage = messages[0];
  const newMessageId = await server.sendMessage({
    message: firstMessage.text,
    topicId,
  });
  const payload = {
    messages: [{ ...firstMessage, _id: newMessageId }]
  };
  dispatch({ type: ADD_NEW_MESSAGES, payload });
}

export async function fetchOwnGroups(dispatch) {
  const ownGroups = await server.getOwnGroups();
  dispatch({ type: SET_OWN_GROUPS, payload: { ownGroups } });
}

export async function getTopicsOfGroup(dispatch, groupId) {
  const topics = await server.getTopicsOfGroup(groupId, NUM_ITEMS_PER_FETCH, '');
  dispatch({ type: SET_TOPICS, payload: { topics } });
}

export async function getTopicsOfCurrentGroup(store) {
  if (!store.getState().base.currentlyViewedGroupId) { return }
  const topics = await server.getTopicsOfGroup(store.getState().base.currentlyViewedGroupId, NUM_ITEMS_PER_FETCH, '');
  store.dispatch({ type: SET_TOPICS, payload: { topics } });
}

export const onOlderMessagesRequested = (topicId) => async (dispatch, getState) => {
  const currentMessages = getState().base.messages;
  if (_.isEmpty(currentMessages)) { return }
  const firstMessage = getFirst(currentMessages);
  const olderMessages = await server.getMessagesOfTopic({ 
    topicId, 
    limit: NUM_ITEMS_PER_FETCH, 
    beforeId: firstMessage._id,
  });

  const payload = {
    messages: mergeMessages(olderMessages, currentMessages),
  }
  dispatch({ type: SET_MESSAGES, payload });
  if (olderMessages.length < NUM_ITEMS_PER_FETCH) {
    dispatch({ type: HAS_OLDER_MESSAGES, payload: { hasOlderMessages: false } });
  }
}

export async function getMessagesOfCurrentTopic(store, storage) {
  if (!store.getState().base.currentlyViewedTopicId) { return }
  const topicId = store.getState().base.currentlyViewedTopicId;
  const messages = await server.getMessagesOfTopic({
    topicId, 
    limit: NUM_ITEMS_PER_FETCH,
  });
  store.dispatch({ type: SET_MESSAGES, payload: { messages } });
  // TODO: test line below
  await storage.setItem(topicId, messages);
}

export const updateFcmToken = async (store, fcmToken) => {
  store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
  await server.updateFcmToken(fcmToken);
}

export const setTopicPin = ({ topicId, pinned }) => async (dispatch, getState) => {
  await server.setTopicPin({ topicId, pinned });
  const currentGroupId = getState().base.currentlyViewedGroupId;
  if (!currentGroupId) { return }
  await getTopicsOfGroup(dispatch, currentGroupId);
}

