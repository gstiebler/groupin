import TopicsListComponent, { TopicsListScreenNavigationProp, TopicsListScreenRouteProp } from '../components/TopicsList';
import { rootStore } from '../stores/storesFactory';

type ContainerProp = { navigation: TopicsListScreenNavigationProp, route: TopicsListScreenRouteProp };
const TopicsListContainerContainer = ({ navigation, route }: ContainerProp) => TopicsListComponent({
  navigation,
  route,
  topics: rootStore.topics,
  selectTopic: (navigation, topicId, topicName) => navigation.push('Chat', { topicId, topicName }),
  onPinClicked: (topic) => rootStore.setTopicPin({ topicId: topic.id, pinned: !topic.pinned }),
  willFocus: (route) => rootStore.setCurrentlyViewedGroup(route.params.groupId),
  willLeave: () => rootStore.leaveGroup(),
});
export default TopicsListContainerContainer;
