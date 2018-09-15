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
const Message = require('./db/schema/Message');

const ObjectId = require('mongoose').Types.ObjectId;

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
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      return topicsOfGroup.map(topic => ({ ...topic, id: topic._id }));
    }
  },

  messagesOfTopic: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: 'messagesOfTopicType',
        fields: {
          _id: { type: GraphQLString },
          text: { type: GraphQLString },
          createdAt: { type: GraphQLFloat },
          user: { 
            type: new GraphQLObjectType({
              name: 'userType',
              fields: {
                _id: { type: GraphQLString },
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
    async resolve(root, { userId, topicId, limit, startingId }, source, fieldASTs) {
      const messages = await Message.aggregate([
        {
          $match: {
            topic: ObjectId(topicId),
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            text: '$text',
            createdAt: '$createdAt',
            'user._id': '$user._id',
            'user.name': '$user.name',
            'user.avatar': '$user.imgUrl',
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: limit },
      ]);
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