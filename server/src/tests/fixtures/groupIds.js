/**
 * This file was created to avoid circular dependencies among fixture files
 */

const ObjectId = require('mongoose').Types.ObjectId;

const groupIds = {
  firstGroup: ObjectId('5c1c1e99e362b2ce8042faaa'),
  secondGroup: ObjectId('5c1c1e99e362b2ce8042bbbb'),
};

module.exports = groupIds;
