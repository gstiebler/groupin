const {
  GraphQLString,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLList,
  GraphQLBoolean,
} = require('graphql');
const Promise = require('bluebird');
const logger = require('./config/winston');
const _ = require('lodash');
const moment = require('moment');

const Group = require('./db/schema/Group');
const User = require('./db/schema/User');
const Topic = require('./db/schema/Topic');
const Message = require('./db/schema/Message');
const TopicLatestRead = require('./db/schema/TopicLatestRead');
const GroupLatestRead = require('./db/schema/GroupLatestRead');

const ObjectId = require('mongoose').Types.ObjectId;

const pushService = require('./lib/pushService');

const { numMaxReturnedItems, messageTypes } = require('./lib/constants');

const oldDate = moment('2015-01-01').toDate();

const Query = {

  getHello: {
    type: new GraphQLObjectType({
      name: 'getHelloType',
      fields: {
        msg: { type: GraphQLString },
      },
    }),
    args: { 
      pass: { type: GraphQLString },
    },
    async resolve(root, { pass }, { user }, fieldASTs) {
      return { msg: pass === 'foca' ? 'OK' : 'ERROR' };
    }
  }, 

  getUserId: {
    type: new GraphQLObjectType({
      name: 'getUserIdType',
      fields: {
        id: { type: GraphQLString },
      },
    }),
    async resolve(root, args, { user }, fieldASTs) {
      if (!user) {
        return { id: 'NO USER' };
      }
      return { id: user._id.toHexString() };
    }
  },  

  ownGroups: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: 'ownGroupsType',
        fields: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
          imgUrl: { type: GraphQLString },
          unread: { type: GraphQLBoolean },
        },
      })
    ),
    async resolve(root, args, { user }, fieldASTs) {
      if (!user) {
        throw new Error(`Method only available with a user`);
      }

      const groups = await Group
        .find({ _id: { $in: _.map(user.groups, 'id') } })
        .sort({ updatedAt: -1 })
        .lean();
      
      const groupLatestRead = await GroupLatestRead.find({
        groupId: { $in: _.map(groups, '_id') },
        userId: user._id,
      });
      const latestReadById = _.keyBy(groupLatestRead, l => l.groupId.toHexString());

      // TODO: remove when it's garanteed that the user will be subscribed when joining the group
      subscribeToAllGroups(user, user.fcmToken);
      return groups.map(group => {
        const latestReadObj = latestReadById[group._id.toHexString()];
        // TODO: remove when is garanteed to have always a LatestMoment for every user/topic
        const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
        return { 
          ...group, 
          id: group._id,
          unread: moment(latestReadMoment).isBefore(group.updatedAt),
        }
      });
    }
  },  
  
  getGroupInfo: {
    type: new GraphQLObjectType({
      name: 'groupInfoType',
      fields: {
        _id: { type: GraphQLString },
        friendlyId: { type: GraphQLString },
        name: { type: GraphQLString },
        imgUrl: { type: GraphQLString },        
        description: { type: GraphQLString },
        createdBy: { type: GraphQLString },
        createdAt: { type: GraphQLFloat },
        iBelong: { type: GraphQLBoolean },
      },
    }),
    args: { 
      groupId: { type: GraphQLString },
    },
    async resolve(root, { groupId }, { user }, fieldASTs) {
      if (!user) {
        throw new Error(`Method only available with a user`);
      }

      const group = await Group.findById(groupId, {
        friendlyId: 1,
        name: 1,
        imgUrl: 1,
        description: 1,
        createdBy: 1,
        createdAt: 1,
      }).lean();
      const iBelong = _.find(user.groups, group => group.id.toHexString() === groupId);
      return {
        ...group,
        iBelong,
      };
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
          unread: { type: GraphQLBoolean },
        },
      })
    ),
    args: { 
      groupId: { type: GraphQLString },
      limit: { type: GraphQLFloat },
      startingId: { type: GraphQLString },
    },
    async resolve(root, { groupId, limit, startingId }, { user }, fieldASTs) {
      if (!_.find(user.groups, g => g.id.toHexString() === groupId)) {
        throw new Error(`User does not participate in the group`);
      }
      const topicsOfGroup = await Topic.find({ groupId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .lean();
      const latestTopicRead = await TopicLatestRead.find({
        topicId: { $in: _.map(topicsOfGroup, '_id') },
        userId: user._id,
      });
      const latestReadById = _.keyBy(latestTopicRead, l => l.topicId.toHexString());
      return topicsOfGroup.map(topic => {
        const latestReadObj = latestReadById[topic._id.toHexString()];
        // TODO: remove when is garanteed to have always a LatestMoment for every user/topic
        const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
        return { 
          ...topic,
          id: topic._id,
          unread: moment(latestReadMoment).isBefore(topic.updatedAt),
        }
      });
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
      if (!_.find(user.groups, g => g.id.equals(topic.groupId))) {
        throw new Error(`User does not participate in the group`);
      }
      const beforeIdMessages = !_.isEmpty(beforeId);
      const afterIdMessages = !_.isEmpty(afterId);
      const newestMessages = !beforeIdMessages && !afterIdMessages;
      if (beforeIdMessages && afterIdMessages) {
        throw new Error('Only one start of end filter is allowed');
      }
      const idMatch = newestMessages ? {} :
        afterIdMessages ? { _id: { $gte: ObjectId(afterId) } } :
        { _id: { $lt: ObjectId(beforeId) } };
      const messages = await Message.aggregate([
        {
          $match: {
            topic: topic._id,
            ...idMatch,
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
        // { $sort: { _id: -1 } },
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
      searchText = searchText.trim();
      const byFriedlyId = await Group.findOne({ friendlyId: searchText });
      if (byFriedlyId) {
        return [byFriedlyId];
      }

      limit = Math.min(limit, numMaxReturnedItems);
      const groups = await Group
        .find({ name : { $regex: searchText, $options: 'i' }, visibility: 'PUBLIC' })
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
    },
    async resolve(root, { name }, { firebaseId, phoneNumber }) {
      const previousUser = await User.findOne({ phoneNumber });
      if (previousUser) {
        throw new Error('User is already registered');
      }
      const user = await User.create({
        name,
        phoneNumber,
        uid: firebaseId,
      });

      return {
        errorMessage: '',
        id: user._id,
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
      if (!_.find(user.groups, g => g.id.equals(topic.groupId))) {
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
        title: topic.name,
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
      visibility: { type: GraphQLString },
    },
    async resolve(root, { groupName, visibility }, { user }) {
      const newGroup = await Group.create({
        name: groupName,
        imgUrl: 'temp',
        visibility,
        createdBy: ObjectId(user._id),
      });

      await User.updateOne(
        { _id: ObjectId(user._id) },
        { 
          $push: { 
            groups: {
              id: newGroup._id,
              pinned: false,
            }
          } 
        },
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
      if (!_.find(user.groups, g => g.id.toHexString() === groupId)) {
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
      const hasGroup = _.find(user.groups, g => g.id.toHexString() === groupId);
      if (hasGroup) {
        throw new Error('User already participate in the group');
      }
      user.groups.push({ id: ObjectId(groupId) });
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
        { $pull: { groups: { id: ObjectId(groupId) } } }
      );

      // unsubscribe user from the group on FCM
      await pushService.unsubscribe(user.fcmToken, groupId);
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
    }
  },

  setTopicLatestRead: {
    type: GraphQLString,
    args: {
      topicId: { type: GraphQLString },
    },
    async resolve(root, { topicId }, { user }) {
      const topic = await Topic.findById(topicId);
      const updateObj = {
        latestMoment: new Date(),
      };
      const opts = {
        new: true,
        upsert: true,
      };
      // TODO: replace for `update` when is garanteed to have always a LatestMoment for every user/topic
      await TopicLatestRead.findOneAndUpdate(
        {
          userId: user._id,
          topicId: ObjectId(topicId),
        }, 
        updateObj,
        opts
      );
      // TODO: replace for `update` when is garanteed to have always a LatestMoment for every user/topic
      await GroupLatestRead.findOneAndUpdate(
        {
          userId: user._id,
          groupId: topic.groupId,
        }, 
        updateObj,
        opts
      );
      return 'OK';
    }
  },
}

function subscribeToAllGroups(user, fcmToken) {
  return Promise.map(user.groups, group => pushService.subscribe(fcmToken, group.id.toString()));
}

module.exports = {
  Query,
  Mutation,
  messageTypes,
};