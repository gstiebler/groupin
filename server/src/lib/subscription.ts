import * as Bluebird from 'bluebird';

import pushService from './pushService';
import logger from '../config/winston';
import { ConnCtx } from '../db/ConnectionContext';
import { User } from '../db/schema/User';

async function userPinnedTopics(db: ConnCtx, userId: string, groupId: string) {
  const pinnedTopics = await db.PinnedTopic.find({ userId });
  const topics = await db.Topic.find({
    id: { $in: pinnedTopics },
    groupId,
  });
  return topics;
}

export function unsubscribeFromTopic(notificationToken: string, topicId: string) {
  return pushService.unsubscribe(notificationToken, topicId);
}

export async function subscribeToTopic(db: ConnCtx, user: User, notificationToken: string, topicId: string) {
  const topic = await db.Topic.findById(topicId).orFail();
  const userGroup = await db.UserGroup.findOne({
    groupId: topic.groupId,
    userId: user.id
  });
  // true if the group of the topic is pinned by the user
  if (userGroup?.pinned) {
    await pushService.subscribe(notificationToken, topicId);
  }
}

export async function subscribeToGroup(db: ConnCtx, user: User, notificationToken: string, groupId: string) {
  const pinnedTopics = await userPinnedTopics(db, user.id, groupId);
  await Bluebird.map(pinnedTopics, (topic) => pushService.unsubscribe(notificationToken, topic.id));
  await pushService.subscribe(notificationToken, groupId);
}

export async function unsubscribeFromGroup(db: ConnCtx, user: User, notificationToken: string, groupId: string) {
  const pinnedTopics = await userPinnedTopics(db, user.id, groupId);
  await Bluebird.map(pinnedTopics, (topic) => pushService.subscribe(notificationToken, topic.id));
  await pushService.unsubscribe(notificationToken, groupId);
}

export async function subscribeToAll(db: ConnCtx, user: User, notificationToken: string) {
  logger.debug('Subscribing to all');
  const pinnedGroups = await db.UserGroup.find({
    userId: user.id,
    pinned: true,
  });
  const pinnedTopics = await db.PinnedTopic.find({ userId: user.id });
  await Bluebird.map(pinnedGroups, (group) => subscribeToGroup(db, user, notificationToken, group.groupId.toHexString()));
  await Bluebird.map(pinnedTopics, (pinnedTopic) => subscribeToTopic(db, user, notificationToken, pinnedTopic.topicId.toHexString()));
}
