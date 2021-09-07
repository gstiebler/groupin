import * as dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URL: process.env.MONGODB_URL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
  WINSTON_CONSOLE_LEVEL: process.env.WINSTON_CONSOLE_LEVEL,
  WINSTON_FILE_LEVEL: process.env.WINSTON_FILE_LEVEL,
  DEBUG_MONGOOSE: process.env.DEBUG_MONGOOSE,
};
