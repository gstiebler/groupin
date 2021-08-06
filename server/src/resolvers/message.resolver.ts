import * as _ from 'lodash';
import { messageTypes } from '../lib/constants';
import pushService from '../lib/pushService';
import logger from '../config/winston';
import { Context } from '../graphqlContext';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { UserGroup } from '../db/schema/UserGroup'; 
import { Types } from 'mongoose';
import { User } from '../db/schema/User';
import { Message } from '../db/schema/Message';
const { ObjectId } = Types;

@ObjectType()
class UserResult {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;
}

@ObjectType()
class MessageResult {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field(() => UserResult)
  user: UserResult;
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

    if (await db.UserGroup.findOne({ userId: user?._id, topicId })) {
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
    const messages: Message[] = await db.Message
      .find({
        topic: topic._id,
        ...idMatch,
      })
      .sort({ _id: -1 }) // TODO: sort depending on before/after
      .limit(limit);
    const userIds = messages.map(message => message.userId);
    const users: User[] = await db.User.find({ userId: { $in: userIds } });
    const messageUser = users.map(user => ({
      id: user._id.toHexString(),
      name: user.name,
      avatar: user.imgUrl,
    }));
    const userById = _.keyBy(messageUser, user => user.id);
    return messages.map(message => ({
      ...message,
      id: message._id.toHexString() as string,
      user: userById[message.userId.toHexString()],
    }));
  }

  @Mutation(() => String)
  async sendMessage(
    @Arg('message') message: string,
    @Arg('topicId') topicId: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    // TODO: make calls to DB in parallel when possible

    const topic = await db.Topic.findById(topicId).orFail().lean();
    await db.UserGroup.findOne({ userId: user?._id.toHexString(), groupId: topic.groupId })
      .orFail(() => Error('User does not participate in the group'));

    const createdMessage = await db.Message.create({
      text: message,
      userId: user!._id,
      topicId: topic._id,
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

    const groupId = topic.groupId.toHexString();

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
