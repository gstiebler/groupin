const groupFixtures = require('./groupFixtures');
const userFixtures = require('./userFixtures');
const Group = require('../../db/schema/Group');
const User = require('../../db/schema/User');

async function initFixtures() {
  await Promise.all([
    Group.deleteMany({}),
    User.deleteMany({}),
  ]);

  await Promise.all([
    Group.insertMany(Object.values(groupFixtures)),
    User.insertMany(Object.values(userFixtures)),
  ]);
}

module.exports = {
  initFixtures,
};
