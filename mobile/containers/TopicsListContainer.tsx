import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import TopicsListComponent, { TopicsListProps } from '../components/TopicsList';
import { rootStore as rootStoreInstance } from '../rn_lib/storesFactory';
import { RootStore } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';

export type TopicsListScreenRouteProp = RouteProp<RootStackParamList, 'TopicsList'>;

type ContainerProp = { navigation: Navigation, route: TopicsListScreenRouteProp, rootStore: RootStore };
const TopicsListContainerObserver: React.FC<ContainerProp> = observer(({ navigation, route, rootStore }) => {
  const willFocus = () => rootStore.setCurrentlyViewedGroup(route.params.groupId);
  const willLeave = () => rootStore.leaveGroup();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  const props: TopicsListProps = {
    topics: rootStore.topics,
    selectTopic: (topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
    onPinClicked: (topic) => rootStore.setTopicPin({ topicId: topic.id, pinned: !topic.pinned }),
  };
  return <TopicsListComponent {...props} />;
});
const TopicsListContainer: React.FC<{ navigation: Navigation, route: TopicsListScreenRouteProp }> = ({ navigation, route }) => (
  <TopicsListContainerObserver navigation={navigation} route={route} rootStore={rootStoreInstance}/>
);
export default TopicsListContainer;
