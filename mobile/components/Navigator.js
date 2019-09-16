import GroupList from '../containers/GroupListContainer';
import TopicsList from '../containers/TopicsListContainer';
import NewTopic from '../containers/NewTopicContainer';
import NewGroup from '../containers/NewGroupContainer';
import Chat from '../containers/ChatContainer';
import Register from '../containers/RegisterContainer';
import Login from '../containers/LoginContainer';
import GroupsSearch from '../containers/GroupsSearchContainer';
import GroupInfo from '../containers/GroupInfoContainer';
import Settings from '../containers/SettingsContainer';
import React from 'react';
import { Button, Icon, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    GroupInfo: { 
      screen: GroupInfo,
      navigationOptions: () => ({
        title: 'Informações do grupo',
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
},
{
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      const iconByRoute = {
        'AppStack': `group`,
        'Settings': `settings`,
      };

      return <MaterialIcons name={iconByRoute[routeName]} size={horizontal ? 20 : 25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: 'purple',
    inactiveTintColor: 'gray',
    showLabel: false,
  },
});

export const RootSwitchNavigator = createSwitchNavigator(
  {
    Register: { screen: Register },
    Login: { screen: Login },
    TabNavigator: { screen: tabNavigator },
  },
  { initialRouteName: 'Login' },
);

const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;
const App = () => <RootSwitchNavigator persistenceKey={navigationPersistenceKey} />;

export default RootSwitchNavigator;
