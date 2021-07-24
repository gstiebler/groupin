import groupFixtures from './groupFixtures';
import userFixtures from './userFixtures';
import { topicIds } from './preIds';
import { v4 as uuidv4 } from 'uuid';
import { Topic } from '../../db/entity/Topic.entity';
import { convertFixedDate } from './fixtureHelper';

const topics: { [topic: string]: Partial<Topic> } = {
  topic1Group1: {
    id: uuidv4(),
    name: 'Topic 1 Group 1',
    imgUrl: 't1g1_url',
    createdById: userFixtures.alice.id,
    groupId: groupFixtures.firstGroup.id,
    createdAt: convertFixedDate('2018-07-22'),
    updatedAt: convertFixedDate('2018-07-28'),
  },
  topic2Group1: {
    id: topicIds.topic2Group1,
    name: 'Topic 2 Group 1',
    imgUrl: 't2g1_url',
    createdById: userFixtures.alice.id,
    groupId: groupFixtures.firstGroup.id,
    createdAt: convertFixedDate('2018-07-25'),
    updatedAt: convertFixedDate('2018-07-26'),
  },
  topic1Group2: {
    id: topicIds.topic1Group2,
    name: 'Topic 1 Group 2',
    imgUrl: 't1g2_url',
    createdById: userFixtures.alice.id,
    groupId: groupFixtures.secondGroup.id,
    createdAt: convertFixedDate('2018-07-10'),
    updatedAt: convertFixedDate('2018-07-12'),
  },
  topic2Group2: {
    id: topicIds.topic2Group2,
    name: 'Topic 2 Group 2',
    imgUrl: 't2g2_url',
    createdById: userFixtures.alice.id,
    groupId: groupFixtures.secondGroup.id,
    createdAt: convertFixedDate('2018-07-11'),
    updatedAt: convertFixedDate('2018-07-13'),
  },
};

export default topics;
