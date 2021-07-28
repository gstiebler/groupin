/**
 * This file was created to avoid circular dependencies among fixture files
 */
import { v4 as uuidv4 } from 'uuid';

export const groupIds = {
  firstGroup: uuidv4(),
  secondGroup: uuidv4(),
};

export const userIds = {
  alice: uuidv4(),
  robert: uuidv4(),
};

export const topicIds = {
  topic1Group1: uuidv4(),
  topic1Group2: uuidv4(),
  topic2Group2: uuidv4(),
  topic2Group1: uuidv4(),
};
