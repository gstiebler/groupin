import GroupList from '../containers/GroupListContainer';
import TopicsList from './TopicsList';
import Chat from './Chat';
import Register from '../containers/RegisterContainer';
import Login from '../containers/LoginContainer';

import { createSwitchNavigator } from 'react-navigation'

export const Navigator = createSwitchNavigator(
  {
    Register: { screen: Register },
    Login: { screen: Login },
    GroupList: { screen: GroupList },
    Chat: { screen: Chat },
    TopicsList: { screen: TopicsList },
  },
  { initialRouteName: 'Login' },
);

export default Navigator;
