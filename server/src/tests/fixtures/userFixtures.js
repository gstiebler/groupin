const ObjectId = require('mongoose').Types.ObjectId;
const groupIds = require('./groupIds');
const md5 = require('md5');

const users = {
  alice: {
    _id: ObjectId(),
    name: 'Alice',
    phoneNumber: '4444',
    imgUrl: 'alice_url',
    token: '46894278465624393Alice',
    groups: [
      groupIds.firstGroup,
    ],
    tempPassword: md5('passwordAlice'),
  },
  robert: {
    _id: ObjectId(),
    name: 'Robert',
    phoneNumber: '5555',
    imgUrl: 'robert_url',
    token: '85076546477256749024Robert',
    groups: [
      groupIds.firstGroup,
      groupIds.secondGroup,
    ],
  },
};

module.exports = users;
