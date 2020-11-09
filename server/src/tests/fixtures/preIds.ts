/**
 * This file was created to avoid circular dependencies among fixture files
 */

import * as mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export const groupIds = {
  firstGroup: new ObjectId('5c1c1e99e362b2ce8042faaa'),
  secondGroup: new ObjectId('5c1c1e99e362b2ce8042bbbb'),
};

export const topicIds = {
  topic1Group2: new ObjectId('5dd1636fb053b6dc87d8bb97'),
  topic2Group2: new ObjectId('5dd1637bf1b0a52641cc03d3'),
  topic2Group1: new ObjectId('5dd1637bf1b0a52641cc03d4'),
};
