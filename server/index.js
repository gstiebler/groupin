const pushMessage = require('./pushService');

exports.postMessage = (req, res) => {
  pushMessage('my-channel', req.body);
  res.send('OK');
};
