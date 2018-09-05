import GroupList from './GroupList';
import TopicsList from './TopicsList';
import Chat from './Chat';

import { createStackNavigator } from 'react-navigation'

export const Navigator = createStackNavigator(
  {
    GroupList: { screen: GroupList },
    Chat: { screen: Chat },
    TopicsList: { screen: TopicsList },
  },
  { initialRouteName: 'GroupList' }
);

export default Navigator;
