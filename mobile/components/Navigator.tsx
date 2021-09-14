/* eslint-disable react/display-name */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SplashScreenContainer from '../containers/SplashScreenContainer';
import GroupList from '../containers/GroupListContainer';
import TopicsList from '../containers/TopicsListContainer';
import NewTopic from '../containers/NewTopicContainer';
import NewGroup from '../containers/NewGroupContainer';
import Chat from '../containers/ChatContainer';
import RegisterContainer from '../containers/RegisterContainer';
import Login from '../containers/LoginContainer';
import GroupsSearch from '../containers/GroupsSearchContainer';
import GroupInfo from '../containers/GroupInfoContainer';
import Settings from '../containers/SettingsContainer';
import * as React from 'react';
import { Button, Text } from 'native-base';
import { RootStackParamList } from '../rn_lib/Navigator.types';

const Stack = createStackNavigator<RootStackParamList>();

const appStackNavigator = () => (
  <Stack.Navigator initialRouteName="GroupList" >
    <Stack.Screen name="GroupsSearch" component={GroupsSearch} />
    <Stack.Screen 
      name="GroupList" 
      key="GROUP_LIST"
      component={GroupList} 
      options={({ navigation }) => ({
        headerTitle: 'Meus grupos',
        headerBackTitle: null,
        headerLeft: () => (
          <Button variant="ghost" onPress={() => navigation.push('GroupsSearch')}>
            <Text>Buscar</Text>
          </Button>
        ),
        headerRight: () => (
          <Button variant="ghost">
            <Ionicons name='add' size={25} onPress={() => {
              navigation.push('NewGroup')
            }}/>
          </Button>
        ),
      })}
    />
    <Stack.Screen 
      name="Chat" 
      component={Chat} 
      options={({ route }) => ({
        title: route.params.topicName,
      })}
    />
    <Stack.Screen 
      name="TopicsList" 
      component={TopicsList} 
      options={({ navigation, route }) => ({
        headerTitle: () => (
          <Text 
            style={{ fontWeight: 'bold' }}
            onPress={ () => navigation.push('GroupInfo', { groupId: route.params.groupId }) } 
          >
            { route.params.groupName }
          </Text>
        ),
        headerBackTitle: null,
        headerRight: () => (
          <Button>
            <Ionicons name='add' size={25} onPress={() => navigation.push('NewTopic', { groupId: route.params.groupId })}/>
          </Button>
        ),
      })}
    />
    <Stack.Screen name="NewTopic" component={NewTopic} options={{ title: 'Novo tópico' }}/>
    <Stack.Screen name="NewGroup" component={NewGroup} options={{ title: 'Novo grupo' }}/>
    <Stack.Screen name="GroupInfo" component={GroupInfo} options={{ title: 'Informações do grupo' }}/>
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();

const tabNavigator = () => (
  <Tab.Navigator
    initialRouteName="AppStack"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const iconName =
          route.name === 'AppStack' ? 'people-circle-outline' :
          route.name === 'Settings' ? 'settings-outline' :
          'people';
  
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'purple',
      inactiveTintColor: 'gray',
      showLabel: false,
    }}
  >
    <Tab.Screen name="AppStack" component={appStackNavigator} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="SplashScreen" headerMode="none" screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreenContainer} />
      <Stack.Screen name="Register" component={RegisterContainer} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="TabNavigator" component={tabNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
