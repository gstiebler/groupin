import { User } from '../../db/entity/User.entity';
import { v4 as uuidv4 } from 'uuid';

const users: { [user: string]: Partial<User> } = {
  alice: {
    id: uuidv4(),
    name: 'Alice',
  },
  robert: {
    id: uuidv4(),
    name: 'Robert',
    imgUrl: 'robert_url',
  },
};

export default users;
