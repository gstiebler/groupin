const { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
  FCM_TOKEN,
  NO_OLDER_MESSAGES,
} = require("../constants/action-types");
const server = require('../lib/server');
const _ = require('lodash');

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
  dispatch({ type: ADD_MESSSAGES, payload });
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
  dispatch({ type: NO_OLDER_MESSAGES, payload: { noOlderMessages: false } });
  const currentMessages = await storage.getItem(topicId);
  const messagesEmpty = _.isEmpty(currentMessages);
  let messages;
  if (messagesEmpty) {
    messages = await server.getMessagesOfTopic({ topicId, limit: NUM_ITEMS_PER_FETCH });
  } else {
    const lastMessageId = _.last(currentMessages);
    messages = await server.getMessagesOfTopic({ 
      topicId, 
      limit: NUM_ITEMS_PER_FETCH,
      afterId: lastMessageId,
    });
    if (_.isEmpty(messages)) { return }
    // there's no hole, then messages can be merged
    if (messages[0]._id === lastMessageId) {
      messages = [
        ...currentMessages, 
        ...messages.slice(1),
      ];
    }
  }
  await storage.setItem(topicId, messages.slice(0, NUM_ITEMS_PER_FETCH));
  dispatch({ type: SET_MESSAGES, payload: { messages } });
}

const onOlderMessagesRequested = (topicId) => async (dispatch, getState) => {
  const currentMessages = getState().base.messages;
  if (_.isEmpty(currentMessages)) { return }
  const firstMessage = currentMessages[0];
  const messages = await server.getMessagesOfTopic({ 
    topicId, 
    limit: NUM_ITEMS_PER_FETCH, 
    beforeId: firstMessage._id,
  });

  const payload = {
    messages: [
      ...messages, 
      ...currentMessages,
    ],
  }
  dispatch({ type: SET_MESSAGES, payload });
  if (messages.length < NUM_ITEMS_PER_FETCH) {
    dispatch({ type: NO_OLDER_MESSAGES, payload: { noOlderMessages: true } });
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
  await storage.setItem(topicId, messages.slice(0, NUM_ITEMS_PER_FETCH));
}

const leaveGroup = (groupId, navigation) => async (dispatch, getState) => {
  await server.leaveGroup(groupId);
  await fetchOwnGroups(dispatch);
  navigation.navigate('GroupList');
}

const updateFcmToken = async (store, fcmToken) => {
  store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
  if (!_.isEmpty(store.getState().base.token)) {
    await server.updateFcmToken(fcmToken);
  }
}

module.exports = {
  sendMessages,
  fetchOwnGroups,
  getTopicsOfGroup,
  getTopicsOfCurrentGroup,
  onTopicOpened,
  onOlderMessagesRequested,
  getMessagesOfCurrentTopic,
  leaveGroup,
  updateFcmToken,
};
