import * as _ from 'lodash';
import { Types } from 'mongoose';

import Group from '../db/schema/Group';
import Message from '../db/schema/Message';
import Topic from '../db/schema/Topic';

import { messageTypes } from '../lib/constants';

import pushService from '../lib/pushService';
import logger from '../config/winston';

const { ObjectId } = Types;

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

module.exports = {
  messagesOfTopic,
  sendMessage,
};
