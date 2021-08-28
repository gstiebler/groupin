import React from 'react';
import GroupListComponent, { GroupListProps } from '../components/GroupList';
import { useEffect } from 'react';
import { groupStore as groupStoreInstance } from '../rn_lib/storesFactory';
import { Group } from '../lib/server';
import { Navigation } from '../rn_lib/Navigator.types';
import { observer } from "mobx-react-lite"
import { GroupStore } from '../stores/groupStore';

const GroupListOriginal: React.FC<{ navigation: Navigation, groupStore: GroupStore }> = ({ navigation, groupStore }) => {
  const willFocus = () => groupStore.fetchOwnGroups();
  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);

  const props: GroupListProps = {
    ownGroups: groupStore.ownGroups, 
    selectGroup: (groupId, groupName) => navigation.navigate('TopicsList', { groupId, groupName }), 
    onLeaveGroup: async (groupId) => {
      await groupStore.leaveGroup(groupId);
      navigation.navigate('GroupList');
    }, 
    onPinClicked: (group: Group) => groupStore.setGroupPin({ groupId: group.id, pinned: !group.pinned }),
  };

  return <GroupListComponent {...props} />;
}

const GroupListContainerObserver: React.FC<{ navigation: Navigation, groupStore: GroupStore }> = observer(GroupListOriginal);
const GroupListContainer: React.FC<{ navigation: Navigation }> = ({ navigation }) => (
  <GroupListContainerObserver groupStore={groupStoreInstance} navigation={navigation}/>
);
export default GroupListContainer;
