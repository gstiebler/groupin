import * as _ from 'lodash';
import { isBefore } from 'date-fns';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import pushService from '../lib/pushService';
import { subscribeToTopic, unsubscribeFromTopic } from '../lib/subscription';
import { messageTypes } from '../lib/constants';
import { Context } from '../graphqlContext';

const oldDate = new Date('2015-01-01');



@ObjectType()
class TopicResult {

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
    @Arg('skip') skip: number,
    @Ctx() { user, db }: Context
  ): Promise<TopicOfGroupResult[]> {
    await db.UserGroup.findOne({ userId: user!.id, groupId }).orFail();
    // TODO: use an alternative to skip
    const topics = await db.Topic.find({
      where: { groupId },
      take: limit,
      skip,
      order: { updatedAt: 'DESC' }
    });
    const topicIds = _.map(topics, topic => topic.id);
    const latestTopicRead = await db.TopicLatestRead.findOne({
      topicId: { $in: topicIds },
      userId: user!.id,
    }).orFail();
    const pinnedTopics = await db.PinnedTopic.find({
      userId: user!.id,
      topicId: { $in: topicIds },
    });
    const pinnedTopicsIds = pinnedTopics.map(pinnedTopic => pinnedTopic.topicId);
    const pinnedTopicsSet = new Set(pinnedTopicsIds);
    const latestReadByTopicId = _.keyBy(latestTopicRead, l => l.topicId.toString());
    return topics.map((topic) => {
      const latestReadObj = latestReadByTopicId[topic.id];
      const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
      return {
        ...topic,
        unread: isBefore(latestReadMoment, topic.updatedAt),
        pinned: pinnedTopicsSet.has(topic.id),
      };
    });
  }

  @Mutation(() => String)
  async createTopic(
    @Arg('groupId') groupId: string,
    @Arg('topicName') topicName: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    await db.UserGroup.findOne({ userId: user!.id, groupId }).orFail();

    const createdTopic = await db.Topic.create({
      name: topicName,
      groupId,
      createdById: user!.id,
      imgUrl: 'TODO url',
    });

    await db.Group.updateOne({ 
      id: groupId
    }, {
      updatedAt: new Date(),
    },);

    await db.TopicLatestRead.create({
      topicId: createdTopic.id,
      userId: user!.id,
      latestMoment: new Date(),
    });

    const pushPayload = {
      type: messageTypes.NEW_TOPIC,
      groupId,
      topicName,
      topicId: createdTopic.id,
    };
    const pushParams = {
      payload: pushPayload,
      title: 'Novo tópico',
      body: topicName.slice(0, 50),
      sendNotification: true,
    };
    await pushService.pushMessage(groupId, pushParams);
    return 'OK';
  }

  @Mutation(() => String)
  async setTopicLatestRead(
    @Arg('topicId') topicId: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    await db.TopicLatestRead.updateOne({
      userId: user!.id,
      topicId,
    }, {
      latestMoment: new Date(),
    });

    const topic = await db.Topic.findOne(topicId).orFail();
    const userGroup = await db.UserGroup.findOne({
      userId: user!.id,
      groupId: topic.groupId,
    }).orFail();
    await db.UserGroup.updateOne({
      id: userGroup._id,
      userId: user!.id,
    }, {
      groupId: topic.groupId,
      latestMoment: Date.now(),
    });

    return 'OK';
  }

  @Mutation(() => String)
  async setTopicPin(
    @Arg('topicId') topicId: string,
    @Arg('pinned') pinned: boolean,
    @Ctx() { user, db }: Context
  ) {
    if (!user!.notificationToken) {
      throw new Error('Notification token required');
    }

    if (pinned) {
      await db.PinnedTopic.create({
        userId: user!.id,
        topicId,
      });
      await subscribeToTopic(db, user!, user!.notificationToken, topicId);
    } else {
      await db.PinnedTopic.deleteOne({
        userId: user!.id,
        topicId,
      });
      await unsubscribeFromTopic(user!.notificationToken, topicId);
    }
    return 'OK';
  }
}
