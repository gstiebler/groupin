const graphql = require('./graphqlConnect');

async function register({ name }) {
  const query = `
    mutation {
      register (
        name: "${name}",
      ) {
        errorMessage
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.register;
}

async function sendMessage({message, topicId}) {
  const query = `
    mutation {
      sendMessage (
        message: "${message}",
        topicId: "${topicId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.sendMessage;
}

async function createGroup({ groupName, visibility }) {
  const query = `
    mutation {
      createGroup (
        groupName: "${groupName}",
        visibility: "${visibility}"
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

async function setTopicLatestRead(topicId) {
  const query = `
    mutation {
      setTopicLatestRead (
        topicId: "${topicId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.setTopicLatestRead;
}

async function getUserId() {
  const query = `
    query {
      getUserId { id }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.getUserId;
}

async function getOwnGroups() {
  const query = `
    query {
      ownGroups {
        id,
        name,
        imgUrl,
        unread,
        pinned
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
        imgUrl,
        unread,
        pinned
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.topicsOfGroup;
}

async function getMessagesOfTopic({ topicId, limit, beforeId, afterId }) {
  let fields = [
    `topicId: "${topicId}"`,
    `limit: ${limit}`,
    ...(beforeId ? [`beforeId: "${beforeId}"`] : []),
    ...(afterId ? [`afterId: "${afterId}"`] : []),
  ];
  const query = `
    query {
      messagesOfTopic (
        ${fields.join(',')}
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

async function getGroupInfo(groupId) {
  const query = `
    query {
      getGroupInfo (
        groupId: "${groupId}",
      ) {
        _id,
        friendlyId,
        name,
        imgUrl,
        description,
        visibility,
        createdBy,
        createdAt,
        iBelong
      }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.getGroupInfo;
}

async function setGroupPin({ groupId, pinned }) {
  const query = `
    mutation {
      setGroupPin (
        groupId: "${groupId}",
        pinned: ${pinned},
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.setGroupPin;
}

async function setTopicPin({ topicId, pinned }) {
  const query = `
    mutation {
      setTopicPin (
        topicId: "${topicId}",
        pinned: ${pinned},
      )
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.setTopicPin;
}


module.exports = {
  getUserId,
  register,
  sendMessage,
  createGroup,
  createTopic,
  setTopicLatestRead,
  getOwnGroups,
  findGroups,
  getTopicsOfGroup,
  getMessagesOfTopic,
  joinGroup,
  leaveGroup,
  updateFcmToken,
  getGroupInfo,
  setGroupPin,
  setTopicPin,
};
