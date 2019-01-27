import { connect } from "react-redux";
import GroupListComponent from '../components/GroupList';
import { 
} from "../constants/action-types";
// import { register } from '../actions/registerActions';

const mapStateToProps = state => {
  return { ownGroups: state.base.ownGroups };
};

const mapDispatchToProps = dispatch => {
  return {
    selectGroup: (groupId) => { 
      getTopicsOfGroup(dispatch, groupId);
    },
    willFocus: (payload) => {
      console.log('onFocus', payload);
    },
  };
};


const GroupListContainer = connect(mapStateToProps, mapDispatchToProps)(GroupListComponent);
export default GroupListContainer;
