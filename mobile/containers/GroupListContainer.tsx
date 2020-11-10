import { connect } from "react-redux";
import GroupListComponent from '../components/GroupList';
import { 
  fetchOwnGroups,
} from "../actions/rootActions";
import { 
  leaveGroup,
  setGroupPin,
} from "../actions/groupActions";

const mapStateToProps = state => {
  return { 
    ownGroups: state.base.ownGroups 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectGroup: (navigation, groupId, groupName) => { 
      navigation.navigate('TopicsList', { groupId, groupName });
    },
    onLeaveGroup: (groupId) => dispatch(leaveGroup(groupId)),
    onPinClicked: (group) => dispatch(setGroupPin({ groupId: group.id, pinned: !group.pinned })),
    willFocus: () => {
      fetchOwnGroups(dispatch);
    },
  };
};

const GroupListContainer = connect(mapStateToProps, mapDispatchToProps)(GroupListComponent);
export default GroupListContainer;
