import GroupList from '../containers/GroupListContainer';
import TopicsList from './TopicsList';
import Chat from './Chat';
import Register from '../containers/RegisterContainer';

import { createStackNavigator } from 'react-navigation'

export const Navigator = createStackNavigator(
  {
    Register: { screen: Register },
    GroupList: { screen: GroupList },
    Chat: { screen: Chat },
    TopicsList: { screen: TopicsList },
  },
  { initialRouteName: 'Register' },
);

export default Navigator;
