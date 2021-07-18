import NewGroupComponent from '../components/NewGroup';
import { createGroup } from '../actions/newGroupActions';
import { Navigation } from '../rn_lib/Navigator.types';

const NewGroupContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => NewGroupComponent({
  onCreate: async ({ name, visibility }) => {
    await createGroup({
      groupName: name,
      visibility,
    });
    navigation.goBack();
  },
});
export default NewGroupContainer;
