
require('dotenv').config();
const { graphql } = require('graphql');
const schema = require('./src/graphqlSchema');
const logger = require('./src/config/winston');
const mongooseConfig = require('./config/mongoose');

mongooseConfig.init();

async function main(event) {
  logger.debug(event);
  const result = await graphql(schema, event);
  return result;
}

module.exports = { main };
