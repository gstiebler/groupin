import * as _ from 'lodash';
import { Context } from '../graphqlContext';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Types } from 'mongoose';
import { User } from '../db/schema/User';
import { Message } from '../db/schema/Message';
import { pushNewMessage } from '../lib/subscription';
const { ObjectId } = Types;

@ObjectType()
class UserResult {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;
}

@ObjectType()
export class MessageResult {
  @Field()
  _id: string;

  @Field()
  text: string;

  @Field()
  createdAt: number;

  @Field(() => UserResult)
  user: UserResult;
}

@Resolver(() => MessageResult)
export class MessageResolver {
  
  @Query(() => [MessageResult])
  async messagesOfTopic(
    @Arg('topicId') topicId: string,
    @Arg('limit') limit: number,
    @Arg('beforeId', { nullable: true }) beforeId: string,
    @Arg('afterId', { nullable: true }) afterId: string,
    @Ctx() { userId, db }: Context
  ): Promise<MessageResult[]> {
    const topic = await db.Topic.findById(topicId)
      .orFail(() => Error('Topic expected'));

    if (await db.UserGroup.findOne({ userId: new ObjectId(userId), topicId })) {
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
        topicId: topic._id,
        ...idMatch,
      })
      .sort({ _id: -1 }) // TODO: sort depending on before/after
      .limit(limit)
      .lean();
    const userIds = messages.map(message => message.userId);
    const users: User[] = await db.User.find({ _id: { $in: userIds } }).lean();
    const messageUser = users.map(user => ({
      _id: user._id!.toHexString(),
      name: user.name,
      avatar: user.imgUrl,
    }));
    const userById = _.keyBy(messageUser, user => user._id);
    return messages.map(message => ({
      ...message,
      createdAt: message.createdAt.getTime(),
      _id: message._id.toHexString(),
      user: userById[message.userId.toHexString()],
    }));
  }

  @Mutation(() => String)
  async sendMessage(
    @Arg('message') message: string,
    @Arg('topicId') topicId: string,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    // TODO: make calls to DB in parallel when possible

    const topic = await db.Topic.findById(topicId).orFail().lean();
    await db.UserGroup.findOne({ userId: new ObjectId(userId), groupId: topic.groupId })
      .orFail(() => Error('User does not participate in the group'));

    const createdMessage = await db.Message.create({
      text: message,
      userId: new ObjectId(userId),
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

    const user = await db.User.findById(userId).lean();
    await pushNewMessage({
      message,
      messageId: createdMessage.id,
      groupId,
      topicId,
      topicName: topic.name,
      authorName: user!.name,
    });

    return createdMessage.id;
  }

}
