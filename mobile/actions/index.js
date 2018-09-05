import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
  SET_MESSAGES,
} from "../constants/action-types";
import * as server from '../lib/server';

// TODO: replace by redux-saga
import store from "../store/index";

export const addMessages = messages => ({ 
  type: ADD_MESSSAGES, 
  messages,
});

export function sendMessages(messages) {
  server.sendMessage(messages[0]);
  store.dispatch(addMessages(messages));
}

const setOwnGroups = (ownGroups) => ({ 
  type: SET_OWN_GROUPS, 
  ownGroups,
});

export async function fetchOwnGroups() {
  const ownGroups = await server.getOwnGroups();
  store.dispatch(setOwnGroups(ownGroups));
}

const setTopics = (topics) => ({ 
  type: SET_TOPICS, 
  topics,
});

export async function getTopicsOfGroup(dispatch, groupId) {
  const topics = await server.getTopicsOfGroup(groupId, 20, '');
  dispatch(setTopics(topics));
}

const setMessages = (messages) => ({ 
  type: SET_MESSAGES, 
  messages,
});

export async function getMessagesOfTopic(dispatch, topicId) {
  const topics = await server.getMessagesOfTopic(topicId, 20, '');
  dispatch(setMessages(topics));
}
