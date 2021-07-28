import userFixtures from './userFixtures';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../../db/entity/Message.entity';
import { convertFixedDate } from './fixtureHelper';
import { topicIds } from './preIds';

const messages: { [message: string]: Partial<Message> } = {
  message1topic1: {
    id: uuidv4(),
    text: 'Topic 1 Group 1 Alice',
    userId: userFixtures.alice.id,
    topicId: topicIds.topic1Group1,
    createdAt: convertFixedDate('2018-10-01'),
  },
  message2topic1: {
    id: uuidv4(),
    text: 'Topic 1 Group 1 Robert',
    userId: userFixtures.robert.id,
    topicId: topicIds.topic1Group1,
    createdAt: convertFixedDate('2018-10-02'),
  },
  message1topic2: {
    id: uuidv4(),
    text: 'Topic 2 Group 1 Alice',
    userId: userFixtures.alice.id,
    topicId: topicIds.topic2Group1,
    createdAt: convertFixedDate('2018-10-03'),
  },
  message1topic1Group2: {
    id: uuidv4(),
    text: 'Topic 1 Group 2 Robert elvis',
    userId: userFixtures.robert.id,
    topicId: topicIds.topic1Group2,
    createdAt: convertFixedDate('2018-09-12'),
  },
};

export default messages;
