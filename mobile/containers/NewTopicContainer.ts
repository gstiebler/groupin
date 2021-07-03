import NewTopicComponent, { NewTopicScreenNavigationProp, NewTopicScreenRouteProp } from '../components/NewTopic';
import { rootStore } from '../stores/storesFactory';

type ContainerProp = { navigation: NewTopicScreenNavigationProp, route: NewTopicScreenRouteProp };
const NewTopicContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
  return NewTopicComponent({
    onCreate: (name) => rootStore.topicStore.createTopic({ groupId: route.params.groupId, name, navigation })
  });
};
export default NewTopicContainer;

