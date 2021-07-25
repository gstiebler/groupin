import { User } from '../../db/entity/User.entity';
import { userIds } from './preIds';

const users: { [user: string]: Partial<User> } = {
  alice: {
    id: userIds.alice,
    name: 'Alice',
  },
  robert: {
    id: userIds.robert,
    name: 'Robert',
    imgUrl: 'robert_url',
  },
};

export default users;
