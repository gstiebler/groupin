import * as mongoose from 'mongoose';
import logger from '../config/winston';

export async function createMongooseConnection(mongoURL: string): Promise<typeof mongoose | undefined> {
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('bufferCommands', false);
  mongoose.set('debug', !!process.env.DEBUG_MONGOOSE);

  await mongoose.disconnect();

  try {
    const db = await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
    logger.info('Connected to MongoDB');
    return db;
  } catch (error) {
    logger.error(error);
  }
}
