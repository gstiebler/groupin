import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
} from "../constants/action-types";
import * as server from '../lib/server';

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
  const topics = await server.getTopicsOfGroup(groupId, 20, '');
  dispatch({ type: SET_TOPICS, payload: { topics } });
}

export async function getMessagesOfTopic(dispatch, topicId) {
  const messages = await server.getMessagesOfTopic(topicId, 20, '');
  dispatch({ type: SET_MESSAGES, payload: { messages } });
}
