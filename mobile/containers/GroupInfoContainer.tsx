import { RouteProp } from '@react-navigation/native';
import React, { useEffect } from 'react';
import GroupInfoComponent from '../components/GroupInfo';
import { Navigation, RootStackParamList } from '../rn_lib/Navigator.types';
import { groupStore as groupStoreInstance } from '../rn_lib/storesFactory';
import { GroupStore } from '../stores/groupStore';

export type GroupInfoScreenRouteProp = RouteProp<RootStackParamList, 'GroupInfo'>;
type ContainerProp = { navigation: Navigation, route: GroupInfoScreenRouteProp, groupStore: GroupStore };
const GroupInfoContainerObserver: React.FC<ContainerProp> = ({ navigation, route, groupStore }: ContainerProp) => {
  const willFocus = () => groupStore.getGroupInfo(route.params.groupId);
  const willLeave = () => groupStore.setCurrentGroupInfoAction(undefined);

  useEffect(() => navigation.addListener('focus', willFocus), [navigation]);
  useEffect(() => navigation.addListener('blur', () => willLeave()), [navigation]);

  return GroupInfoComponent({
    groupInfo: groupStore.currentGroupInfo,
    onJoinGroup: async () => {
      await groupStore.joinGroup(),
      navigation.navigate('TopicsList', {
        groupId: groupStore.currentGroupInfo.id,
        groupName: groupStore.currentGroupInfo.name
      });
    },
    onLeaveGroup: async () => {
      await groupStore.leaveGroup(groupStore.currentGroupInfo?.id ?? '');
      navigation.navigate('GroupList');
    },
  });
};const GroupInfoContainer: React.FC<{ navigation: Navigation, route: GroupInfoScreenRouteProp }> = ({ navigation, route }) => (
  <GroupInfoContainerObserver navigation={navigation} route={route} groupStore={groupStoreInstance} />
);
export default GroupInfoContainer;
