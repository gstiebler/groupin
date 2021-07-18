import _ from 'lodash';
import * as server from '../lib/server';
import { groupVisibility } from '../constants/domainConstants';
import { Navigation } from '../types/Navigator.types';

export interface FeGroupInfo extends server.GroupInfo {
  visibilityLabel: string;
}

export class GroupStore {
  ownGroups: server.Group[] = [];
  currentGroupInfo: FeGroupInfo = null;

  async getGroupInfo(groupId: string)  {
    const groupInfo = await server.getGroupInfo(groupId);
    const groupVisibilityLocal = _.find(groupVisibility, { value: groupInfo.visibility });
    this.currentGroupInfo = {
      ...groupInfo,
      visibilityLabel: groupVisibilityLocal.label,
    };
  }
  
  async leaveGroup(groupId: string, navigation: Navigation) {
    await server.leaveGroup(groupId);
    navigation.navigate('GroupList');
    await this.fetchOwnGroups();
  }
  
  async joinGroup(navigation: Navigation)  {
    await server.joinGroup(this.currentGroupInfo._id);
    navigation.navigate('TopicsList', {
      groupId: this.currentGroupInfo._id,
      groupName: this.currentGroupInfo.name
    });
  }
  
  async setGroupPin(params: { groupId: string, pinned: boolean }) {
    const { groupId, pinned } = params;
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
