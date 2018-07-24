require('dotenv').config();
const express = require('express');
const app = express();
const pushService = require('./pushService');

app.post('/message', function (req, res) {
  console.log(req.body);
  res.send('OK');
  pusher.trigger('my-channel', 'my-event', {
    "message": "hello world"
  });
});

app.listen(process.env.PORT);
