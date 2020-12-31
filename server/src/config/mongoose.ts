import * as mongoose from 'mongoose';
import logger from './winston';

let db;
export async function init() {
  const mongoURL = process.env.MONGODB_URL;
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
