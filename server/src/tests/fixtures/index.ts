import * as _ from 'lodash';
import groupFixtures from './groupFixtures';
import userFixtures from './userFixtures';
import topicFixtures from './topicFixtures';
import messageFixtures from './messageFixtures';
import userGroupFixtures from './userGroup.fixtures';
import pinnedTopicFixtures from './pinnedTopic.fixtures';
import { ConnCtx } from '../../graphqlContext';

export async function initFixtures(db: ConnCtx) {
  await Promise.all([
    db.pinnedTopicRepository.delete({}),
    db.userGroupRepository.delete({}),
    db.topicLatestReadRepository.delete({}),
    db.topicRepository.delete({}),
    db.groupRepository.delete({}),
    db.messageRepository.delete({}),
    db.userRepository.delete({}),
  ]);

  await Promise.all([
    db.userRepository.insert(_.values(userFixtures)),
    db.messageRepository.insert(_.values(messageFixtures)),
    db.groupRepository.insert(_.values(groupFixtures)),
    db.topicRepository.insert(_.values(topicFixtures)),
    // db.topicLatestReadRepository.insert(_.values(topiLatestReadFixtures)),
    db.userGroupRepository.insert(_.values(userGroupFixtures)),
    db.pinnedTopicRepository.insert(_.values(pinnedTopicFixtures)),
  ]);
}
