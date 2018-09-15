const ObjectId = require('mongoose').Types.ObjectId;

const groups = {
  firstGroup: {
    _id: ObjectId(),
    name: 'First Group',
    imgUrl: 'url1',
    createdAt: Date.parse('2018-09-05'),
  },
  secondGroup: {
    _id: ObjectId(),
    name: 'Second Group',
    imgUrl: 'url2',
    createdAt: Date.parse('2018-09-06'),
  },
};

module.exports = groups;
