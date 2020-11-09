import * as mongoose from 'mongoose';
import topicFixtures from './topicFixtures';
import userFixtures from './userFixtures';
const { ObjectId } = mongoose.Schema.Types;

const messages = {
  message1topic1: {
    _id: new ObjectId('507f1f77bcf86cd799439001'),
    text: 'Topic 1 Group 1 Alice',
    user: userFixtures.alice._id,
    topic: topicFixtures.topic1Group1._id,
    createdAt: Date.parse('2018-10-01'),
  },
  message2topic1: {
    _id: new ObjectId('507f1f77bcf86cd799439002'),
    text: 'Topic 1 Group 1 Robert',
    user: userFixtures.robert._id,
    topic: topicFixtures.topic1Group1._id,
    createdAt: Date.parse('2018-10-02'),
  },
  message1topic2: {
    _id: new ObjectId('507f1f77bcf86cd799439003'),
    text: 'Topic 2 Group 1 Alice',
    user: userFixtures.alice._id,
    topic: topicFixtures.topic2Group1._id,
    createdAt: Date.parse('2018-10-03'),
  },
  message1topic1Group2: {
    _id: new ObjectId('507f1f77bcf86cd799439004'),
    text: 'Topic 1 Group 2 Robert elvis',
    user: userFixtures.robert._id,
    topic: topicFixtures.topic1Group2._id,
    createdAt: Date.parse('2018-09-12'),
  },
};

export default messages;
