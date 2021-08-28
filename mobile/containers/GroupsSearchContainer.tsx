import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import GroupsSearchComponent, { GroupSearchProps } from '../components/GroupsSearch';
import { Navigation } from '../rn_lib/Navigator.types';
import { groupSearchStore as groupSearchStoreInstance } from '../rn_lib/storesFactory';
import { GroupSearchStore } from '../stores/groupSearchStore';

const GroupsSearchContainerObserver: React.FC<{ navigation: Navigation, groupSearchStore: GroupSearchStore }> = observer(({ navigation, groupSearchStore }) => {
  const willLeave = () => groupSearchStore.reset();
  useEffect(() => navigation.addListener('blur', willLeave), [navigation]);

  const props: GroupSearchProps = {
    groups: groupSearchStore.groups,
    changeSearchText: (searchText) => groupSearchStore.findGroups(searchText),
    onGroupSelected: (groupId) => navigation.push('GroupInfo', { groupId }),
  };
  return <GroupsSearchComponent {...props} />;
});
const GroupsSearchContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => (
  <GroupsSearchContainerObserver navigation={navigation} groupSearchStore={groupSearchStoreInstance}/>
);
export default GroupsSearchContainer;
