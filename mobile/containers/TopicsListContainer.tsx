import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import TopicsListComponent from '../components/TopicsList';
import { rootStore } from '../rn_lib/storesFactory';

export type TopicsListScreenRouteProp = RouteProp<RootStackParamList, 'TopicsList'>;

type ContainerProp = { navigation: Navigation, route: TopicsListScreenRouteProp };
const TopicsListContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
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
export default TopicsListContainer;
