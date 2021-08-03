import * as mongoose from 'mongoose';
import logger from '../config/winston';

export async function createMongooseConnection(mongoURL: string): Promise<typeof mongoose | undefined> {
  mongoose.set('useFindAndModify', false);
  mongoose.set('bufferCommands', false);

  await mongoose.disconnect();

  try {
    const db = await mongoose.connect(mongoURL);
    logger.info('Connected to MongoDB');
    return db;
  } catch (error) {
    logger.error(error);
  }
}
