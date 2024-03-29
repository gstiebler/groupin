import { User } from '../../db/schema/User';
import { userIds } from './preIds';

const users: { [user: string]: Partial<User> } = {
  alice: {
    _id: userIds.alice,
    name: 'Alice',
    imgUrl: 'alice_url',
    externalId: 'aliceExt',
    notificationToken: 'notificationTokenAlice',
  },
  robert: {
    _id: userIds.robert,
    name: 'Robert',
    imgUrl: 'robert_url',
    externalId: 'robertExt',
    notificationToken: 'notificationTokenRobert',
  },
};

export default users;
