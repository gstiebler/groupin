/* eslint-disable no-underscore-dangle */

const Promise = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
const { ObjectId } = require('mongoose').Types;
const logger = require('./config/winston');

const Group = require('./db/schema/Group');
const User = require('./db/schema/User');
const Topic = require('./db/schema/Topic');
const Message = require('./db/schema/Message');
const TopicLatestRead = require('./db/schema/TopicLatestRead');
const GroupLatestRead = require('./db/schema/GroupLatestRead');

const pushService = require('./lib/pushService');

const { numMaxReturnedItems, messageTypes } = require('./lib/constants');

const oldDate = moment('2015-01-01').toDate();

async function subscribeToTopic(user, fcmToken, topicId) {
  const topic = await Topic.findById(topicId);
  const groupId = topic.groupId.toHexString();
  const groups = _.find(user.groups, (group) => group.id.toHexString() === groupId && group.pinned);
  // true if the group of the topic is pinned by the user
  if (!_.isEmpty(groups)) {
    await pushService.subscribe(fcmToken, topicId.toString());
  }
}

function unsubscribeFromTopic(fcmToken, topicId) {
  return pushService.unsubscribe(fcmToken, topicId.toString());
}

async function subscribeToGroup(user, fcmToken, groupId) {
  const topics = await Topic.find({
    _id: { $in: user.pinnedTopics },
    groupId,
  });
  await Promise.map(topics, (topic) => pushService.unsubscribe(fcmToken, topic._id.toString()));
  await pushService.subscribe(fcmToken, groupId.toString());
}

async function unsubscribeFromGroup(user, fcmToken, groupId) {
  const topics = await Topic.find({
    _id: { $in: user.pinnedTopics },
    groupId,
  });
  await Promise.map(topics, (topic) => pushService.subscribe(fcmToken, topic._id.toString()));
  await pushService.unsubscribe(fcmToken, groupId.toString());
}

async function subscribeToAll(user, fcmToken) {
  logger.debug('Subscribing to all');
  const pinnedGroups = _.filter(user.groups, { pinned: true });
  await Promise.map(pinnedGroups, (group) => subscribeToGroup(user, fcmToken, group.id));
  await Promise.map(user.pinnedTopics, (topic) => subscribeToTopic(user, fcmToken, topic));
}

async function topicsOfGroup({ groupId, limit }, { user }) {
  if (!_.find(user.groups, (g) => g.id.toHexString() === groupId)) {
    throw new Error('User does not participate in the group');
  }
  const topics = await Topic.find({ groupId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();
  const latestTopicRead = await TopicLatestRead.find({
    topicId: { $in: _.map(topics, '_id') },
    userId: user._id,
  });
  const pinnedTopicsSet = new Set(_.map(user.pinnedTopics, (t) => t.toHexString()));
  const latestReadById = _.keyBy(latestTopicRead, (l) => l.topicId.toHexString());
  return topics.map((topic) => {
    const latestReadObj = latestReadById[topic._id.toHexString()];
    // TODO: remove when is garanteed to have always a LatestMoment for every user/topic
    const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
    return {
      ...topic,
      id: topic._id,
      unread: moment(latestReadMoment).isBefore(topic.updatedAt),
      pinned: pinnedTopicsSet.has(topic._id.toHexString()),
    };
  });
}

async function getUserId(args, { user }) {
  if (!user) {
    return { id: 'NO USER' };
  }
  return { id: user._id.toHexString() };
}

async function ownGroups(args, { user }) {
  if (!user) {
    throw new Error('Method only available with a user');
  }

  const groups = await Group
    .find({ _id: { $in: _.map(user.groups, 'id') } })
    .sort({ updatedAt: -1 })
    .lean();

  const pinnedByGroupId = new Map(_.map(user.groups, (group) => [group.id.toHexString(), group.pinned]));
  const groupLatestRead = await GroupLatestRead.find({
    groupId: { $in: _.map(groups, '_id') },
    userId: user._id,
  });
  const latestReadById = _.keyBy(groupLatestRead, (l) => l.groupId.toHexString());

  return groups.map((group) => {
    const latestReadObj = latestReadById[group._id.toHexString()];
    // TODO: remove when is garanteed to have always a LatestMoment for every user/topic
    const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
    return {
      ...group,
      id: group._id,
      unread: moment(latestReadMoment).isBefore(group.updatedAt),
      pinned: pinnedByGroupId.get(group._id.toHexString()),
    };
  });
}

async function getGroupInfo({ groupId }, { user }) {
  if (!user) {
    throw new Error('Method only available with a user');
  }

  const group = await Group.findById(groupId, {
    friendlyId: 1,
    name: 1,
    imgUrl: 1,
    description: 1,
    visibility: 1,
    createdBy: 1,
    createdAt: 1,
  }).lean();
  const iBelong = !!_.find(user.groups, (group_) => group_.id.toHexString() === groupId);
  return {
    ...group,
    iBelong,
  };
}

async function messagesOfTopic({ topicId, limit, afterId, beforeId }, { user }) {
  const topic = await Topic.findById(topicId);
  if (!_.find(user.groups, (g) => g.id.equals(topic.groupId))) {
    throw new Error('User does not participate in the group');
  }
  const beforeIdMessages = !_.isEmpty(beforeId);
  const afterIdMessages = !_.isEmpty(afterId);
  const newestMessages = !beforeIdMessages && !afterIdMessages;
  if (beforeIdMessages && afterIdMessages) {
    throw new Error('Only one start of end filter is allowed');
  }
  // eslint-disable-next-line no-nested-ternary
  const idMatch = newestMessages ? {}
    : afterIdMessages ? { _id: { $gte: ObjectId(afterId) } }
      : { _id: { $lt: ObjectId(beforeId) } };
  const messages = await Message.aggregate([
    {
      $match: {
        topic: topic._id,
        ...idMatch,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        text: '$text',
        createdAt: '$createdAt',
        'user._id': '$user._id',
        'user.name': '$user.name',
        'user.avatar': '$user.imgUrl',
      },
    },
    { $sort: { _id: -1 } },
    { $limit: limit },
    // { $sort: { _id: -1 } },
  ]);
  return messages;
}

async function findGroups({ searchText, limit }, { user }) {
  if (!user) {
    throw new Error('Only logged in users can search for groups');
  }
  const trimmedSearchText = searchText.trim();
  const byFriedlyId = await Group.findOne({ friendlyId: trimmedSearchText });
  if (byFriedlyId) {
    return [byFriedlyId];
  }

  const boundedLimit = Math.min(limit, numMaxReturnedItems);
  const groups = await Group
    .find({ name: { $regex: trimmedSearchText, $options: 'i' }, visibility: 'PUBLIC' })
    .sort({ name: 1, createdAt: 1 })
    .limit(boundedLimit)
    .lean();
  return groups.map((group) => ({ ...group, id: group._id }));
}

async function register({ name }, { firebaseId, phoneNumber }) {
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

async function sendMessage({ message, topicId }, { user }) {
  // TODO: make calls to DB in parallel when possible

  const topic = await Topic.findById(topicId);
  if (!_.find(user.groups, (g) => g.id.equals(topic.groupId))) {
    throw new Error('User does not participate in the group');
  }

  const createdMessage = await Message.create({
    text: message,
    user: user._id,
    topic: topicId,
  });

  // update topic updatedAt
  await Topic.updateOne(
    { _id: ObjectId(topicId) },
    { $set: { updatedAt: Date.now() } },
  );

  // update group updatedAt
  await Group.updateOne(
    { _id: topic.groupId },
    { $set: { updatedAt: Date.now() } },
  );

  const groupId = topic.groupId.toHexString();

  // send push notification
  const pushPayload = {
    message,
    authorName: user.name,
    groupId,
    topicId,
    topicName: topic.name,
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
    pushService.pushMessage(topicId, { ...pushParams, sendNotification: true }),
    pushService.pushMessage(groupId, { ...pushParams, sendNotification: true }),
    pushService.pushMessage(`data.${topicId}`, { ...pushParams, sendNotification: false }),
  ]);

  return createdMessage._id.toHexString();
}

async function createGroup({ groupName, visibility }, { user }) {
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
        },
      },
    },
  );

  return 'OK';
}

