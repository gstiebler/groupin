/**
 * This file was created to avoid circular dependencies among fixture files
 */

const ObjectId = require('mongoose').Types.ObjectId;

const groupIds = {
  firstGroup: ObjectId(),
  secondGroup: ObjectId(),
};

module.exports = groupIds;
