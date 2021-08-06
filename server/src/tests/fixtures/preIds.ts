/**
 * This file was created to avoid circular dependencies among fixture files
 */
import { Types } from 'mongoose';
const { ObjectId } = Types;

export const groupIds = {
  firstGroup: new ObjectId("610c8cd99317a37387a2eb0f"),
  secondGroup: new ObjectId("610c8cd99317a37387a2eb10"),
};

export const userIds = {
  alice: new ObjectId(),
  robert: new ObjectId(),
};

export const topicIds = {
  topic1Group1: new ObjectId(),
  topic1Group2: new ObjectId(),
  topic2Group2: new ObjectId(),
  topic2Group1: new ObjectId(),
};
