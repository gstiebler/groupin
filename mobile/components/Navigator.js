import GroupList from '../containers/GroupListContainer';
import TopicsList from '../containers/TopicsListContainer';
import Chat from '../containers/ChatContainer';
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
    GroupsSearch: { 
      screen: GroupsSearch,
      navigationOptions: ({ navigation }) => ({
        title: 'Buscar grupos',
        // title: `${navigation.state.params.name}'s Profile'`,
      }),
    },
  },
  { 
    initialRouteName: 'Switch', 
    // headerMode: 'none', 
  },
);

export default RootStackNavigator;
