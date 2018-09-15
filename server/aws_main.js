
const { graphql } = require('graphql');
const schema = require('./src/graphqlSchema');
const logger = require('./src/config/winston');

async function main(event) {
  logger.debug(event);
  const result = await graphql(schema, event);
  return result;
}

module.exports = { main };
