const userFixtures = require('./userFixtures');
const groupIds = require('./groupIds');

const groups = {
  firstGroup: {
    _id: groupIds.firstGroup,
    friendlyId : 'S9hvTvIBWM',
    name: 'First Group',
    description: 'Description of the first group',
    imgUrl: 'url1',
    visibility: 'PUBLIC',
    createdBy: userFixtures.alice._id,
    createdAt: Date.parse('2018-06-05'),
    updatedAt: Date.parse('2018-07-28'),
  },
  secondGroup: {
    _id: groupIds.secondGroup,
    friendlyId : 'TseHHEvGd',
    name: 'Second Group',
    imgUrl: 'url2',
    visibility: 'PUBLIC',
    createdBy: userFixtures.alice._id,
    createdAt: Date.parse('2018-06-06'),
    updatedAt: Date.parse('2018-06-05'),
  },
};

module.exports = groups;
