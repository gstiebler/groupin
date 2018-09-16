const ObjectId = require('mongoose').Types.ObjectId;

const groups = {
  firstGroup: {
    _id: ObjectId(),
    name: 'First Group',
    imgUrl: 'url1',
    createdAt: Date.parse('2018-06-05'),
    updatedAt: Date.parse('2018-07-28'),
  },
  secondGroup: {
    _id: ObjectId(),
    name: 'Second Group',
    imgUrl: 'url2',
    createdAt: Date.parse('2018-06-06'),
    updatedAt: Date.parse('2018-06-05'),
  },
};

module.exports = groups;
