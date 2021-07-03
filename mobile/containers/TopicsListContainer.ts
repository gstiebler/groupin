import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { RootStackParamList } from '../components/Navigator';
import TopicsListComponent from '../components/TopicsList';
import { rootStore } from '../stores/storesFactory';

export type TopicsListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TopicsList'>;
export type TopicsListScreenRouteProp = RouteProp<RootStackParamList, 'TopicsList'>;

type ContainerProp = { navigation: TopicsListScreenNavigationProp, route: TopicsListScreenRouteProp };
const TopicsListContainerContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
  const willFocus = () => rootStore.setCurrentlyViewedGroup(route.params.groupId);
  const willLeave = () => rootStore.leaveGroup();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  return TopicsListComponent({
    topics: rootStore.topics,
    selectTopic: (topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
    onPinClicked: (topic) => rootStore.setTopicPin({ topicId: topic.id, pinned: !topic.pinned }),
  });
}
export default TopicsListContainerContainer;
