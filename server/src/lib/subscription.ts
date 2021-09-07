import * as Bluebird from 'bluebird';

import pushService, { NotificationParams } from './pushService';
import logger from '../config/winston';
import { ConnCtx } from '../db/ConnectionContext';
import { messageTypes } from './constants';
import { Types } from 'mongoose';
const { ObjectId } = Types;

async function userPinnedTopics(db: ConnCtx, userId: string, groupId: string) {
  const pinnedTopics = await db.PinnedTopic.find({ userId: new ObjectId(userId) }).lean();
  const topics = await db.Topic.find({
    id: { $in: pinnedTopics },
    groupId,
  }).lean();
  return topics;
}

export function unsubscribeFromTopic(notificationToken: string, topicId: string) {
  return pushService.unsubscribe(notificationToken, topicId);
}

export async function subscribeToTopic(db: ConnCtx, userId: string, notificationToken: string, topicId: string) {
  const topic = await db.Topic.findById(topicId).orFail();
  const userGroup = await db.UserGroup.findOne({
    groupId: topic.groupId,
    userId: new ObjectId(userId)
  });
  if (userGroup?.pinned) {
    await pushService.subscribe(notificationToken, topicId);
  }
}

export async function subscribeToGroup(db: ConnCtx, userId: string, notificationToken: string, groupId: string) {
  const pinnedTopics = await userPinnedTopics(db, userId, groupId);
  await pushService.subscribe(notificationToken, groupId);
  await Bluebird.map(pinnedTopics, (topic) => pushService.unsubscribe(notificationToken, topic._id.toHexString()));
}

export async function unsubscribeFromGroup(db: ConnCtx, userId: string, notificationToken: string, groupId: string) {
  const pinnedTopics = await userPinnedTopics(db, userId, groupId);
  await Bluebird.map(pinnedTopics, (topic) => pushService.subscribe(notificationToken, topic._id.toHexString()));
  await pushService.unsubscribe(notificationToken, groupId);
}

export async function subscribeToAll(db: ConnCtx, userId: string, notificationToken: string) {
  logger.debug('Subscribing to all');
  const pinnedGroups = await db.UserGroup.find({
    userId: new ObjectId(userId),
    pinned: true,
  }).lean();
  await Bluebird.map(pinnedGroups, (group) => subscribeToGroup(db, userId, notificationToken, group.groupId.toHexString()));
}

// TODO: automated test
export async function pushNewTopic(db: ConnCtx, groupId: string, topicId: string, topicName: string) {
  const pushPayload = {
    type: messageTypes.NEW_TOPIC,
    groupId,
    topicName,
    topicId,
  };
  const notificationParams: NotificationParams = {
    payload: pushPayload,
    title: 'Novo tópico',
    body: topicName.slice(0, 50),
    sendNotification: true,
  };
  const subscribedUsers = await db.UserGroup.find({ groupId, pinned: true }).lean();
  const userIds = subscribedUsers.map(subs => subs.userId);
  const users = db.User.find({ _id: { $in: userIds } }).lean();
  await Bluebird.map(users, user => pushService.pushMessage(user.notificationToken!, notificationParams));
}

// TODO: automated test
type PushMessageParams = {
  message: string;
  messageId: string;
  groupId: string;
  topicId: string;
  topicName: string;
  authorName: string;
};
export async function pushNewMessage(params: PushMessageParams) {
  const { message, messageId, groupId, topicId, topicName, authorName } = params;
  // send push notification
  const pushPayload = {
    message,
    authorName,
    groupId,
    topicId,
    topicName,
    messageId,
    type: messageTypes.NEW_MESSAGE,
  };

  logger.debug(`Mensagem: ${message}`);
  logger.debug(`Usuário: ${authorName}`);
  const notificationParams: NotificationParams = {
    payload: pushPayload,
    title: topicName,
    body: message.slice(0, 30),
    sendNotification: true,
  };
  await Promise.all([
    pushService.pushMessage(topicId, { ...notificationParams, sendNotification: true }),
    pushService.pushMessage(groupId, { ...notificationParams, sendNotification: true }),
    pushService.pushMessage(`data.${topicId}`, { ...notificationParams, sendNotification: false }),
  ]);

}
