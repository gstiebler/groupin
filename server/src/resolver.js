const {
  GraphQLString,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
} = require('graphql');

const pushService = require('./pushService');

const Query = {
  ownGroups: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: 'ownGroupsType',
        fields: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
          imgUrl: { type: GraphQLString },
        },
      })
    ),
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
    },
    resolve(root, { userId }, source, fieldASTs) {
      return [
        {
          id: 'groupId1',
          name: 'Group 1',
          imgUrl: 'url1',
        },
        {
          id: 'groupId2',
          name: 'Group 2',
          imgUrl: 'url2',
        },
      ];
    }
  },
  topicsOfGroup: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: 'topicsOfGroupType',
        fields: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
          imgUrl: { type: GraphQLString },
        },
      })
    ),
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      groupId: { type: GraphQLString },
      limit: { type: GraphQLFloat },
      startingId: { type: GraphQLString },
    },
    resolve(root, { userId, groupId, limit, startingId }, source, fieldASTs) {
      const topicsOfGroups = new Map([
        ['groupId1', [
          {
            id: 'topicId1',
            name: 'Topic 1',
            imgUrl: '',
          },
          {
            id: 'topicId2',
            name: 'Topic 2',
            imgUrl: '',
          },
        ]],
        ['groupId2', [
          {
            id: 'topicId3',
            name: 'Topic 4',
            imgUrl: '',
          },
          {
            id: 'topicId4',
            name: 'Topic 4',
            imgUrl: '',
          },
        ]],
      ]);
      return topicsOfGroups.get(groupId);
    }
  },
  messagesOfTopic: {
    type: new GraphQLObjectType({
      name: 'messagesOfTopicType',
      fields: {
        id: { type: GraphQLString },
        authorName: { type: GraphQLString },
        text: { type: GraphQLString },
        moment: { type: GraphQLFloat },
      },
    }),
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      topicId: { type: GraphQLString },
    },
    resolve(root, { userId, topicId }, source, fieldASTs) {
      const messages = [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 3,
          text: 'Hello developer 2',
          createdAt: new Date(),
          user: {
            _id:2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ];
      return messages;
    }
  },
};

const Mutation = {
  sendMessage: {
    type: GraphQLString,
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      message: { type: GraphQLString },
      authorName: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      topicId: { type: GraphQLString },
    },
    resolve(root, { userId, message, authorName, topicId }, source, fieldASTs) {
      const payload = {
        message,
        authorName,
        topicId,
      };
      pushService.pushMessage('my-channel', payload);
      return 'OK';
    }
  },
  createGroup: {
    type: GraphQLString,
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      groupName: { type: GraphQLString },
    },
    resolve(root, { userId, groupName }) {
      return 'OK';
    }
  },
  createTopic: {
    type: GraphQLString,
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      topicName: { type: GraphQLString },
      groupId: { type: GraphQLString },
    },
    resolve(root, { userId, topicName, groupId }) {
      const payload = {
        topicName,
      };
      pushService.pushMessage(groupId, payload);
      return 'OK';
    }
  },
  joinGroup: {
    type: GraphQLString,
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      groupId: { type: GraphQLString },
    },
    resolve(root, { userId, groupId }) {
      return 'OK';
    }
  },
  leaveGroup: {
    type: GraphQLString,
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      groupId: { type: GraphQLString },
    },
    resolve(root, { userId, groupId }) {
      return 'OK';
    }
  },
}

module.exports = {
  Query,
  Mutation,
};