const Pusher = require('pusher');

let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true,
});

function pushMessage(channel, payload) {
  pusher.trigger(channel, 'my-event', payload);
}

module.exports = pushMessage;
