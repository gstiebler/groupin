
require('dotenv').config();
const logger = require('./src/config/winston');
const mongooseConfig = require('./src/config/mongoose');
const { main } = require('./src/graphqlMain');

let mongooseInitPromise = mongooseConfig.init();

async function main(event) {
  try {
    await mongooseInitPromise;
    const result = await main(JSON.parse(event.body), event.token);

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
