import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import ConfirmationCode from '../containers/ConfirmationCodeContainer';
import React from 'react';
import { Button, Icon, Text } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import init from '../appInit';

const Stack = createStackNavigator();

const appStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="GroupList">
      <Stack.Screen name="GroupsSearch" component={GroupsSearch} options={{ title: 'Buscar grupos' }}/>
      <Stack.Screen 
        name="GroupList" 
        component={GroupList} 
        options={{ 
          title: 'Meus grupos',
          headerBackTitle: null,
          headerLeft: ({ navigation }) => (
            <Button transparent onPress={() => navigation.push('GroupsSearch')}>
              <Text>Buscar</Text>
           </Button>
          ),
          headerRight: ({ navigation }) => (
            <Button transparent>
              <Icon name='add' onPress={() => navigation.push('NewGroup')}/>
           </Button>
          ),
        }}
      />
      <Stack.Screen 
        name="Chat" 
        component={Chat} 
        options={{ 
          title: ({ navigation }) => navigation.state.params.topicName,
        }}
      />
      <Stack.Screen 
        name="TopicsList" 
        component={TopicsList} 
        options={{ 
          headerTitle: ({ navigation }) => (
            <Text onPress={ () => navigation.push('GroupInfo', { groupId: navigation.state.params.groupId }) } >
              { navigation.state.params.groupName }
            </Text>
          ),
          headerBackTitle: null,
          headerRight: ({ navigation }) => (
            <Button transparent>
              <Icon name='add' onPress={() => navigation.push('NewTopic', { groupId: navigation.state.params.groupId })}/>
           </Button>
          ),
        }}
      />
      <Stack.Screen name="NewTopic" component={NewTopic} options={{ title: 'Novo tópico' }}/>
      <Stack.Screen name="NewGroup" component={NewGroup} options={{ title: 'Novo grupo' }}/>
      <Stack.Screen name="GroupInfo" component={GroupInfo} options={{ title: 'Informações do grupo' }}/>
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const tabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ /*focused, color, size,*/ horizontal, tintColor }) => {
        // const { routeName } = navigation.state;
        const routeName = route;
        const iconByRoute = {
          'AppStack': `group`,
          'Settings': `settings`,
        };
  
        return <MaterialIcons name={iconByRoute[routeName]} size={horizontal ? 20 : 25} color={tintColor} />;
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

const App = ({ navigate }) => {
  init(navigate);
  return (
    <NavigationContainer>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen 
            name="ConfirmationCode" 
            component={ConfirmationCode} 
            options={{ title: 'Confirme o código' }}
          />
          <Stack.Screen name="TabNavigator" component={tabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationContainer>
  );
};

export default App;
