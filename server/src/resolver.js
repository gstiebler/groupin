const {
  GraphQLString,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLList,
} = require('graphql');
const Promise = require('bluebird');
const logger = require('./config/winston');
const _ = require('lodash');
const md5 = require('md5');
const userHelper = require('./lib/userHelper');

const Group = require('./db/schema/Group');
const User = require('./db/schema/User');
const Topic = require('./db/schema/Topic');
const Message = require('./db/schema/Message');

const ObjectId = require('mongoose').Types.ObjectId;

const pushService = require('./lib/pushService');

const { numMaxReturnedItems, messageTypes } = require('./lib/constants');


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
    async resolve(root, args, { user }, fieldASTs) {
      if (!user) {
        throw new Error(`Method only available with a user`);
      }

      const groups = await Group
        .find({ _id: { $in: user.groups } })
        .sort({ updatedAt: -1 })
        .lean();
      subscribeToAllGroups(user, user.fcmToken);
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
      groupId: { type: GraphQLString },
      limit: { type: GraphQLFloat },
      startingId: { type: GraphQLString },
    },
    async resolve(root, { groupId, limit, startingId }, { user }, fieldASTs) {
      if (!_.find(user.groups, ObjectId(groupId))) {
        throw new Error(`User does not participate in the group`);
      }
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
      topicId: { type: GraphQLString },
      limit: { type: GraphQLFloat },
      afterId: { type: GraphQLString },
      beforeId: { type: GraphQLString },
    },
    async resolve(root, { topicId, limit, afterId, beforeId }, { user }, fieldASTs) {
      const topic = await Topic.findById(topicId);
      if (!_.find(user.groups, topic.groupId)) {
        throw new Error(`User does not participate in the group`);
      }
      const afterIdMatch = _.isEmpty(afterId) ? {} :
        { _id: { $gte: ObjectId(afterId) } };
      const beforeIdMatch = _.isEmpty(beforeId) ? {} :
        { _id: { $lt: ObjectId(beforeId) } };
      const messages = await Message.aggregate([
        {
          $match: {
            topic: topic._id,
            ...afterIdMatch,
            ...beforeIdMatch,
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
        { $sort: { _id: -1 } },
        { $limit: limit },
        { $sort: { _id: 1 } },
      ]);
      return messages;
    }
  },

  findGroups: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: 'findGroupsType',
        fields: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
          imgUrl: { type: GraphQLString },
        },
      })
    ),
    args: {
      searchText: { type: GraphQLString },
      limit: { type: GraphQLFloat },
      startingId: { type: GraphQLString },
    },
    async resolve(root, { searchText, limit, startingId }, { user }, fieldASTs) {
      if (!user) {
        throw new Error('Only logged in users can search for groups');
      }
      limit = Math.min(limit, numMaxReturnedItems);
      const groups = await Group
        .find({ "name" : { $regex: searchText, $options: 'i' } })
        .sort({ name: 1, createdAt: 1 })
        .limit(limit)
        .lean();
      return groups.map(group => ({ ...group, id: group._id }));
    }
  },
};

