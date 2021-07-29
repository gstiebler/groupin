import * as _ from 'lodash';
import groupFixtures from './groupFixtures';
import userFixtures from './userFixtures';
import topicFixtures from './topicFixtures';
import messageFixtures from './messageFixtures';
import userGroupFixtures from './userGroup.fixtures';
import pinnedTopicFixtures from './pinnedTopic.fixtures';
import { ConnCtx } from '../../db/ConnectionContext';

export async function initFixtures(db: ConnCtx) {
  await db.pinnedTopicRepository.delete({});
  await db.userGroupRepository.delete({});
  await db.topicLatestReadRepository.delete({});
  await db.messageRepository.delete({});
  await db.topicRepository.delete({});
  await db.groupRepository.delete({});
  await db.userRepository.delete({});

  await db.userRepository.insert(_.values(userFixtures));
  await db.groupRepository.insert(_.values(groupFixtures));
  await db.topicRepository.insert(_.values(topicFixtures));
  await db.messageRepository.insert(_.values(messageFixtures));
  // await db.topicLatestReadRepository.insert(_.values(topiLatestReadFixtures));
  await db.userGroupRepository.insert(_.values(userGroupFixtures));
  await db.pinnedTopicRepository.insert(_.values(pinnedTopicFixtures));
}