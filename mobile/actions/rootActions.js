import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
} from "../constants/action-types";
import * as server from '../lib/server';

import store from "../store/rootStore";

export const addMessages = messages => ({ type: ADD_MESSSAGES, payload: { messages } });

export async function sendMessages(dispatch, messages) {
  const firstMessage = messages[0];
  await server.sendMessage({
    message: firstMessage.text,
    userId: firstMessage.user._id,
    userName: 'teste',
    topicId: 'teste',
  });
  dispatch(addMessages(messages));
}

export async function fetchOwnGroups() {
  const ownGroups = await server.getOwnGroups();
  store.dispatch({ type: SET_OWN_GROUPS, payload: { ownGroups } });
}

export async function getTopicsOfGroup(dispatch, groupId) {
  const topics = await server.getTopicsOfGroup(groupId, 20, '');
  dispatch({ type: SET_TOPICS, payload: { topics } });
}

export async function getMessagesOfTopic(dispatch, topicId) {
  const messages = await server.getMessagesOfTopic(topicId, 20, '');
  dispatch({ type: SET_MESSAGES, payload: { messages } });
}
