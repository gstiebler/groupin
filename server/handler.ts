import dotenv from 'dotenv';
dotenv.config();
import logger from './src/config/winston';
import * as graphqlMain from './src/graphqlMain';
import pushService from './src/lib/pushService';
import { connectionPromise } from './src/db/createTypeormConnection';

pushService.init();

async function main(event) {
  try {
    const connection = await connectionPromise;
    // It seems the case of A depends on the platform
    const authorization = event.headers.Authorization || event.headers.authorization;
    const result = await graphqlMain.main(JSON.parse(event.body), authorization, connection);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: 'Internal GroupIn server error',
    };
  }
}

module.exports = { main };
