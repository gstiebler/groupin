import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import NewTopicComponent, { NewTopicProps } from '../components/NewTopic';
import { topicStore } from '../rn_lib/storesFactory';

export type NewTopicScreenRouteProp = RouteProp<RootStackParamList, 'NewTopic'>;
type ContainerProp = { navigation: Navigation, route: NewTopicScreenRouteProp };
const NewTopicContainer: React.FC<ContainerProp> = ({ navigation, route }) => {
  const props: NewTopicProps = {
    onCreate: async (name) => {
      await topicStore.createTopic({ groupId: route.params.groupId, name })
      navigation.goBack();
    }
  };
  return <NewTopicComponent {...props} />;
};
export default NewTopicContainer;

