import NewGroupComponent from '../components/NewGroup';
import { createGroup } from '../actions/newGroupActions';
import { Navigation } from '../types/Navigator.types';

const NewGroupContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => NewGroupComponent({
  onCreate: ({ name, visibility }) => createGroup({
    navigation,
    groupName: name,
    visibility,
  }),
});
export default NewGroupContainer;
