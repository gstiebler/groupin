const ObjectId = require('mongoose').Types.ObjectId;
const groupIds = require('./groupIds');
const md5 = require('md5');

const users = {
  alice: {
    _id: ObjectId('507f1f77bcf86cd799430001'),
    uid: '46894278465624393Alice',
    name: 'Alice',
    phoneNumber: '44448',
    imgUrl: 'alice_url',
    groups: [
      groupIds.firstGroup,
    ],
    tempPassword: md5('passwordAlice'),
  },
  robert: {
    _id: ObjectId('507f1f77bcf86cd799430002'),
    uid: '85076546477256749024Robert',
    name: 'Robert',
    phoneNumber: '55558',
    imgUrl: 'robert_url',
    groups: [
      groupIds.firstGroup,
      groupIds.secondGroup,
    ],
  },
};

module.exports = users;
