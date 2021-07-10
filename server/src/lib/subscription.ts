import * as _ from 'lodash';
import * as Bluebird from 'bluebird';

import Topic from '../db/schema/Topic';

import pushService from './pushService';
import logger from '../config/winston';

export function unsubscribeFromTopic(fcmToken, topicId) {
  return pushService.unsubscribe(fcmToken, topicId.toString());
}

export async function subscribeToTopic(user, fcmToken, topicId) {
  const topic = await Topic.findById(topicId);
  const groupId = topic.groupId.toHexString();
  const groups = _.find(user.groups, (group) => group.id.toHexString() === groupId && group.pinned);
  // true if the group of the topic is pinned by the user
  if (!_.isEmpty(groups)) {
    await pushService.subscribe(fcmToken, topicId.toString());
  }
}

export async function subscribeToGroup(user, fcmToken, groupId) {
  const topics = await Topic.find({
    _id: { $in: user.pinnedTopics },
    groupId,
  });
  await Bluebird.map(topics, (topic) => pushService.unsubscribe(fcmToken, topic._id.toString()));
  await pushService.subscribe(fcmToken, groupId.toString());
}

export async function unsubscribeFromGroup(user, fcmToken, groupId) {
  const topics = await Topic.find({
    _id: { $in: user.pinnedTopics },
    groupId,
  });
  await Bluebird.map(topics, (topic) => pushService.subscribe(fcmToken, topic._id.toString()));
  await pushService.unsubscribe(fcmToken, groupId.toString());
}

export async function subscribeToAll(user, fcmToken) {
  logger.debug('Subscribing to all');
  const pinnedGroups = _.filter(user.groups, { pinned: true });
  await Bluebird.map(pinnedGroups, (group) => subscribeToGroup(user, fcmToken, group.id));
  await Bluebird.map(user.pinnedTopics, (topic) => subscribeToTopic(user, fcmToken, topic));
}
