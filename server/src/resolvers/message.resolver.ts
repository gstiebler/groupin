import * as _ from 'lodash';
import { messageTypes } from '../lib/constants';
import pushService from '../lib/pushService';
import logger from '../config/winston';
import { Context } from '../graphqlContext';
import { Message } from '../db/entity/Message.entity';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { LessThan, MoreThan } from 'typeorm';

@Resolver(() => Message)
export class MessageResolver {
  
  @Query(() => [Message])
  async messagesOfTopic(
    @Arg('topicId') topicId: string,
    @Arg('limit') limit: number,
    @Arg('afterMoment') afterMoment: Date,
    @Arg('beforeMoment') beforeMoment: Date,
    @Ctx() { user, db }: Context
  ): Promise<Message[]> {
    const topic = await db.topicRepository.findOne(topicId);
    await db.userGroupRepository.findOneOrFail({
      userId: user?.id,
      group: topic?.group
    });
    const beforeMomentMessages = !_.isEmpty(afterMoment);
    const afterMomentMessages = !_.isEmpty(beforeMoment);
    const newestMessages = !beforeMomentMessages && !afterMomentMessages;
    if (beforeMomentMessages && afterMomentMessages) {
      throw new Error('Only one start of end filter is allowed');
    }
    const idComparisonOperator = newestMessages ? {} :
      beforeMomentMessages ? { createdAt: LessThan(beforeMoment) } : { createdAt: MoreThan(afterMoment) };
    const messages = await db.messageRepository.find({
      where: {
        topicId,
        ...idComparisonOperator,
      },
      order: {
        createdAt: 'DESC'
      },
      take: limit,
    });

    // TODO: join users
    return messages;
  }

  @Mutation(() => String)
  async sendMessage(
    @Arg('message') message: string,
    @Arg('topicId') topicId: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    // TODO: make calls to DB in parallel when possible

    const topic = await db.topicRepository.findOneOrFail(topicId);
    try {
      await db.userGroupRepository.findOneOrFail({ userId: user?.id, groupId: topic?.groupId });
    } catch (err) {
      throw new Error('User does not participate in the group');
    }

    const createdMessage = await db.messageRepository.save({
      text: message,
      userId: user!.id,
      topicId: topic.id,
    });

    // update topic updatedAt
    await db.topicRepository.save({
      id: topicId,
      updatedAt: Date.now(),
    });

    // update group updatedAt
    await db.groupRepository.save({
      id: topic.groupId,
      updatedAt: Date.now(),
    });

    const groupId = topic.groupId;

    // send push notification
    const pushPayload = {
      message,
      authorName: user!.name,
      groupId,
      topicId,
      topicName: topic.name,
      messageId: createdMessage.id,
      type: messageTypes.NEW_MESSAGE,
    };

    logger.debug(`Mensagem: ${message}`);
    logger.debug(`Usuário: ${user?.name}`);
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

    return createdMessage.id;
  }

}
