import NewGroupComponent from '../components/NewGroup';
import { createGroup } from '../actions/newGroupActions';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onCreate: ({ navigation, name, visibility }) => dispatch(createGroup({
      navigation, 
      groupName: name,
      visibility,
    })),
  };
};

const NewGroupContainer = connect(mapStateToProps, mapDispatchToProps)(NewGroupComponent);
export default NewGroupContainer;
