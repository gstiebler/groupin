import React from 'react';
import GroupListComponent from '../components/GroupList';
import { useEffect } from 'react';
import { groupStore as groupStoreInstance } from '../rn_lib/storesFactory';
import { Group } from '../lib/server';
import { Navigation } from '../rn_lib/Navigator.types';
import { observer } from "mobx-react-lite"
import { GroupStore } from '../stores/groupStore';

const GroupListContainerObserver: React.FC<{ navigation: Navigation, groupStore: GroupStore }> = observer(({ navigation, groupStore }) => {
  const willFocus = () => groupStore.fetchOwnGroups();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);

  return GroupListComponent({
    ownGroups: groupStore.ownGroups, 
    selectGroup: (groupId, groupName) => navigation.navigate('TopicsList', { groupId, groupName }), 
    onLeaveGroup: async (groupId) => {
      await groupStore.leaveGroup(groupId);
      navigation.navigate('GroupList');
    }, 
    onPinClicked: (group: Group) => groupStore.setGroupPin({ groupId: group.id, pinned: !group.pinned }),
  });
});
const GroupListContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => (
  <GroupListContainerObserver groupStore={groupStoreInstance} navigation={navigation}/>
);
export default GroupListContainer;
