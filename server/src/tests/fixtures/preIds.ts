/**
 * This file was created to avoid circular dependencies among fixture files
 */
import { ObjectID } from 'typeorm';

export const groupIds = {
  firstGroup: new ObjectID(),
  secondGroup: new ObjectID(),
};

export const userIds = {
  alice: new ObjectID(),
  robert: new ObjectID(),
};

export const topicIds = {
  topic1Group1: new ObjectID(),
  topic1Group2: new ObjectID(),
  topic2Group2: new ObjectID(),
  topic2Group1: new ObjectID(),
};
