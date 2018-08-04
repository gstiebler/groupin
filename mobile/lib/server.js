const graphql = require('./graphqlConnect');

async function sendMessage(message) {
  const query = `
    mutation {
      sendMessage (message: "${message}")
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.sendMessage;
}

module.exports = {
  sendMessage,
};
