const groupFixtures = require('./groupFixtures');
const userFixtures = require('./userFixtures');
const topicFixtures = require('./topicFixtures');

const Group = require('../../db/schema/Group');
const User = require('../../db/schema/User');
const Topic = require('../../db/schema/Topic');

async function initFixtures() {
  await Promise.all([
    Group.deleteMany({}),
    User.deleteMany({}),
    Topic.deleteMany({}),
  ]);

  await Promise.all([
    Group.insertMany(Object.values(groupFixtures)),
    User.insertMany(Object.values(userFixtures)),
    Topic.insertMany(Object.values(topicFixtures)),
  ]);
}

module.exports = {
  initFixtures,
};
