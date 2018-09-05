import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
  SET_TOPICS,
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
  console.log(ownGroups);
  store.dispatch(setOwnGroups(ownGroups));
}

const setTopics = (topics) => ({ 
  type: SET_TOPICS, 
  topics,
});

export async function getTopicsOfGroup(dispatch, groupId) {
  console.log(groupId);
  const topics = await server.getTopicsOfGroup(groupId, 20, '');
  console.log(topics);
  dispatch(setTopics(topics));
}
