// TODO: replace by redux-saga
import store from "../store/rootStore";
import { addMessages } from '../actions/rootActions';

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
