const graphql = require('./graphqlConnect');

async function sendMessage(message, userId, userName, topicId) {
  const query = `
    mutation {
      sendMessage (
        message: "${message}",
        userId: "${userId}"
        userName: "${userName}"
        topicId: "${topicId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.sendMessage;
}

async function createGroup(groupName, userId) {
  const query = `
    mutation {
      createGroup (
        userId: "${userId}",
        groupName: "${groupName}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.createGroup;
}

async function joinGroup(groupId) {
  const userId = 'userId';
  const query = `
    mutation {
      joinGroup (
        userId: "${userId}",
        groupId: "${groupId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.joinGroup;
}

async function leaveGroup(groupId) {
  const userId = 'userId';
  const query = `
    mutation {
      leaveGroup (
        userId: "${userId}",
        groupId: "${groupId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.leaveGroup;
}

async function createTopic({ topicName, groupId, userId }) {
  const query = `
    mutation {
      createTopic (
        userId: "${userId}",
        topicName: "${topicName}",
        groupId: "${groupId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.createTopic;
}

async function getOwnGroups(userId) {
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
  createGroup,
  createTopic,
  getOwnGroups,
  getTopicsOfGroup,
  getMessagesOfTopic,
  joinGroup,
  leaveGroup,
};
