import * as _ from 'lodash';
import { messageTypes } from '../lib/constants';
import pushService from '../lib/pushService';
import logger from '../config/winston';
import { Context } from '../graphqlContext';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { UserGroup } from '../db/schema/UserGroup'; 
import { Types } from 'mongoose';
const { ObjectId } = Types;

@ObjectType()
class UserResult {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  avatar: string;
}

@ObjectType()
class MessageResult {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  name: UserResult;
}

@Resolver(() => MessageResult)
export class MessageResolver {
  
  @Query(() => [MessageResult])
  async messagesOfTopic(
    @Arg('topicId') topicId: string,
    @Arg('limit') limit: number,
    @Arg('beforeId') beforeId: string,
    @Arg('afterId') afterId: string,
    @Ctx() { user, db }: Context
  ): Promise<MessageResult[]> {
    const topic = await db.Topic.findById(topicId)
      .orFail(() => Error('Topic expected'));

    if (await db.UserGroup.findOne({ userId: user.id, topicId } as Partial<UserGroup>)) {
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
    const messages = await db.Message
      .find({
        topic: topic._id,
        ...idMatch,
      })
      .sort({ _id: -1 }) // TODO: sort depending on before/after
      .limit(limit);
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

    const topic = await db.Topic.findOne(topicId).orFail();
    await db.UserGroup.findOne({ userId: user?.id, groupId: topic.groupId })
      .orFail(() => Error('User does not participate in the group'));

    const createdMessage = await db.Message.create({
      text: message,
      userId: user!.id,
      topicId: topic.id,
    });

    // update topic updatedAt
    await db.Topic.updateOne(
      { id: topicId },
      { updatedAt: new Date() },
    );

    // update group updatedAt
    await db.Group.updateOne(
      { id: topic.groupId },
      { updatedAt: new Date() }
    );

    const groupId = topic.groupId.toString();

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
