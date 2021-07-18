import { RouteProp } from '@react-navigation/native';
import { Navigation, RootStackParamList } from '../types/Navigator.types';
import NewTopicComponent from '../components/NewTopic';
import { rootStore } from '../rn_lib/storesFactory';

export type NewTopicScreenRouteProp = RouteProp<RootStackParamList, 'NewTopic'>;
type ContainerProp = { navigation: Navigation, route: NewTopicScreenRouteProp };
const NewTopicContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
  return NewTopicComponent({
    onCreate: async (name) => {
      await rootStore.topicStore.createTopic({ groupId: route.params.groupId, name })
      navigation.goBack();
    }
  });
};
export default NewTopicContainer;

