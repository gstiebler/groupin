const moment = require('moment');
const userFixtures = require('./userFixtures');
const { groupIds } = require('./preIds');

const groupLatestReads = [
  {
    groupId: groupIds.firstGroup,
    userId: userFixtures.robert._id,
    latestMoment: moment('2019-07-28').toDate(),
  },
];

module.exports = groupLatestReads;
