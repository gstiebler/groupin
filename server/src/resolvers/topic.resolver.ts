import * as bluebird from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import Topic from '../db/schema/Topic';

import Group from '../db/schema/Group';
import User from '../db/schema/User';
import TopicLatestRead, { ITopicLatestRead } from '../db/schema/TopicLatestRead';
import GroupLatestRead from '../db/schema/GroupLatestRead';

import pushService from '../lib/pushService';

import { subscribeToTopic, unsubscribeFromTopic } from '../lib/subscription';

import { messageTypes } from '../lib/constants';

const oldDate = moment('2015-01-01').toDate();

export async function topicsOfGroup({ groupId, limit }: { groupId: string, limit: number }, { user }) {
  if (!_.find(user.groups, (g) => g.id.toHexString() === groupId)) {
    throw new Error('User does not participate in the group');
  }
  const topics = await Topic.find({ groupId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();
  const latestTopicRead = await TopicLatestRead.find({
    topicId: { $in: _.map(topics, '_id') },
    userId: user._id,
  });
  const pinnedTopicsSet = new Set(_.map(user.pinnedTopics, (t) => t.toHexString()));
  const latestReadById = _.keyBy<ITopicLatestRead>(latestTopicRead, (l) => l.topicId.toString());
  return topics.map((topic) => {
    const latestReadObj = latestReadById[topic._id.toHexString()];
    // TODO: remove when is garanteed to have always a LatestMoment for every user/topic
    const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
    return {
      ...topic,
      id: topic._id,
      unread: moment(latestReadMoment).isBefore(topic.updatedAt),
      pinned: pinnedTopicsSet.has(topic._id.toHexString()),
    };
  });
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
