import { connect } from "react-redux";
import NewGroupComponent from '../components/NewGroup';
import { createGroup } from '../actions/newGroupActions';

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onCreate: (navigator, name) => dispatch(createGroup({
      navigation: navigator, 
      groupName: name,
      visibility: 'PUBLIC',
    })),
  };
};

const NewGroupContainer = connect(mapStateToProps, mapDispatchToProps)(NewGroupComponent);
export default NewGroupContainer;
