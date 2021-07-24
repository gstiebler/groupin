import * as bluebird from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Topic } from "../db/entity/Topic";
import pushService from '../lib/pushService';
import { subscribeToTopic, unsubscribeFromTopic } from '../lib/subscription';
import { messageTypes } from '../lib/constants';
import { Context } from '../graphqlContext';
import { TopicLatestRead } from '../db/entity/TopicLatestRead';
import { In } from 'typeorm';

const oldDate = moment('2015-01-01').toDate();


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
      pinned: true,
    });
    const pinnedTopicsIds = pinnedTopics.map(pinnedTopic => pinnedTopic.topicId);
    const pinnedTopicsSet = new Set(pinnedTopicsIds);
    const latestReadByTopicId = _.keyBy(latestTopicRead, l => l.topicId);
    return topics.map((topic) => {
      const latestReadObj = latestReadByTopicId[topic.id];
      const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
      return {
        ...topic,
        unread: moment(latestReadMoment).isBefore(topic.updatedAt),
        pinned: pinnedTopicsSet.has(topic.id),
      };
    });
  }

}



export async function createTopic({ topicName, groupId }: { topicName: string, groupId: string }, { user }) {
  if (!_.find(user.groups, (g) => g.id.toHexString() === groupId)) {
    throw new Error('User does not participate in the group');
  }
  const topicCreatePromise = Topic.create({
    name: topicName,
    groupId: ObjectId(groupId),
    createdBy: ObjectId(user._id),
    imgUrl: 'TODO url',
  });

  const groupUpdatePromise = Group.updateOne(
    { _id: ObjectId(groupId) },
    {
      $set: {
        updatedAt: Date.now(),
      },
    },
  );

  const [createdTopic] = await bluebird.all([
    topicCreatePromise,
    groupUpdatePromise,
  ]);

  // TODO: add topicLatestRead

  const pushPayload = {
    type: messageTypes.NEW_TOPIC,
    groupId,
    topicName,
    topicId: createdTopic._id.toHexString(),
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

export async function setTopicLatestRead({ topicId }: { topicId: string }, { user }) {
  const topic = await Topic.findById(topicId);
  const updateObj = {
    latestMoment: new Date(),
  };
  const opts = {
    new: true,
    upsert: true,
  };
  // TODO: replace for `update` when is garanteed to have always a LatestMoment for every user/topic
  await TopicLatestRead.findOneAndUpdate(
    {
      userId: user._id,
      topicId: ObjectId(topicId),
    },
    updateObj,
    opts,
  );
  // TODO: replace for `update` when is garanteed to have always a LatestMoment for every user/topic
  await GroupLatestRead.findOneAndUpdate(
    {
      userId: user._id,
      groupId: topic.groupId,
    },
    updateObj,
    opts,
  );
  return 'OK';
}

export async function setTopicPin({ topicId, pinned }, { user }) {
  const updateOperation = pinned ? '$push' : '$pull';
  await User.updateOne(
    { _id: user._id },
    { [updateOperation]: { pinnedTopics: ObjectId(topicId) } },
  );
  if (pinned) {
    await subscribeToTopic(user, user.fcmToken, topicId);
  } else {
    await unsubscribeFromTopic(user.fcmToken, topicId);
  }
  return 'OK';
}
