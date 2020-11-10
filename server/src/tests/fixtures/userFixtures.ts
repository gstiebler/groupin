import * as mongoose from 'mongoose';
import { groupIds, topicIds } from './preIds';

const { ObjectId } = mongoose.Types;

const users = {
  alice: {
    _id: new ObjectId('507f1f77bcf86cd799430001'),
    uid: '46894278465624393Alice',
    name: 'Alice',
    phoneNumber: '44448',
    imgUrl: 'alice_url',
    groups: [
      {
        id: groupIds.firstGroup,
        pinned: false,
      },
    ],
    pinnedTopics: [],
  },
  robert: {
    _id: new ObjectId('507f1f77bcf86cd799430002'),
    uid: '85076546477256749024Robert',
    name: 'Robert',
    phoneNumber: '55558',
    imgUrl: 'robert_url',
    groups: [
      {
        id: groupIds.firstGroup,
        pinned: false,
      },
      {
        id: groupIds.secondGroup,
        pinned: true,
      },
    ],
    pinnedTopics: [
      topicIds.topic1Group2,
      topicIds.topic2Group1,
    ],
  },
};

export default users;
