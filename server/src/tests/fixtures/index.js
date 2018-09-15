const groupFixtures = require('./groupFixtures');
const Group = require('../../db/schema/Group');

async function initFixtures() {
  await Promise.all([
    Group.deleteMany({}),
  ]);

  await Group.insertMany(Object.values(groupFixtures));
}

module.exports = {
  initFixtures,
};
