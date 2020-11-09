import * as mongoose from 'mongoose';
import * as logger from 'winston';

let db;
export async function init() {
  const dbName = process.env.MONGODB_DB_NAME;
  const port = process.env.MONGODB_PORT;
  const dbHost = process.env.MONGODB_HOST;
  const userPwStr = process.env.MONGODB_USER ? `${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@` : '';
  const prodUrl = process.env.MONGODB_PROD_URL;
  const mongoURL = `mongodb://${userPwStr}${dbHost}:${port}/${dbName}${prodUrl}`;
  require('mongoose').Promise = global.Promise;
  mongoose.set('useFindAndModify', false);

  await mongoose.disconnect();

  try {
    db = await mongoose.connect(mongoURL, { useNewUrlParser: true });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error);
  }
}

export function disconnect() {
  return mongoose.disconnect();
}
