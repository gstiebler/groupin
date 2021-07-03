import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  GroupList: undefined;
  GroupsSearch: undefined;
  Chat: { topicId: string, topicName: string };
  TopicsList: { groupName: string, groupId: string };
  NewTopic: { groupId: string };
  NewGroup: undefined;
  GroupInfo: { groupId: string }  ;
  Login: undefined;
  Register: undefined;
  ConfirmationCode: undefined;
  TabNavigator: undefined;
};

export type Navigation = StackNavigationProp<RootStackParamList>;