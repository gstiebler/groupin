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

async function getOwnGroups() {
  const userId = 'userId';
  const query = `
    query {
      ownGroups (
        userId: "${userId}"
      ) {
        id,
        name,
        imgUrl
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.ownGroups;
}

module.exports = {
  sendMessage,
  getOwnGroups,
};
