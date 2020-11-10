import * as  graphql from './graphqlConnect';

export async function register({ name }) {
  const query = `
    mutation Register($name: String!) {
      register(name: $name) {
        errorMessage
      }
    }
  `;
  const res = await graphql.sendQuery(query, { name });
  return res.register;
}

export async function sendMessage({ message, topicId }) {
  const query = `
    mutation SendMessage($message: String!, $topicId: String!) {
      sendMessage (
        message: $message,
        topicId: $topicId,
      )
    }
  `;
  const res = await graphql.sendQuery(query, { message, topicId });
  return res.sendMessage;
}

export async function createGroup({ groupName, visibility }) {
  const query = `
    mutation CreateGroup($groupName: String!, $visibility: String!) {
      createGroup (
        groupName: $groupName,
        visibility: $visibility
      )
    }
  `;
  const res = await graphql.sendQuery(query, { groupName, visibility });
  return res.createGroup;
}

export async function joinGroup(groupId) {
  const query = `
    mutation JoinGroup($groupId: String!) {
      joinGroup (
        groupId: $groupId,
      )
    }
  `;
  const res = await graphql.sendQuery(query, { groupId });
  return res.joinGroup;
}

export async function leaveGroup(groupId) {
  const query = `
    mutation {
      leaveGroup (
        groupId: "${groupId}",
      )
    }
  `;
  const res = await graphql.sendQuery(query, { groupId });
  return res.leaveGroup;
}

export async function createTopic({ topicName, groupId }) {
  const query = `
    mutation CreateTopic($topicName: String!, $groupId: String!) {
      createTopic (
        topicName: $topicName,
        groupId: $groupId
      )
    }
  `;
  const res = await graphql.sendQuery(query, { topicName, groupId });
  return res.createTopic;
}

export async function setTopicLatestRead(topicId) {
  const query = `
    mutation SetTopicLatestRead($topicId: String!) {
      setTopicLatestRead (
        topicId: $topicId,
      )
    }
  `;
  const res = await graphql.sendQuery(query, { topicId });
  return res.setTopicLatestRead;
}

export async function getUserId() {
  const query = `
    query {
      getUserId { id }
    }
  `;
  const res = await graphql.sendQuery(query);
  return res.getUserId;
}

export async function getOwnGroups() {
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

export async function findGroups({ searchText, limit, startingId }) {
  const query = `
    query FindGroups($searchText: String!, $limit: Float!, $startingId: String!) {
      findGroups(
        searchText: $searchText,
        limit: $limit,
        startingId: $startingId
      ) {
        id,
        name,
        imgUrl
      }
    }
  `;
  const res = await graphql.sendQuery(query, { searchText, limit, startingId });
  return res.findGroups;
}

export async function getTopicsOfGroup(groupId, limit, startingId) {
  const query = `
    query TopicsOfGroup($groupId: String!, $limit: Float!, $startingId: String!) {
      topicsOfGroup (
        groupId: $groupId,
        limit: $limit,
        startingId: $startingId
      ) {
        id,
        name,
        imgUrl,
        unread,
        pinned
      }
    }
  `;
  const res = await graphql.sendQuery(query, { groupId, limit, startingId });
  return res.topicsOfGroup;
}

export interface IgetMessagesOfTopic {
  topicId: string;
  limit: number;
  beforeId?: string;
  afterId?: string;
}
export async function getMessagesOfTopic({ topicId, limit, beforeId, afterId }: IgetMessagesOfTopic) {
  const query = `
    query MessagesOfTopic($topicId: String!, $limit: Float!, $beforeId: String, $afterId: String) {
      messagesOfTopic (
        topicId: $topicId,
        limit: $limit,
        beforeId: $beforeId,
        afterId: $afterId
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
  const res = await graphql.sendQuery(query, { topicId, limit, beforeId, afterId });
  return res.messagesOfTopic;
}

export async function updateFcmToken(fcmToken) {
  const query = `
    mutation UpdateFcmToken($fcmToken: String) {
      updateFcmToken (
        fcmToken: $fcmToken
      )
    }
  `;
  const res = await graphql.sendQuery(query, { fcmToken });
  return res.updateFcmToken;
}

export async function getGroupInfo(groupId) {
  const query = `
    query GetGroupInfo($groupId: String) {
      getGroupInfo (
        groupId: $groupId
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
  const res = await graphql.sendQuery(query, { groupId });
  return res.getGroupInfo;
}

export async function setGroupPin({ groupId, pinned }) {
  const query = `
    mutation SetGroupPin($groupId: String, $pinned: Boolean) {
      setGroupPin (
        groupId: $groupId,
        pinned: $pinned
      )
    }
  `;
  const res = await graphql.sendQuery(query, { groupId, pinned });
  return res.setGroupPin;
}

export async function setTopicPin({ topicId, pinned }) {
  const query = `
    mutation SetTopicPin($topicId: String, $pinned: Boolean) {
      setTopicPin (
        topicId: $topicId,
        pinned: $pinned
      )
    }
  `;
  const res = await graphql.sendQuery(query, { topicId, pinned });
  return res.setTopicPin;
}
