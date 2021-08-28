import NewGroupComponent, { NewGroupProps } from '../components/NewGroup';
import { createGroup } from '../actions/newGroupActions';
import { Navigation } from '../rn_lib/Navigator.types';

const NewGroupContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const props: NewGroupProps = {
    onCreate: async ({ name, visibility }) => {
      await createGroup({
        groupName: name,
        visibility,
      });
      navigation.goBack();
    },
  };
  return <NewGroupComponent {...props} />;
};
export default NewGroupContainer;
