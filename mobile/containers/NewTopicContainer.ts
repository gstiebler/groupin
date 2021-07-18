import { RouteProp } from '@react-navigation/native';
import { Navigation, RootStackParamList } from '../types/Navigator.types';
import NewTopicComponent from '../components/NewTopic';
import { rootStore } from '../stores/storesFactory';

export type NewTopicScreenRouteProp = RouteProp<RootStackParamList, 'NewTopic'>;
type ContainerProp = { navigation: Navigation, route: NewTopicScreenRouteProp };
const NewTopicContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
  return NewTopicComponent({
    onCreate: (name) => rootStore.topicStore.createTopic({ groupId: route.params.groupId, name, navigation })
  });
};
export default NewTopicContainer;

