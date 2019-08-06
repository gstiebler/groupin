import GroupList from '../containers/GroupListContainer';
import TopicsList from '../containers/TopicsListContainer';
import NewTopic from '../containers/NewTopicContainer';
import NewGroup from '../containers/NewGroupContainer';
import Chat from '../containers/ChatContainer';
import Register from '../containers/RegisterContainer';
import Login from '../containers/LoginContainer';
import GroupsSearch from '../containers/GroupsSearchContainer';

import { 
  createSwitchNavigator, 
  createStackNavigator,
} from 'react-navigation'

export const AppStackNavigator = createStackNavigator(
  {
    GroupsSearch: { 
      screen: GroupsSearch,
      navigationOptions: ({ navigation }) => ({
        title: 'Buscar grupos',
      }),
    },
    GroupList: { 
      screen: GroupList,
      navigationOptions: ({ navigation }) => ({
        title: 'Meus grupos',
        headerBackTitle: null,
      }), 
    },
    Chat: { screen: Chat,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.topicName,
      }),  
    },
    TopicsList: { 
      screen: TopicsList,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.groupName,
        headerBackTitle: null,
      }),  
    },
    NewTopic: { 
      screen: NewTopic,
      navigationOptions: () => ({
        title: 'Novo tópico',
      }),  
    },
    NewGroup: { 
      screen: NewGroup,
      navigationOptions: () => ({
        title: 'Novo grupo',
      }),  
    },
  },
  { 
    initialRouteName: 'GroupList', 
    // headerMode: 'none', 
  },
);

export const RootSwitchNavigator = createSwitchNavigator(
  {
    Register: { screen: Register },
    Login: { screen: Login },
    AppStack: { screen: AppStackNavigator },
  },
  { initialRouteName: 'Login' },
);

export default RootSwitchNavigator;
