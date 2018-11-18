
require('dotenv').config();
const { graphql } = require('graphql');
const schema = require('./src/graphqlSchema');
const logger = require('./src/config/winston');
const mongooseConfig = require('./src/config/mongoose');

let mongooseInitPromise = mongooseConfig.init();

async function main(event) {
  try {
    await mongooseInitPromise;
    const result = await graphql(schema, JSON.parse(event.body));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch(error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify('Internal GroupIn server error'),
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}

module.exports = { main };
