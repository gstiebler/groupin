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
        .sort({ updatedAt: -1 })
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
        .sort({ updatedAt: -1 })
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
      message: { type: GraphQLString },
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      userName: { type: GraphQLString },
      topicId: { type: GraphQLString },
    },
    async resolve(root, { message, userId, userName, topicId }, source, fieldASTs) {
      // TODO: make calls to DB in parallel when possible
      // TODO: check user permissions for topic/group
      await Message.create({
        text: message,
        user: userId,
        topic: topicId,
      });

      // update topic updatedAt
      await Topic.updateOne(
        { _id: ObjectId(topicId) },
        { $set: { updatedAt: Date.now() } }  
      );

      // update group updatedAt
      const topic = await Topic.findById(topicId);
      await Group.updateOne(
        { _id: topic.groupId },
        { $set: { updatedAt: Date.now() } }  
      );

      // send push notification
      const pushPayload = {
        message,
        authorName: userName,
        topicId,
      };
      pushService.pushMessage('my-channel', pushPayload);

      return 'OK';
    }
  },

  createGroup: {
    type: GraphQLString,
    args: { 
      userId: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
      groupName: { type: GraphQLString },
    },
    async resolve(root, { userId, groupName }) {
      const newGroup = await Group.create({
        name: groupName,
        createdBy: ObjectId(userId),
      });

      await User.update(
        { _id: ObjectId(userId) },
        { $push: { groups: newGroup._id } }
      );

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
    async resolve(root, { userId, topicName, groupId }) {
      let topicCreatePromise = Topic.create({
        name: topicName,
        groupId: ObjectId(groupId),
        createdBy: ObjectId(userId),
      });

      let groupUpdatePromise = Group.updateOne(
        { _id: ObjectId(groupId) },
        { 
          $set: { 
            updatedAt: Date.now(),
          }
        },
      );

      await Promise.all([
        topicCreatePromise,
        groupUpdatePromise,
      ]);

      const pushPayload = {
        topicName,
      };
      pushService.pushMessage(groupId, pushPayload);
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