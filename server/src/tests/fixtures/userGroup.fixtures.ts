import { groupIds, userIds } from './preIds';
import { UserGroup } from '../../db/entity/UserGroup.entity';
import { convertFixedDate } from './fixtureHelper';

const userGroups: Partial<UserGroup>[] = [
  {
    groupId: groupIds.firstGroup,
    userId: userIds.alice,
    pinned: false,
    latestRead: convertFixedDate('2019-07-22'),
  },
  {
    groupId: groupIds.firstGroup,
    userId: userIds.robert,
    pinned: false,
    latestRead: convertFixedDate('2019-07-23'),
  },
  {
    groupId: groupIds.secondGroup,
    userId: userIds.robert,
    pinned: true,
    latestRead: convertFixedDate('2018-04-28'),
  },
];

export default userGroups;