const Mutation = {

  register: {
    type: new GraphQLObjectType({
      name: 'registerType',
      fields: {
        errorMessage: { type: GraphQLString },
      }
    }),
    args: { 
      name: { type: GraphQLString },
      userName: { type: GraphQLString },
      password: { type: GraphQLString },
      uid: { type: GraphQLString },
    },
    async resolve(root, { name, userName, password, uid }) {
      // TODO: exception on simple passwords
      const previousUser = await User.findOne({ email: userName });
      if (previousUser) {
        throw new Error('User is already registered');
      }
      const user = await User.create({
        uid,
        name,
        email: userName,
        // TODO: replace by SMS code
        tempPassword: md5(password),
      });

      return {
        errorMessage: '',
      };
    }
  },

  sendMessage: {
    type: GraphQLString,
    args: { 
      message: { type: GraphQLString },
      topicId: { type: GraphQLString },
    },
    async resolve(root, { message, topicId }, { user }, fieldASTs) {
      // TODO: make calls to DB in parallel when possible

      const topic = await Topic.findById(topicId);
      if (!_.find(user.groups, topic.groupId)) {
        throw new Error(`User does not participate in the group`);
      }

      const createdMessage = await Message.create({
        text: message,
        user: user._id,
        topic: topicId,
      });

      // update topic updatedAt
      await Topic.updateOne(
        { _id: ObjectId(topicId) },
        { $set: { updatedAt: Date.now() } }  
      );

      // update group updatedAt
      await Group.updateOne(
        { _id: topic.groupId },
        { $set: { updatedAt: Date.now() } }  
      );

      const groupId = topic.groupId.toHexString();

      // send push notification
      const pushPayload = {
        message,
        authorName: user.name,
        groupId,
        topicId,
        messageId: createdMessage._id.toHexString(),
        type: messageTypes.NEW_MESSAGE,
      };

      logger.debug(`Mensagem: ${message}`);
      logger.debug(`Usuário: ${user.name}`);
      const pushParams = {
        payload: pushPayload,
        title: topicId,
        body: message.slice(0, 30),
      };
      await Promise.all([
        pushService.pushMessage(topicId, pushParams),
        pushService.pushMessage(groupId, pushParams),
      ]);

      return createdMessage._id.toHexString();
    }
  },

  createGroup: {
    type: GraphQLString,
    args: { 
      groupName: { type: GraphQLString },
    },
    async resolve(root, { groupName }, { user }) {
      const newGroup = await Group.create({
        name: groupName,
        imgUrl: 'temp',
        createdBy: ObjectId(user._id),
      });

      await User.updateOne(
        { _id: ObjectId(user._id) },
        { $push: { groups: newGroup._id } }
      );

      return 'OK';
    }
  },

  createTopic: {
    type: GraphQLString,
    args: {
      topicName: { type: GraphQLString },
      groupId: { type: GraphQLString },
    },
    async resolve(root, { topicName, groupId }, { user }) {
      if (!_.find(user.groups, ObjectId(groupId))) {
        throw new Error(`User does not participate in the group`);
      }
      let topicCreatePromise = Topic.create({
        name: topicName,
        groupId: ObjectId(groupId),
        createdBy: ObjectId(user._id),
        imgUrl: 'TODO url',
      });

      let groupUpdatePromise = Group.updateOne(
        { _id: ObjectId(groupId) },
        { 
          $set: { 
            updatedAt: Date.now(),
          }
        },
      );

      const [ createdTopic, dummy ] = await Promise.all([
        topicCreatePromise,
        groupUpdatePromise,
      ]);

      const pushPayload = {
        type: messageTypes.NEW_TOPIC,
        groupId,
        topicName,
        topicId: createdTopic._id.toHexString(),
      };
      const pushParams = {
        payload: pushPayload,
        title: 'Novo tópico',
        body: topicName.slice(0, 50),
      };
      await pushService.pushMessage(groupId, pushParams);
      return 'OK';
    }
  },

  joinGroup: {
    type: GraphQLString,
    args: { 
      groupId: { type: GraphQLString },
    },
    async resolve(root, { groupId }, { user }) {
      const hasGroup = _.find(user.groups, ObjectId(groupId));
      if (hasGroup) {
        throw new Error('User already participate in the group');
      }
      user.groups.push(ObjectId(groupId));
      await user.save();

      // subscribe user to the group on FCM
      await pushService.subscribe(user.fcmToken, groupId);

      return 'OK';
    }
  },
  
  leaveGroup: {
    type: GraphQLString,
    args: {
      groupId: { type: GraphQLString },
    },
    async resolve(root, { groupId }, { user }) {
      await User.updateOne(
        { _id: user._id }, 
        { $pull: { groups: ObjectId(groupId) } }
      );
      return 'OK';
    }
  },
  
  updateFcmToken: {
    type: GraphQLString,
    args: {
      fcmToken: { type: GraphQLString },
    },
    async resolve(root, { fcmToken }, { user }) {
      if (!user) {
        throw new Error('A user is required to update FCM token');
      }
      await User.updateOne(
        { _id: user._id }, 
        { $set: { fcmToken } }
      );
      await subscribeToAllGroups(user, fcmToken);
      return 'OK';
    }
  },
}

function subscribeToAllGroups(user, fcmToken) {
  return Promise.map(user.groups, group => pushService.subscribe(fcmToken, group.toString()));
}

module.exports = {
  Query,
  Mutation,
  messageTypes,
};