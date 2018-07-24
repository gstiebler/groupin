var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '565224',
  key: '381fa8ae298bff616f63',
  secret: '9a7546de53842d842d58',
  cluster: 'us2',
  encrypted: true
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

pusher.trigger('my-channel', 'my-event', {
  "message": {
    text: "Test message assim assado",
    createdAt: Date.now(),
    _id: getRandomInt(1000000),
    user: {
      _id: 42
    }
  }
});
