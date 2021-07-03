import NewGroupComponent from '../components/NewGroup';
import { createGroup } from '../actions/newGroupActions';
import { RootStackParamList } from '../components/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';

export type NewGroupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewGroup'>;

type ContainerProp = { navigation: NewGroupScreenNavigationProp };
const NewGroupContainer: React.FC<ContainerProp> = ({ navigation }) => NewGroupComponent({
  onCreate: ({ name, visibility }) => createGroup({
    navigation, 
    groupName: name,
    visibility,
  }),
});
export default NewGroupContainer;
