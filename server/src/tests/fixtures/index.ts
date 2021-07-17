/*
import groupFixtures from './groupFixtures';
import userFixtures from './userFixtures';
import topicFixtures from './topicFixtures';
import messageFixtures from './messageFixtures';
import groupLatestReadFixtures from './groupLatestReadFixtures';

import Group from '../../db/schema/Group';
import User from '../../db/schema/User';
import Topic from '../../db/schema/Topic';
import Message from '../../db/schema/Message';
import TopicLatestRead from '../../db/schema/TopicLatestRead';
import GroupLatestRead from '../../db/schema/GroupLatestRead';

async function initFixtures() {
  await Promise.all([
    Group.deleteMany({}),
    User.deleteMany({}),
    Topic.deleteMany({}),
    Message.deleteMany({}),
    TopicLatestRead.deleteMany({}),
    GroupLatestRead.deleteMany({}),
  ]);

  await Promise.all([
    Group.insertMany(Object.values(groupFixtures)),
    User.insertMany(Object.values(userFixtures)),
    Topic.insertMany(Object.values(topicFixtures)),
    Message.insertMany(Object.values(messageFixtures)),
    GroupLatestRead.insertMany(groupLatestReadFixtures),
  ]);
}

module.exports = {
  initFixtures,
};
*/
