const {
  GraphQLString,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
} = require('graphql');

const Group = require('./db/schema/Group');
const User = require('./db/schema/User');
const Topic = require('./db/schema/Topic');

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
    async resolve(root, { userId }, source, fieldASTs) {
      const user = await User.findById(userId).lean();
      const groups = await Group
        .find({ _id: { $in: user.groups } })
        .sort({ createdAt: -1 })
        .lean();
      return groups.map(group => ({ ...group, id: group._id }));
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
    async resolve(root, { userId, groupId, limit, startingId }, source, fieldASTs) {
      const topicsOfGroup = await Topic.find({ groupId })
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();
      return topicsOfGroup.map(topic => ({ ...topic, id: topic._id }));
    }
  },

  messagesOfTopic: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: 'messagesOfTopicType',
        fields: {
          _id: { type: GraphQLFloat },
          text: { type: GraphQLString },
          createdAt: { type: GraphQLFloat },
          user: { 
            type: new GraphQLObjectType({
              name: 'userType',
              fields: {
                _id: { type: GraphQLFloat },
                name: { type: GraphQLString },
                avatar: { type: GraphQLString },
              }
            }), 
          }
        },
      })
    ),
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      topicId: { type: GraphQLString },
      limit: { type: GraphQLFloat },
      startingId: { type: GraphQLString },
    },
    resolve(root, { userId, topicId, limit, startingId }, source, fieldASTs) {
      const messages = [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: Date.parse('2018-06-01T12:00:00-0800'),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 3,
          text: 'Hello developer 2',
          createdAt: Date.parse('2018-05-01T12:00:00-0800'),
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