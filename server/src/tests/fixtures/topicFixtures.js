const ObjectId = require('mongoose').Types.ObjectId;
const groupFixtures = require('./groupFixtures');

const topics = {
  topic1Group1: {
    _id: ObjectId(),
    name: 'Topic 1 Group 1',
    imgUrl: 't1g1_url',
    groupId: groupFixtures.firstGroup._id,
    createdAt: Date.parse('2018-09-22'),
  },
  topic2Group1: {
    _id: ObjectId(),
    name: 'Topic 2 Group 1',
    imgUrl: 't2g1_url',
    groupId: groupFixtures.firstGroup._id,
    createdAt: Date.parse('2018-09-25'),
  },
  topic1Group2: {
    _id: ObjectId(),
    name: 'Topic 1 Group 2',
    imgUrl: 't1g2_url',
    groupId: groupFixtures.secondGroup._id,
    createdAt: Date.parse('2018-09-23'),
  },
  topic2Group2: {
    _id: ObjectId(),
    name: 'Topic 2 Group 2',
    imgUrl: 't2g2_url',
    groupId: groupFixtures.secondGroup._id,
    createdAt: Date.parse('2018-09-29'),
  },
};

module.exports = topics;
