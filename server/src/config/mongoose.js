const mongoose = require('mongoose');
const logger = require('./winston');

let db;
async function init() {
  const isProduction = process.env.NODE_ENV === 'production';
  const dbName = isProduction ? process.env.MONGODB_DB_NAME : process.env.MONGODB_TEST_DB_NAME;
  const port = process.env.MONGODB_PORT;
  const dbHost = process.env.MONGODB_HOST;
  const userPwStr = process.env.MONGODB_USER ? `${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@` : '';
  const mongoURL = `mongodb://${userPwStr}${dbHost}:${port}/${dbName}`;
  mongoose.Promise = global.Promise;

  await mongoose.disconnect();

  try {
    db = await mongoose.connect(mongoURL, {useNewUrlParser: true });
    logger.info('Connected to MongoDB');

  } catch(error) {
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
