import * as _ from 'lodash';
import { isBefore } from 'date-fns';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { pushNewTopic, subscribeToTopic, unsubscribeFromTopic } from '../lib/subscription';
import { Context } from '../graphqlContext';
import { Types } from 'mongoose';
const { ObjectId } = Types;

const oldDate = new Date('2015-01-01');

@ObjectType()
class TopicResult {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  imgUrl?: string;
}

@ObjectType()
class TopicOfGroupResult extends TopicResult {
  @Field()
  unread: boolean;

  @Field()
  pinned: boolean;
}

@Resolver(() => TopicResult)
export class TopicResolver {

  @Query(() => [TopicOfGroupResult])
  async topicsOfGroup(
    @Arg('groupId') groupId: string,
    @Arg('limit') limit: number,
    @Arg('startingId', { nullable: true }) startingId: string,
    @Ctx() { userId, db }: Context
  ): Promise<TopicOfGroupResult[]> {
    await db.UserGroup.findOne({ userId: new ObjectId(userId), groupId }).orFail();
    const idCondition = _.isEmpty(startingId) ? {} : { _id: { $lt: new ObjectId(startingId) } };
    const topics = await db.Topic
      .find({ groupId: new ObjectId(groupId), ...idCondition })
      .limit(limit)
      .sort({ groupId: 1, updatedAt: -1 })
      .lean();
    const topicIds = _.map(topics, topic => topic._id);
    const latestTopicRead = await db.TopicLatestRead.find({
      topicId: { $in: topicIds },
      userId: new ObjectId(userId),
    }).lean();
    const pinnedTopics = await db.PinnedTopic.find({
      userId: new ObjectId(userId),
      topicId: { $in: topicIds },
    }).lean();
    const pinnedTopicsIds = pinnedTopics.map(pinnedTopic => pinnedTopic.topicId.toHexString());
    const pinnedTopicsSet = new Set(pinnedTopicsIds);
    const latestReadByTopicId = _.keyBy(latestTopicRead, l => l.topicId.toHexString());
    return topics.map((topic) => {
      const latestReadObj = latestReadByTopicId[topic._id!.toHexString()];
      const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
      return {
        ...topic,
        id: topic._id?.toHexString(),
        unread: isBefore(latestReadMoment, topic.updatedAt),
        pinned: pinnedTopicsSet.has(topic._id!.toHexString()),
      };
    });
  }

  @Mutation(() => String)
  async createTopic(
    @Arg('groupId') groupId: string,
    @Arg('topicName') topicName: string,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    await db.UserGroup.findOne({ userId: new ObjectId(userId), groupId }).orFail().lean();

    const createdTopic = await db.Topic.create({
      name: topicName,
      groupId: new ObjectId(groupId),
      createdBy: new ObjectId(userId),
      imgUrl: 'TODO url',
    });

    await db.Group.updateOne({ 
      _id: new ObjectId(groupId)
    }, {
      updatedAt: new Date(),
    },);

    await pushNewTopic(db, groupId, createdTopic._id!.toHexString(), createdTopic.name);
    return 'OK';
  }

  @Mutation(() => String)
  async setTopicLatestRead(
    @Arg('topicId') topicId: string,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    await db.TopicLatestRead.updateOne({
      userId: new ObjectId(userId),
      topicId,
    }, {
      latestMoment: new Date(),
    });

    const topic = await db.Topic.findById(topicId).orFail();

    await db.TopicLatestRead.updateOne({
      userId: new ObjectId(userId),
      topicId: new ObjectId(topicId),
    }, {
      latestMoment: new Date(),
    }, { upsert: true });

    await db.UserGroup.updateOne({
      userId: new ObjectId(userId),
      groupId: topic.groupId,
    }, {
      latestRead: new Date(),
    });

    return 'OK';
  }

  @Mutation(() => String)
  async setTopicPin(
    @Arg('topicId') topicId: string,
    @Arg('pinned') pinned: boolean,
    @Ctx() { userId, db }: Context
  ) {
    const user = await db.User.findById(userId).lean();
    if (!user?.notificationToken) {
      throw new Error('Notification token required');
    }

    if (pinned) {
      await db.PinnedTopic.create({
        userId: new ObjectId(userId),
        topicId,
      });
      await subscribeToTopic(db, userId!, user!.notificationToken, topicId);
    } else {
      await db.PinnedTopic.deleteOne({
        userId: new ObjectId(userId),
        topicId,
      });
      await unsubscribeFromTopic(user!.notificationToken, topicId);
    }
    return 'OK';
  }
}
