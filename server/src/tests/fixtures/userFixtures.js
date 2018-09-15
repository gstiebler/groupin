const ObjectId = require('mongoose').Types.ObjectId;
const groupFixtures = require('./groupFixtures');

const users = {
  alice: {
    _id: ObjectId(),
    name: 'Alice',
    phoneNumber: '4444',
    imgUrl: 'alice_url',
    groups: [
      groupFixtures.firstGroup._id,
    ],
  },
  robert: {
    _id: ObjectId(),
    name: 'Robert',
    phoneNumber: '5555',
    imgUrl: 'robert_url',
    groups: [
      groupFixtures.firstGroup._id,
      groupFixtures.secondGroup._id,
    ],
  },
};

module.exports = users;
