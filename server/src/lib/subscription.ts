import * as _ from 'lodash';
import * as Bluebird from 'bluebird';

import pushService from './pushService';
import logger from '../config/winston';
import { User } from '../db/entity/User';
import { ConnCtx } from '../graphqlContext';
import { In } from 'typeorm';

export function unsubscribeFromTopic(notificationToken: string, topicId: string) {
  return pushService.unsubscribe(notificationToken, topicId);
}

export async function subscribeToTopic(db: ConnCtx, user: User, notificationToken: string, topicId: string) {
  const topic = await db.topicRepository.findOneOrFail(topicId);
  const groupId = topic.groupId;
  const groups = _.find(user.groups, (group) => group.id === groupId && group.pinned);
  // true if the group of the topic is pinned by the user
  if (!_.isEmpty(groups)) {
    await pushService.subscribe(notificationToken, topicId);
  }
}

export async function subscribeToGroup(db: ConnCtx, user: User, notificationToken: string, groupId: string) {
  const pinnedTopics = await user.pinnedTopics;
  const topics = await db.topicRepository.find({
    where: {
      id: In(pinnedTopics),
      groupId,
    }
  });
  await Bluebird.map(topics, (topic) => pushService.unsubscribe(notificationToken, topic.id));
  await pushService.subscribe(notificationToken, groupId);
}

export async function unsubscribeFromGroup(db: ConnCtx, user: User, notificationToken: string, groupId: string) {
  const pinnedTopics = await user.pinnedTopics;
  const topics = await db.topicRepository.find({
    where: {
      id: In(pinnedTopics),
      groupId,
    }
  });
  await Bluebird.map(topics, (topic) => pushService.subscribe(notificationToken, topic.id));
  await pushService.unsubscribe(notificationToken, groupId);
}

export async function subscribeToAll(db: ConnCtx, user: User, notificationToken: string) {
  logger.debug('Subscribing to all');
  const pinnedGroups = await db.userGroupRepository.find({
    where: {
      userId: user.id,
      pinned: true,
    }
  });
  await Bluebird.map(pinnedGroups, (group) => subscribeToGroup(db, user, notificationToken, group.groupId));
  await Bluebird.map(user.pinnedTopics, (pinnedTopic) => subscribeToTopic(db, user, notificationToken, pinnedTopic.topicId));
}
