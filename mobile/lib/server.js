// TODO: replace by redux-saga
import store from "../store/index";
import { addMessages } from '../actions/index';

import axios from 'axios';


export async function sendMessage(message) {
  const url = 'https://us-central1-chat-534f7.cloudfunctions.net/function-2';
  try {
    const res = await axios.post(url, message);
    console.log(res);
  } catch(err) {
    console.error(err);
  }
}

import Pusher from 'pusher-js/react-native';
Pusher.logToConsole = true;

var pusher = new Pusher('381fa8ae298bff616f63', {
  cluster: 'us2',
  encrypted: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
  console.log(JSON.stringify(data));
  store.dispatch(addMessages([data.message]));
});
