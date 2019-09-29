const { 
  ADD_NEW_MESSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
  FCM_TOKEN,
  FB_USER_TOKEN,
  HAS_OLDER_MESSAGES,
} = require("../constants/action-types");
const server = require('../lib/server');
const _ = require('lodash');
const { 
  mergeMessages, 
  getFirst,
  getLast, 
  removeFirst,
  getNNew,
} = require('../lib/messages');
const graphqlConnect = require('../lib/graphqlConnect');

const NUM_ITEMS_PER_FETCH = 20;

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

const onTopicOpened = (topicId, storage) => async (dispatch) => {
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

const updateFbUserToken = async (dispatch, fbUserToken) => {
  graphqlConnect.setToken(fbUserToken);
  dispatch({ type: FB_USER_TOKEN, payload: { fbUserToken } });
}

const updateFcmToken = async (store, fcmToken) => {
  store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
  if (_.isEmpty(store.getState().base.fbUserToken)) {
    throw new Error('Firebase user token is not set');
  }
  await server.updateFcmToken(fcmToken);
}

module.exports = {
  sendMessages,
  fetchOwnGroups,
  getTopicsOfGroup,
  getTopicsOfCurrentGroup,
  onTopicOpened,
  onOlderMessagesRequested,
  getMessagesOfCurrentTopic,
  updateFbUserToken,
  updateFcmToken,
};
