
const { graphql } = require('graphql');
const schema = require('./src/graphqlSchema');

async function main(event) {
  console.log(event);
  const result = await graphql(schema, event);
  return result;
}

module.exports = { main };
