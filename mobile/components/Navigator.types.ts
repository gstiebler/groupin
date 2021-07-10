import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  SplashScreen: undefined;
  GroupList: undefined;
  GroupsSearch: undefined;
  Chat: { topicId: string, topicName: string };
  TopicsList: { groupName: string, groupId: string };
  NewTopic: { groupId: string };
  NewGroup: undefined;
  GroupInfo: { groupId: string }  ;
  Login: undefined;
  Register: undefined;
  TabNavigator: undefined;
};

export type Navigation = StackNavigationProp<RootStackParamList>;