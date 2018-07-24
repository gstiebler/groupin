import { ADD_MESSSAGES } from "../constants/action-types";
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
