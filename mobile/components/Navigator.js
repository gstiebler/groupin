import GroupList from '../containers/GroupListContainer';
import TopicsList from './TopicsList';
import Chat from './Chat';
import Register from '../containers/RegisterContainer';
import Login from '../containers/LoginContainer';
import GroupsSearch from '../containers/GroupsSearchContainer';

import { 
  createSwitchNavigator, 
  createStackNavigator,
} from 'react-navigation'

export const SwitchNavigator = createSwitchNavigator(
  {
    Register: { screen: Register },
    Login: { screen: Login },
    GroupList: { screen: GroupList },
    Chat: { screen: Chat },
    TopicsList: { screen: TopicsList },
  },
  { initialRouteName: 'Login' },
);

export const RootStackNavigator = createStackNavigator(
  {
    Switch: { screen: SwitchNavigator },
    GroupsSearch: { screen: GroupsSearch },
  },
  { initialRouteName: 'Switch' },
);

export default RootStackNavigator;
