const graphql = require('./graphqlConnect');

async function sendMessage(message, topicId, authorName) {
  const query = `
    mutation {
      sendMessage (
        message: "${message}",
        topicId: "${topicId}",
        authorName: "${authorName}"
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.sendMessage;
}

module.exports = {
  sendMessage,
};
