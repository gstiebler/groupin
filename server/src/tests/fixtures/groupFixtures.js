const ObjectId = require('mongoose').Types.ObjectId;

const groups = {
  firstGroup: {
    _id: ObjectId(),
    name: 'First Group',
    imgUrl: 'url1',
  },
  secondGroup: {
    _id: ObjectId(),
    name: 'Second Group',
    imgUrl: 'url2',
  },
};

module.exports = groups;
