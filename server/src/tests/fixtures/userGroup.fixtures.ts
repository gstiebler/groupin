import userFixtures from './userFixtures';
import { groupIds } from './preIds';
import { UserGroup } from '../../db/entity/UserGroup.entity';
import { convertFixedDate } from './fixtureHelper';

const userGroups: Partial<UserGroup>[] = [
  {
    groupId: groupIds.firstGroup,
    userId: userFixtures.alice.id,
    pinned: false,
    latestRead: convertFixedDate('2019-07-22'),
  },
  {
    groupId: groupIds.firstGroup,
    userId: userFixtures.robert.id,
    pinned: false,
    latestRead: convertFixedDate('2019-07-23'),
  },
  {
    groupId: groupIds.secondGroup,
    userId: userFixtures.robert.id,
    pinned: true,
    latestRead: convertFixedDate('2019-07-28'),
  },
];

export default userGroups;
