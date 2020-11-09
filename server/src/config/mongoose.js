const mongoose = require('mongoose');
const logger = require('./winston');

let db;
async function init() {
  const mongoURL = process.env.MONGODB_URL;
  mongoose.Promise = global.Promise;
  mongoose.set('useFindAndModify', false);

  await mongoose.disconnect();

  try {
    db = await mongoose.connect(mongoURL, { useNewUrlParser: true });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error);
  }
}

function disconnect() {
  return mongoose.disconnect();
}

module.exports = {
  init,
  disconnect,
  db,
};
