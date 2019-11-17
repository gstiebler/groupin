/**
 * This file was created to avoid circular dependencies among fixture files
 */

const ObjectId = require('mongoose').Types.ObjectId;

const groupIds = {
  firstGroup: ObjectId('5c1c1e99e362b2ce8042faaa'),
  secondGroup: ObjectId('5c1c1e99e362b2ce8042bbbb'),
};

const topicIds = {
  topic1Group2: ObjectId('5dd1636fb053b6dc87d8bb97'),
  topic2Group2: ObjectId('5dd1637bf1b0a52641cc03d3'),
};

module.exports = {
  groupIds,
  topicIds,
};
