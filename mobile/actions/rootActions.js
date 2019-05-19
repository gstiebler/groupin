import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,FCM_TOKEN,
} from "../constants/action-types";
import * as server from '../lib/server';
const _ = require('lodash');

const NUM_ITEMS_PER_FETCH = 20;

export const sendMessages = (messages) => async (dispatch, getState) => {
  const { topicId } = getState().chat;
  const firstMessage = messages[0];
  await server.sendMessage({
    message: firstMessage.text,
    userName: 'teste',
    topicId,
  });
  dispatch({ type: ADD_MESSSAGES, payload: { messages } });
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
  if (!store.currentlyViewedGroupId) { return }
  const topics = await server.getTopicsOfGroup(store.currentlyViewedGroupId, NUM_ITEMS_PER_FETCH, '');
  store.dispatch({ type: SET_TOPICS, payload: { topics } });
}

export async function getMessagesOfTopic(dispatch, topicId) {
  const messages = await server.getMessagesOfTopic(topicId, NUM_ITEMS_PER_FETCH, '');
  dispatch({ type: SET_MESSAGES, payload: { messages } });
}

export async function getMessagesOfCurrentTopic(store) {
  if (!store.currentlyViewedTopicId) { return }
  const messages = await server.getMessagesOfTopic(store.currentlyViewedTopicId, NUM_ITEMS_PER_FETCH, '');
  store.dispatch({ type: SET_MESSAGES, payload: { messages } });
}

export const leaveGroup = (groupId, navigation) => async (dispatch, getState) => {
  await server.leaveGroup(groupId);
  await fetchOwnGroups(dispatch);
  navigation.navigate('GroupList');
}

export const updateFcmToken = async (store, fcmToken) => {
  store.dispatch({ type: FCM_TOKEN, payload: { fcmToken } });
  if (!_.isEmpty(store.base.token)) {
    await server.updateFcmToken(fcmToken);
  }
}
