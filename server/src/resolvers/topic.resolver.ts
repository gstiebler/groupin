import * as _ from 'lodash';
import { isBefore } from 'date-fns';
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Topic } from "../db/entity/Topic.entity";
import pushService from '../lib/pushService';
import { subscribeToTopic, unsubscribeFromTopic } from '../lib/subscription';
import { messageTypes } from '../lib/constants';
import { Context } from '../graphqlContext';
import { In } from 'typeorm';

const oldDate = new Date('2015-01-01');


@Resolver(() => Topic)
export class TopicResolver {

  @Query(() => [Topic])
  async topicsOfGroup(
    @Arg('groupId') groupId: string,
    @Arg('limit') limit: number,
    @Arg('skip') skip: number,
    @Ctx() { user, db }: Context
  ): Promise<Topic[]> {
    await db.userGroupRepository.findOneOrFail({ userId: user!.id, groupId });
    // TODO: use an alternative to skip
    const topics = await db.topicRepository.find({
      where: { groupId },
      take: limit,
      skip,
      order: { updatedAt: 'DESC' }
    });
    const topicIds = _.map(topics, topic => topic.id);
    const latestTopicRead = await db.topicLatestReadRepository.find({
      topicId: In(topicIds),
      userId: user!.id,
    });
    const pinnedTopics = await db.pinnedTopicRepository.find({
      userId: user!.id,
      topicId: In(topicIds),
    });
    const pinnedTopicsIds = pinnedTopics.map(pinnedTopic => pinnedTopic.topicId);
    const pinnedTopicsSet = new Set(pinnedTopicsIds);
    const latestReadByTopicId = _.keyBy(latestTopicRead, l => l.topicId);
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
    await db.userGroupRepository.findOneOrFail({ userId: user!.id, groupId });

    const createdTopic = await db.topicRepository.save({
      name: topicName,
      groupId,
      createdById: user!.id,
      imgUrl: 'TODO url',
    });

    await db.groupRepository.update(
      { 
        id: groupId
      }, {
        updatedAt: Date.now(),
      },
    );

    await db.topicLatestReadRepository.save({
      topicId: createdTopic.id,
      userId: user!.id,
      latestMoment: Date.now(),
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
    const topicLatestRead = await db.topicLatestReadRepository.findOne({
      userId: user!.id,
      topicId,
    });
    await db.topicLatestReadRepository.save({
      id: topicLatestRead?.id,
      userId: user!.id,
      topicId,
      latestMoment: Date.now(),
    });

    const topic = await db.topicRepository.findOneOrFail(topicId);
    const userGroup = await db.userGroupRepository.findOne({
      userId: user!.id,
      group: topic.group,
    });
    await db.userGroupRepository.save({
      id: userGroup?.id,
      userId: user!.id,
      group: topic.group,
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
    if (pinned) {
      await db.pinnedTopicRepository.save({
        userId: user!.id,
        topicId,
      });
      await subscribeToTopic(db, user!, user!.notificationToken, topicId);
    } else {
      await db.pinnedTopicRepository.delete({
        userId: user!.id,
        topicId,
      });
      await unsubscribeFromTopic(user!.notificationToken, topicId);
    }
    return 'OK';
  }
}
