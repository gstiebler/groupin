const _ = require('lodash');
const Promise = require('bluebird');

const Topic = require('../db/schema/Topic');

const pushService = require('./pushService');
const logger = require('../config/winston');

function unsubscribeFromTopic(fcmToken, topicId) {
  return pushService.unsubscribe(fcmToken, topicId.toString());
}

async function subscribeToTopic(user, fcmToken, topicId) {
  const topic = await Topic.findById(topicId);
  const groupId = topic.groupId.toHexString();
  const groups = _.find(user.groups, (group) => group.id.toHexString() === groupId && group.pinned);
  // true if the group of the topic is pinned by the user
  if (!_.isEmpty(groups)) {
    await pushService.subscribe(fcmToken, topicId.toString());
  }
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

module.exports = {
  unsubscribeFromTopic,
  subscribeToTopic,
  subscribeToGroup,
  unsubscribeFromGroup,
  subscribeToAll,
};
