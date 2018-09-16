const ObjectId = require('mongoose').Types.ObjectId;
const groupIds = require('./groupIds');

const users = {
  alice: {
    _id: ObjectId(),
    name: 'Alice',
    phoneNumber: '4444',
    imgUrl: 'alice_url',
    groups: [
      groupIds.firstGroup,
    ],
  },
  robert: {
    _id: ObjectId(),
    name: 'Robert',
    phoneNumber: '5555',
    imgUrl: 'robert_url',
    groups: [
      groupIds.firstGroup,
      groupIds.secondGroup,
    ],
  },
};

module.exports = users;
