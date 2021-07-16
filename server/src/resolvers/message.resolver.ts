import * as _ from 'lodash';

import { messageTypes } from '../lib/constants';

import pushService from '../lib/pushService';
import logger from '../config/winston';
import { Topic } from '../db/entity/Topic';
import { Context } from '../graphqlMain';
import { Message } from '../db/entity/Message';

export async function messagesOfTopic({ topicId, limit, afterId, beforeId }, { user, db }: Context) {
  const topic = await db.getRepository(Topic).findOne(topicId);
  const groups = await user?.joinedGroups;
  if (!_.find(groups, { id: topic?.groupId })) {
    throw new Error('User does not participate in the group');
  }
  const beforeIdMessages = !_.isEmpty(beforeId);
  const afterIdMessages = !_.isEmpty(afterId);
  const newestMessages = !beforeIdMessages && !afterIdMessages;
  if (beforeIdMessages && afterIdMessages) {
    throw new Error('Only one start of end filter is allowed');
  }
  const messages = await db.getRepository(Message).find({
    where: {
      topicId
    },
    order: {
      createdAt: 'DESC'
    }
  });

  // TODO: join users
  return messages;
}

export async function sendMessage({ message, topicId }, { user, db }: Context) {
  // TODO: make calls to DB in parallel when possible

  const topic = await db.getRepository(Topic).findOne(topicId);
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
