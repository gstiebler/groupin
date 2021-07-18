import { useEffect } from 'react';
import GroupsSearchComponent from '../components/GroupsSearch';
import { Navigation } from '../types/Navigator.types';
import { groupSearchStore } from '../rn_lib/storesFactory';

const GroupsSearchContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const willLeave = () => groupSearchStore.reset();
  useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  return GroupsSearchComponent({
    groups: groupSearchStore.groups,
    changeSearchText: (searchText) => groupSearchStore.findGroups(searchText),
    onGroupSelected: (groupId) => navigation.push('GroupInfo', { groupId }),
  });
}
export default GroupsSearchContainer;
