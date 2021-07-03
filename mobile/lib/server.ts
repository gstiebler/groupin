import { GiMessage } from "./messages";

import * as graphql from './graphqlConnect';

export async function register(params: { name: string, phoneNumber: string }) {
  const { name, phoneNumber } = params;
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

export async function sendMessage(params: { message: string, topicId: string }): Promise<string> {
  const { message, topicId } = params;
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

export async function createGroup(params: { groupName: string, visibility: string }) {
  const { groupName, visibility } = params;
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

export async function joinGroup(groupId: string) {
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

export async function leaveGroup(groupId: string) {
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

export async function createTopic(params: { topicName: string, groupId: string }) {
  const { topicName, groupId } = params;
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

export async function setTopicLatestRead(topicId: string) {
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

export type Group = {
  id: string;
  name: string;
  imgUrl: string;
  unread: boolean;
  pinned: boolean;
}
export async function getOwnGroups(): Promise<Group[]> {
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

export async function findGroups(params: { searchText: string, limit: number, startingId: string }) {
  const { searchText, limit, startingId } = params;
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

export async function getTopicsOfGroup(groupId: string, limit: number, startingId: string) {
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

type GetMessagesOfTopic = {
  topicId: string;
  limit: number;
  beforeId? : string;
  afterId? : string;
}
export async function getMessagesOfTopic({ topicId, limit, beforeId, afterId }: GetMessagesOfTopic): Promise<GiMessage[]> {
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

export async function updateFcmToken(fcmToken: string) {
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

export type GroupInfo = {
  _id: string;
  friendlyId: string;
  name: string;
  imgUrl: string;
  description: string;
  visibility: string;
  createdBy: string;
  createdAt: string;
  iBelong: boolean;
}
export async function getGroupInfo(groupId: string): Promise<GroupInfo> {
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

export async function setGroupPin(params: { groupId: string, pinned: boolean }) {
  const { groupId, pinned } = params;
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

export async function setTopicPin(params: { topicId: string, pinned: boolean }) {
  const { topicId, pinned } = params;
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
