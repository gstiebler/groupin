import * as moment from 'moment';
import userFixtures from './userFixtures';
import { groupIds } from './preIds';

const groupLatestReads = [
  {
    groupId: groupIds.firstGroup,
    userId: userFixtures.robert._id,
    latestMoment: moment('2019-07-28').toDate(),
  },
];

export default groupLatestReads;
