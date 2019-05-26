const { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
  FCM_TOKEN,
} = require("../constants/action-types");
const server = require('../lib/server');
const _ = require('lodash');

const NUM_ITEMS_PER_FETCH = 20;

const sendMessages = (messages) => async (dispatch, getState) => {
  const { topicId } = getState().chat;
  const firstMessage = messages[0];
  await server.sendMessage({
    message: firstMessage.text,
    topicId,
  });
  dispatch({ type: ADD_MESSSAGES, payload: { messages } });
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

async function getMessagesOfTopic(dispatch, topicId) {
  const messages = await server.getMessagesOfTopic(topicId, NUM_ITEMS_PER_FETCH, '');
  dispatch({ type: SET_MESSAGES, payload: { messages } });
}

async function getMessagesOfCurrentTopic(store) {
  if (!store.getState().base.currentlyViewedTopicId) { return }
  const messages = await server.getMessagesOfTopic(store.getState().base.currentlyViewedTopicId, NUM_ITEMS_PER_FETCH, '');
  store.dispatch({ type: SET_MESSAGES, payload: { messages } });
}

const leaveGroup = (groupId, navigation) => async (dispatch, getState) => {
  await server.leaveGroup(groupId);
  await fetchOwnGroups(dispatch);
  navigation.navigate('GroupList');
}

const updateFcmToken = async (store, fcmToken) => {
  store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
  if (!_.isEmpty(store.base.token)) {
    await server.updateFcmToken(fcmToken);
  }
}

module.exports = {
  sendMessages,
  fetchOwnGroups,
  getTopicsOfGroup,
  getTopicsOfCurrentGroup,
  getMessagesOfTopic,
  getMessagesOfCurrentTopic,
  leaveGroup,
  updateFcmToken,
};
