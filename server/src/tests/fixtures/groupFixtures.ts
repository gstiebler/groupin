import { groupIds, userIds } from './preIds';
import { convertFixedDate } from './fixtureHelper';
import { Group } from '../../db/schema/Group';

const groups: { [group: string]: Partial<Group> } = {
  firstGroup: {
    _id: groupIds.firstGroup,
    friendlyId: 'S9hvTvIBWM',
    name: 'First Group',
    description: 'Description of the first group',
    imgUrl: 'url1',
    visibility: 'PUBLIC',
    createdBy: userIds.alice,
    createdAt: convertFixedDate('2018-06-05'),
    updatedAt: convertFixedDate('2018-07-28'),
  },
  secondGroup: {
    _id: groupIds.secondGroup,
    friendlyId: 'TseHHEvGd',
    name: 'Second Group',
    description: 'Description of the second group',
    imgUrl: 'url2',
    visibility: 'PUBLIC',
    createdBy: userIds.alice,
    createdAt: convertFixedDate('2018-06-06'),
    updatedAt: convertFixedDate('2018-06-05'),
  },
};

export default groups;
