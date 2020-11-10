const { 
  ADD_NEW_MESSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
  FCM_TOKEN,
  HAS_OLDER_MESSAGES,
} = require("../constants/action-types");
const server = require('../lib/server');
const _ = require('lodash');
const { 
  mergeMessages, 
  getFirst,
} = require('../lib/messages');

const { NUM_ITEMS_PER_FETCH } = require('../constants/domainConstants');

const sendMessages = (messages) => async (dispatch, getState) => {
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

async function fetchOwnGroups(dispatch) {
  const ownGroups = await server.getOwnGroups();
  dispatch({ type: SET_OWN_GROUPS, payload: { ownGroups } });
}

async function getTopicsOfGroup(dispatch, groupId) {
  const topics = await server.getTopicsOfGroup(groupId, NUM_ITEMS_PER_FETCH, '');
  dispatch({ type: SET_TOPICS, payload: { topics } });
}

async function getTopicsOfCurrentGroup(store) {
  if (!store.getState().base.currentlyViewedGroupId) { return }
  const topics = await server.getTopicsOfGroup(store.getState().base.currentlyViewedGroupId, NUM_ITEMS_PER_FETCH, '');
  store.dispatch({ type: SET_TOPICS, payload: { topics } });
}

const onOlderMessagesRequested = (topicId) => async (dispatch, getState) => {
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

async function getMessagesOfCurrentTopic(store, storage) {
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

const updateFcmToken = async (store, fcmToken) => {
  store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
  await server.updateFcmToken(fcmToken);
}
const setTopicPin = ({ topicId, pinned }) => async (dispatch, getState) => {
  await server.setTopicPin({ topicId, pinned });
  const currentGroupId = getState().base.currentlyViewedGroupId;
  if (!currentGroupId) { return }
  await getTopicsOfGroup(dispatch, currentGroupId);
}

module.exports = {
  sendMessages,
  fetchOwnGroups,
  getTopicsOfGroup,
  getTopicsOfCurrentGroup,
  onOlderMessagesRequested,
  getMessagesOfCurrentTopic,
  updateFcmToken,
  setTopicPin,
};
