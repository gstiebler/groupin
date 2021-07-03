import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import ConfirmationCode from '../containers/ConfirmationCodeContainer';
import * as React from 'react';
import { Button, Icon, Text } from 'native-base';
import { RootStackParamList } from './Navigator.types';


export const navigationRef = React.createRef<NavigationContainerRef>();

type StackPageName = keyof RootStackParamList;
export function navigate<T extends StackPageName>(name: T, params?: RootStackParamList[T]) {
  navigationRef.current.navigate(name, params);
}
export type NavFn = typeof navigate;

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
          <Button transparent onPress={() => navigation.push('GroupsSearch')}>
            <Text>Buscar</Text>
          </Button>
        ),
        headerRight: () => (
          <Button transparent>
            <Icon name='add' onPress={() => {
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
          <Button transparent>
            <Icon name='add' onPress={() => navigation.push('NewTopic', { groupId: route.params.groupId })}/>
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
        const iconByRoute = {
          'AppStack': `group`,
          'Settings': `settings`,
        };
  
        return <MaterialIcons name={iconByRoute[route.name]} size={size} color={color} />;
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
  <NavigationContainer ref={ navigationRef } >
    <Stack.Navigator initialRouteName="SplashScreen" headerMode="none" screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreenContainer} />
      <Stack.Screen name="Register" component={RegisterContainer} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen 
        name="ConfirmationCode" 
        component={ConfirmationCode} 
        options={{ title: 'Confirme o código' }}
      />
      <Stack.Screen name="TabNavigator" component={tabNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
