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
    await Promise.all([
      db.PinnedTopic.deleteMany({}),
      db.UserGroup.deleteMany({}),
      db.TopicLatestRead.deleteMany({}),
      db.Message.deleteMany({}),
      db.Topic.deleteMany({}),
      db.Group.deleteMany({}),
      db.User.deleteMany({}),
    ]);

    await Promise.all([
      db.User.insertMany(_.values(userFixtures)),
      db.Group.insertMany(_.values(groupFixtures)),
      db.Topic.insertMany(_.values(topicFixtures)),
      db.Message.insertMany(_.values(messageFixtures)),
      // await db.topicLatestRead.insert(_.values(topiLatestReadFixtures)),
      db.UserGroup.insertMany(_.values(userGroupFixtures)),
      db.PinnedTopic.insertMany(_.values(pinnedTopicFixtures)),
    ]);
  } catch (error) {
    logger.error(`Error loading fixtures: ${error}`);
  }
}
