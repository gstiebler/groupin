import Pusher from 'pusher-js/react-native';
Pusher.logToConsole = true;

var pusher = new Pusher('4974ec89e0a5848e53a5', {
  cluster: 'us2',
  encrypted: true
});

export function subscribe(channelName, eventName, callback) {
  let channel = pusher.subscribe(channelName);
  channel.bind(eventName, callback);
} 
