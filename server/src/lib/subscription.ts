import * as _ from 'lodash';
import * as Bluebird from 'bluebird';

import pushService from './pushService';
import logger from '../config/winston';
import { User } from '../db/entity/User';
import { ConnCtx } from '../graphqlContext';
import { In } from 'typeorm';

export function unsubscribeFromTopic(fcmToken, topicId) {
  return pushService.unsubscribe(fcmToken, topicId.toString());
}

export async function subscribeToTopic(db: ConnCtx, user, fcmToken, topicId: string) {
  const topic = await db.topicRepository.findOneOrFail(topicId);
  const groupId = topic.groupId;
  const groups = _.find(user.groups, (group) => group.id.toHexString() === groupId && group.pinned);
  // true if the group of the topic is pinned by the user
  if (!_.isEmpty(groups)) {
    await pushService.subscribe(fcmToken, topicId.toString());
  }
}

export async function subscribeToGroup(db: ConnCtx, user: User, fcmToken, groupId) {
  const pinnedTopics = await user.pinnedTopics;
  const topics = await db.topicRepository.find({
    where: {
      id: In(pinnedTopics),
      groupId,
    }
  });
  await Bluebird.map(topics, (topic) => pushService.unsubscribe(fcmToken, topic.id));
  await pushService.subscribe(fcmToken, groupId.toString());
}

export async function unsubscribeFromGroup(db: ConnCtx, user: User, fcmToken, groupId) {
  const pinnedTopics = await user.pinnedTopics;
  const topics = await db.topicRepository.find({
    where: {
      id: In(pinnedTopics),
      groupId,
    }
  });
  await Bluebird.map(topics, (topic) => pushService.subscribe(fcmToken, topic.id));
  await pushService.unsubscribe(fcmToken, groupId.toString());
}

export async function subscribeToAll(db: ConnCtx, user: User, fcmToken) {
  logger.debug('Subscribing to all');
  const pinnedGroups = await db.userGroupRepository.find({
    where: {
      userId: user.id,
      pinned: true,
    }
  });
  await Bluebird.map(pinnedGroups, (group) => subscribeToGroup(db, user, fcmToken, group.groupId));
  await Bluebird.map(user.pinnedTopics, (pinnedTopic) => subscribeToTopic(db, user, fcmToken, pinnedTopic.topicId));
}
