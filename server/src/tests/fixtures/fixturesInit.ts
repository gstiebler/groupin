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
    await db.pinnedTopicRepository.deleteMany({});
    await db.userGroupRepository.deleteMany({});
    await db.topicLatestReadRepository.deleteMany({});
    await db.messageRepository.deleteMany({});
    await db.topicRepository.deleteMany({});
    await db.groupRepository.deleteMany({});
    await db.userRepository.deleteMany({});

    await db.userRepository.insertMany(_.values(userFixtures));
    await db.groupRepository.insertMany(_.values(groupFixtures));
    await db.topicRepository.insertMany(_.values(topicFixtures));
    await db.messageRepository.insertMany(_.values(messageFixtures));
    // await db.topicLatestReadRepository.insert(_.values(topiLatestReadFixtures));
    await db.userGroupRepository.insertMany(_.values(userGroupFixtures));
    await db.pinnedTopicRepository.insertMany(_.values(pinnedTopicFixtures));
  } catch (error) {
    logger.error(`Error loading fixtures: ${error}`);
  }
}
