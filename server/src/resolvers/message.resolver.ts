import * as _ from 'lodash';

import { messageTypes } from '../lib/constants';

import pushService from '../lib/pushService';
import logger from '../config/winston';
import { Topic } from '../db/entity/Topic';
import { Context } from '../graphqlMain';
import { Message } from '../db/entity/Message';
import { Resolver } from 'type-graphql';
import { UserGroupPinned } from '../db/entity/UserGroupPinned';
import { Group } from '../db/entity/Group';


@Resolver(() => Message)
export class MessageResolver {

  async messagesOfTopic({ topicId, limit, afterId, beforeId }, { user, db }: Context) {
    const topic = await db.getRepository(Topic).findOne(topicId);
    const groups = await user?.joinedGroups;
    if (!_.find(groups, { id: topic?.groupId })) {
      throw new Error('User does not participate in the group');
    }
    const beforeIdMessages = !_.isEmpty(beforeId);
    const afterIdMessages = !_.isEmpty(afterId);
    // const newestMessages = !beforeIdMessages && !afterIdMessages;
    if (beforeIdMessages && afterIdMessages) {
      throw new Error('Only one start of end filter is allowed');
    }
    const messages = await db.getRepository(Message).find({
      where: {
        topicId
      },
      order: {
        createdAt: 'DESC'
      },
      take: limit
    });

    // TODO: join users
    return messages;
  }

  async sendMessage({ message, topicId }, { user, db }: Context) {
    // TODO: make calls to DB in parallel when possible

    const topic = await db.getRepository(Topic).findOne(topicId);
    try {
      await db.getRepository(UserGroupPinned).findOneOrFail({ userId: user?.id, groupId: topic?.groupId });
    } catch (err) {
      throw new Error('User does not participate in the group');
    }

    const createdMessage = await db.getRepository(Message).save({
      text: message,
      userId: user!.id,
      topicId: topic!.id,
    });

    // update topic updatedAt
    await db.getRepository(Topic).save({
      id: topicId,
      updatedAt: Date.now(),
    });

    // update group updatedAt
    await db.getRepository(Group).save({
      id: topic!.groupId,
      updatedAt: Date.now(),
    });

    const groupId = topic!.groupId;

    // send push notification
    const pushPayload = {
      message,
      authorName: user!.name,
      groupId,
      topicId,
      topicName: topic!.name,
      messageId: createdMessage.id,
      type: messageTypes.NEW_MESSAGE,
    };

    logger.debug(`Mensagem: ${message}`);
    logger.debug(`Usuário: ${user?.name}`);
    const pushParams = {
      payload: pushPayload,
      title: topic!.name,
      body: message.slice(0, 30),
    };
    await Promise.all([
      pushService.pushMessage(topicId, { ...pushParams, sendNotification: true }),
      pushService.pushMessage(groupId, { ...pushParams, sendNotification: true }),
      pushService.pushMessage(`data.${topicId}`, { ...pushParams, sendNotification: false }),
    ]);

    return createdMessage.id;
  }

}
