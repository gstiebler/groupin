const Pusher = require('pusher');

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true,
});

const DEFAULT_EVENT = 'my-event';

function pushMessage(channel, payload) {
  pusher.trigger(channel, DEFAULT_EVENT, payload);
}

module.exports = { 
  pushMessage,
};
