const ObjectId = require('mongoose').Types.ObjectId;
const groupFixtures = require('./groupFixtures');
const userFixtures = require('./userFixtures');
const { topicIds } = require('./preIds');

const topics = {
  topic1Group1: {
    _id: ObjectId(),
    name: 'Topic 1 Group 1',
    imgUrl: 't1g1_url',
    createdBy: userFixtures.alice._id,
    groupId: groupFixtures.firstGroup._id,
    createdAt: Date.parse('2018-07-22'),
    updatedAt: Date.parse('2018-07-28'),
  },
  topic2Group1: {
    _id: ObjectId(),
    name: 'Topic 2 Group 1',
    imgUrl: 't2g1_url',
    createdBy: userFixtures.alice._id,
    groupId: groupFixtures.firstGroup._id,
    createdAt: Date.parse('2018-07-25'),
    updatedAt: Date.parse('2018-07-26'),
  },
  topic1Group2: {
    _id: topicIds.topic1Group2,
    name: 'Topic 1 Group 2',
    imgUrl: 't1g2_url',
    createdBy: userFixtures.alice._id,
    groupId: groupFixtures.secondGroup._id,
    createdAt: Date.parse('2018-07-10'),
    updatedAt: Date.parse('2018-07-12'),
  },
  topic2Group2: {
    _id: topicIds.topic2Group2,
    name: 'Topic 2 Group 2',
    imgUrl: 't2g2_url',
    createdBy: userFixtures.alice._id,
    groupId: groupFixtures.secondGroup._id,
    createdAt: Date.parse('2018-07-11'),
    updatedAt: Date.parse('2018-07-13'),
  },
};

module.exports = topics;
