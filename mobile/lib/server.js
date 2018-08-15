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

async function getTopicsOfGroup(groupId, limit, startingId) {
  const userId = 'userId';
  const query = `
    query {
      topicsOfGroup (
        userId: "${userId}"
        groupId: "${groupId}"
        limit: ${limit}
        startingId: "${startingId}"
      ) {
        id,
        name,
        imgUrl
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.topicsOfGroup;
}

async function getMessagesOfTopic(topicId, limit, startingId) {
  const userId = 'userId';
  const query = `
    query {
      messagesOfTopic (
        userId: "${userId}"
        topicId: "${topicId}"
        limit: ${limit}
        startingId: "${startingId}"
      ) {
        _id,
        text,
        createdAt,
        user {
          _id,
          name,
          avatar
        }
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.messagesOfTopic;
}

module.exports = {
  sendMessage,
  getOwnGroups,
  getTopicsOfGroup,
  getMessagesOfTopic,
};
