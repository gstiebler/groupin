import GroupListComponent from '../components/GroupList';
import { useEffect } from 'react';
import { groupStore } from '../rn_lib/storesFactory';
import { Group } from '../lib/server';
import { Navigation } from '../types/Navigator.types';

const GroupListContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  const willFocus = () => groupStore.fetchOwnGroups();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);

  return GroupListComponent({
    ownGroups: groupStore.ownGroups, 
    selectGroup: (groupId, groupName) => navigation.navigate('TopicsList', { groupId, groupName }), 
    onLeaveGroup: (groupId) => groupStore.leaveGroup(groupId, navigation), 
    onPinClicked: (group: Group) => groupStore.setGroupPin({ groupId: group.id, pinned: !group.pinned }),
  });
};
export default GroupListContainer;
