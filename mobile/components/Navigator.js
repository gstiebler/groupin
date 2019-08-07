import GroupList from '../containers/GroupListContainer';
import TopicsList from '../containers/TopicsListContainer';
import NewTopic from '../containers/NewTopicContainer';
import NewGroup from '../containers/NewGroupContainer';
import Chat from '../containers/ChatContainer';
import Register from '../containers/RegisterContainer';
import Login from '../containers/LoginContainer';
import GroupsSearch from '../containers/GroupsSearchContainer';
import Settings from '../components/Settings';
import React from 'react';
import { Button, Icon, Text } from 'native-base';

import { 
  createSwitchNavigator, 
  createStackNavigator,
  createBottomTabNavigator,
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
        headerLeft: (
          <Button transparent onPress={() => navigation.push('GroupsSearch')}>
            <Text>Buscar</Text>
         </Button>
        ),
        headerRight: (
          <Button transparent>
            <Icon name='add' onPress={() => navigation.push('NewGroup')}/>
         </Button>
        ),
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
        headerRight: (
          <Button transparent>
            <Icon name='add' onPress={() => navigation.push('NewTopic', { groupId: navigation.state.params.groupId })}/>
         </Button>
        ),
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

const tabNavigator = createBottomTabNavigator({
  AppStack: AppStackNavigator,
  Settings: Settings,
});

export const RootSwitchNavigator = createSwitchNavigator(
  {
    Register: { screen: Register },
    Login: { screen: Login },
    TabNavigator: { screen: tabNavigator },
  },
  { initialRouteName: 'Login' },
);

export default RootSwitchNavigator;
