import * as _ from 'lodash';
import groupFixtures from './groupFixtures';
import userFixtures from './userFixtures';
import topicFixtures from './topicFixtures';
import messageFixtures from './messageFixtures';
import userGroupFixtures from './userGroup.fixtures';
import pinnedTopicFixtures from './pinnedTopic.fixtures';
import { ConnCtx } from '../../db/ConnectionContext';
import logger from '../../config/winston';

export async function initFixtures(db: ConnCtx) {
  try {
    await db.PinnedTopic.deleteMany({});
    await db.UserGroup.deleteMany({});
    await db.TopicLatestRead.deleteMany({});
    await db.Message.deleteMany({});
    await db.Topic.deleteMany({});
    await db.Group.deleteMany({});
    await db.User.deleteMany({});

    await db.User.insertMany(_.values(userFixtures));
    await db.Group.insertMany(_.values(groupFixtures));
    await db.Topic.insertMany(_.values(topicFixtures));
    await db.Message.insertMany(_.values(messageFixtures));
    // await db.topicLatestRead.insert(_.values(topiLatestReadFixtures));
    await db.UserGroup.insertMany(_.values(userGroupFixtures));
    await db.PinnedTopic.insertMany(_.values(pinnedTopicFixtures));
  } catch (error) {
    logger.error(`Error loading fixtures: ${error}`);
  }
}
