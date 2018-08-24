import { 
  ADD_MESSSAGES,
  SET_OWN_GROUPS,
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

export const setOwnGroups = (ownGroups) => ({ 
  type: SET_OWN_GROUPS, 
  ownGroups,
});

export async function fetchOwnGroups() {
  const ownGroups = await server.getOwnGroups();
  console.log(ownGroups);
  store.dispatch(setOwnGroups(ownGroups));
}
