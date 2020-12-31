require('dotenv').config();
const logger = require('./src/config/winston');
const mongooseConfig = require('./src/config/mongoose');
const graphqlMain = require('./src/graphqlMain');
const pushService = require('./src/lib/pushService');

pushService.init();
const mongooseInitPromise = mongooseConfig.init();

async function main(event) {
  try {
    await mongooseInitPromise;
    // It seems the case of A depends on the platform
    const authorization = event.headers.Authorization || event.headers.authorization;
    const result = await graphqlMain.main(JSON.parse(event.body), authorization);

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
