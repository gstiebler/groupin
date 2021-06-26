import GroupsSearchComponent from '../components/GroupsSearch';
import { findGroups } from '../actions/groupsSearchActions';
import { GROUPS_SEARCH_ITEMS } from "../constants/action-types";

const mapStateToProps = state => {
  return { 
    groups: state.groupsSearch.groups,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSearchText: searchText => dispatch(findGroups(searchText)),
    onGroupSelected: (navigation, groupId) => {
      navigation.push('GroupInfo', { groupId });
    },
    onBack: (navigation) => navigation.goBack(),
    willLeave: () => { 
      dispatch({ type: GROUPS_SEARCH_ITEMS, payload: { groups: [] } });
    },
  };
};

const GroupsSearchContainer = connect(mapStateToProps, mapDispatchToProps)(GroupsSearchComponent);
export default GroupsSearchContainer;
