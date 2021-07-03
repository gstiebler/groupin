import _ from 'lodash';
import * as server from '../lib/server';
import { groupVisibility } from '../constants/domainConstants';
import { GroupInfoScreenNavigationProp } from '../components/GroupInfo';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../components/Navigator';

export interface FeGroupInfo extends server.GroupInfo {
  visibilityLabel: string;
}

export class GroupStore {
  ownGroups: server.Group[] = [];
  currentGroupInfo: FeGroupInfo = null;

  constructor() {}

  async getGroupInfo(groupId: string)  {
    const groupInfo = await server.getGroupInfo(groupId);
    const groupVisibilityLocal = _.find(groupVisibility, { value: groupInfo.visibility });
    this.currentGroupInfo = {
      ...groupInfo,
      visibilityLabel: groupVisibilityLocal.label,
    };
  }
  
  async leaveGroup(groupId: string, navigation: StackNavigationProp<RootStackParamList>) {
    await server.leaveGroup(groupId);
    navigation.navigate('GroupList');
    await this.fetchOwnGroups();
  }
  
  async joinGroup(navigation: GroupInfoScreenNavigationProp)  {
    await server.joinGroup(this.currentGroupInfo._id);
    navigation.navigate('TopicsList', {
      groupId: this.currentGroupInfo._id,
      groupName: this.currentGroupInfo.name
    });
  }
  
  async setGroupPin({ groupId, pinned }) {
    await server.setGroupPin({ groupId, pinned });
    await this.fetchOwnGroups();
  }
  
  async fetchOwnGroups() {
    this.ownGroups = await server.getOwnGroups();
  }

  setCurrentGroupInfo(currentGroupInfo: FeGroupInfo) {
    this.currentGroupInfo = currentGroupInfo;
  }

}
