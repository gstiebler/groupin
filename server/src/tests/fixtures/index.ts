const groupFixtures = require('./groupFixtures');
const userFixtures = require('./userFixtures');
const topicFixtures = require('./topicFixtures');
const messageFixtures = require('./messageFixtures');
const groupLatestReadFixtures = require('./groupLatestReadFixtures');

const Group = require('../../db/schema/Group');
const User = require('../../db/schema/User');
const Topic = require('../../db/schema/Topic');
const Message = require('../../db/schema/Message');
const TopicLatestRead = require('../../db/schema/TopicLatestRead');
const GroupLatestRead = require('../../db/schema/GroupLatestRead');

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
