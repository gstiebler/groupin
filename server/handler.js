
require('dotenv').config();
const logger = require('./src/config/winston');
const mongooseConfig = require('./src/config/mongoose');
const graphqlMain = require('./src/graphqlMain');
let pushService = require('./src/lib/pushService');

pushService.init();
let mongooseInitPromise = mongooseConfig.init();

async function main(event) {
  try {
    await mongooseInitPromise;
    const result = await graphqlMain.main(JSON.parse(event.body), event.headers.Authorization);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch(error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: 'Internal GroupIn server error',
    };
  }
}

module.exports = { main };
