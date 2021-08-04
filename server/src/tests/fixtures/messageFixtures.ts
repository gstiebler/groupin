import { convertFixedDate } from './fixtureHelper';
import { topicIds, userIds } from './preIds';
import { Message } from '../../db/schema/Message';
import { Types } from 'mongoose';
const { ObjectId } = Types;

const messages: { [message: string]: Partial<Message> } = {
  message1topic1: {
    _id: new ObjectId(),
    text: 'Topic 1 Group 1 Alice',
    userId: userIds.alice,
    topicId: topicIds.topic1Group1,
    createdAt: convertFixedDate('2018-10-01'),
  },
  message2topic1: {
    _id: new ObjectId(),
    text: 'Topic 1 Group 1 Robert',
    userId: userIds.robert,
    topicId: topicIds.topic1Group1,
    createdAt: convertFixedDate('2018-10-02'),
  },
  message1topic2: {
    _id: new ObjectId(),
    text: 'Topic 2 Group 1 Alice',
    userId: userIds.alice,
    topicId: topicIds.topic2Group1,
    createdAt: convertFixedDate('2018-10-03'),
  },
  message1topic1Group2: {
    _id: new ObjectId(),
    text: 'Topic 1 Group 2 Robert elvis',
    userId: userIds.robert,
    topicId: topicIds.topic1Group2,
    createdAt: convertFixedDate('2018-09-12'),
  },
};

export default messages;