async function createTopic({ topicName, groupId }, { user }) {
  if (!_.find(user.groups, (g) => g.id.toHexString() === groupId)) {
    throw new Error('User does not participate in the group');
  }
  const topicCreatePromise = Topic.create({
    name: topicName,
    groupId: ObjectId(groupId),
    createdBy: ObjectId(user._id),
    imgUrl: 'TODO url',
  });

  const groupUpdatePromise = Group.updateOne(
    { _id: ObjectId(groupId) },
    {
      $set: {
        updatedAt: Date.now(),
      },
    },
  );

  const [createdTopic] = await Promise.all([
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
    sendNotification: true,
  };
  await pushService.pushMessage(groupId, pushParams);
  return 'OK';
}

async function joinGroup({ groupId }, { user }) {
  const hasGroup = _.find(user.groups, (g) => g.id.toHexString() === groupId);
  if (hasGroup) {
    throw new Error('User already participate in the group');
  }
  user.groups.push({ id: ObjectId(groupId) });
  await user.save();

  return 'OK';
}

async function leaveGroup({ groupId }, { user }) {
  await User.updateOne(
    { _id: user._id },
    { $pull: { groups: { id: ObjectId(groupId) } } },
  );

  // unsubscribe user from the group on FCM
  await unsubscribeFromGroup(user, user.fcmToken, groupId);
  return 'OK';
}

async function updateFcmToken({ fcmToken }, { user }) {
  if (!user) {
    throw new Error('A user is required to update FCM token');
  }
  await User.updateOne(
    { _id: user._id },
    { $set: { fcmToken } },
  );
  await subscribeToAll(user, fcmToken);
}

async function setTopicLatestRead({ topicId }, { user }) {
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
    opts,
  );
  // TODO: replace for `update` when is garanteed to have always a LatestMoment for every user/topic
  await GroupLatestRead.findOneAndUpdate(
    {
      userId: user._id,
      groupId: topic.groupId,
    },
    updateObj,
    opts,
  );
  return 'OK';
}

async function setGroupPin({ groupId, pinned }, { user }) {
  await User.updateOne(
    { _id: user._id, 'groups.id': ObjectId(groupId) },
    { $set: { 'groups.$.pinned': pinned } },
  );
  if (pinned) {
    await subscribeToGroup(user, user.fcmToken, groupId);
  } else {
    await unsubscribeFromGroup(user, user.fcmToken, groupId);
  }
  return 'OK';
}

async function setTopicPin({ topicId, pinned }, { user }) {
  const updateOperation = pinned ? '$push' : '$pull';
  await User.updateOne(
    { _id: user._id },
    { [updateOperation]: { pinnedTopics: ObjectId(topicId) } },
  );
  if (pinned) {
    await subscribeToTopic(user, user.fcmToken, topicId);
  } else {
    await unsubscribeFromTopic(user.fcmToken, topicId);
  }
  return 'OK';
}

module.exports = {
  topicsOfGroup,
  getUserId,
  ownGroups,
  getGroupInfo,
  messagesOfTopic,
  findGroups,
  register,
  sendMessage,
  createGroup,
  createTopic,
  joinGroup,
  leaveGroup,
  updateFcmToken,
  setTopicLatestRead,
  setGroupPin,
  setTopicPin,
};
