const graphql = require('./graphqlConnect');

async function sendMessage(message) {
  const res = await graphql.sendQuery('{ hello }');
  return res.hello;
}

module.exports = {
  sendMessage,
};
