import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import TopicsListComponent, { TopicsListProps } from '../components/TopicsList';
import { groupStore as groupStoreInstance } from '../rn_lib/storesFactory';
import { observer } from 'mobx-react-lite';
import { GroupStore } from '../stores/groupStore';

export type TopicsListScreenRouteProp = RouteProp<RootStackParamList, 'TopicsList'>;

type ContainerProp = { navigation: Navigation, route: TopicsListScreenRouteProp, groupStore: GroupStore };
const TopicsListContainerObserver: React.FC<ContainerProp> = observer(({ navigation, route, groupStore }) => {
  const willFocus = () => groupStore.setCurrentlyViewedGroup(route.params.groupId);
  const willLeave = () => groupStore.leaveGroupScreen();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  const props: TopicsListProps = {
    topics: groupStore.topics,
    selectTopic: (topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
    onPinClicked: (topic) => groupStore.setTopicPin({ topicId: topic.id, pinned: !topic.pinned }),
  };
  return <TopicsListComponent {...props} />;
});
const TopicsListContainer: React.FC<{ navigation: Navigation, route: TopicsListScreenRouteProp }> = ({ navigation, route }) => (
  <TopicsListContainerObserver navigation={navigation} route={route} groupStore={groupStoreInstance}/>
);
export default TopicsListContainer;
