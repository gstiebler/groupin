const { ObjectId } = require('mongoose').Types;
const { groupIds, topicIds } = require('./preIds');

const users = {
  alice: {
    _id: ObjectId('507f1f77bcf86cd799430001'),
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
    _id: ObjectId('507f1f77bcf86cd799430002'),
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

module.exports = users;
