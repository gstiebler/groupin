const graphql = require('./graphqlConnect');

async function register({name, userName, password}) {
  const query = `
    mutation {
      register (
        name: "${name}",
        userName: "${userName}"
        password: "${password}",
      ) {
        token,
        id,
        errorMessage
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.register;
}

async function login({ userName, password }) {
  const query = `
    mutation {
      login (
        userName: "${userName}"
        password: "${password}",
      ) {
        token,
        id,
        errorMessage
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.login;
}

async function sendMessage({message, userName, topicId}) {
  const query = `
    mutation {
      sendMessage (
        message: "${message}",
        userName: "${userName}"
        topicId: "${topicId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.sendMessage;
}

async function createGroup(groupName) {
  const query = `
    mutation {
      createGroup (
        groupName: "${groupName}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.createGroup;
}

async function joinGroup(groupId) {
  const query = `
    mutation {
      joinGroup (
        groupId: "${groupId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.joinGroup;
}

async function leaveGroup(groupId) {
  const query = `
    mutation {
      leaveGroup (
        groupId: "${groupId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.leaveGroup;
}

async function createTopic({ topicName, groupId }) {
  const query = `
    mutation {
      createTopic (
        topicName: "${topicName}",
        groupId: "${groupId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.createTopic;
}

async function getOwnGroups() {
  const query = `
    query {
      ownGroups {
        id,
        name,
        imgUrl
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.ownGroups;
}

async function findGroups({ searchText, limit, startingId }) {
  const query = `
    query {
      findGroups(
        searchText: "${searchText}",
        limit: ${limit},
        startingId: "${startingId}"
      ) {
        id,
        name,
        imgUrl
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.findGroups;
}

async function getTopicsOfGroup(groupId, limit, startingId) {
  const query = `
    query {
      topicsOfGroup (
        groupId: "${groupId}",
        limit: ${limit},
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
  const query = `
    query {
      messagesOfTopic (
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

async function updateFcmToken(fcmToken) {
  const query = `
    mutation {
      updateFcmToken (
        fcmToken: "${fcmToken}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.updateFcmToken;
}

module.exports = {
  register,
  login,
  sendMessage,
  createGroup,
  createTopic,
  getOwnGroups,
  findGroups,
  getTopicsOfGroup,
  getMessagesOfTopic,
  joinGroup,
  leaveGroup,
  updateFcmToken,
};
