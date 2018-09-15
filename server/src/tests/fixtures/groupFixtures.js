const ObjectId = require('mongoose').Types.ObjectId;

const groups = {
  firstGroup: {
    _id: ObjectId(),
    name: 'First Group',
  },
  secondGroup: {
    _id: ObjectId(),
    name: 'Second Group',
  },
};

module.exports = groups;
