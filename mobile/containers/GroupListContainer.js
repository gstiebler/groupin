import { connect } from "react-redux";
import GroupListComponent from '../components/GroupList';
import { 
  fetchOwnGroups,
} from "../actions/rootActions";

const mapStateToProps = state => {
  return { 
    ownGroups: state.base.ownGroups 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectGroup: (navigation, groupId) => { 
      navigation.navigate('TopicsList', { groupId });
    },
    willFocus: () => {
      fetchOwnGroups(dispatch);
    },
    onAdd: (navigation) => navigation.push('GroupsSearch'),
  };
};

const GroupListContainer = connect(mapStateToProps, mapDispatchToProps)(GroupListComponent);
export default GroupListContainer;
