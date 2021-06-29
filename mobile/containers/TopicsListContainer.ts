import React, { useEffect } from 'react';
import TopicsListComponent, { TopicsListScreenNavigationProp, TopicsListScreenRouteProp } from '../components/TopicsList';
import { rootStore } from '../stores/storesFactory';

type ContainerProp = { navigation: TopicsListScreenNavigationProp, route: TopicsListScreenRouteProp };
const TopicsListContainerContainer: React.FC<ContainerProp> = ({ navigation, route }: ContainerProp) => {
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
