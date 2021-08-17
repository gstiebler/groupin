import * as _ from 'lodash';
import * as server from '../lib/server';
import { groupVisibility } from '../constants/domainConstants';

export interface FeGroupInfo extends server.GroupInfo {
  visibilityLabel: string;
}

export class GroupStore {
  ownGroups: server.Group[] = [];
  currentGroupInfo?: FeGroupInfo = undefined;

  setOwnGroupsAction = (ownGroups: server.Group[]) => { this.ownGroups = ownGroups; };
  setCurrentGroupInfoAction = (currentGroupInfo?: FeGroupInfo) => { this.currentGroupInfo = currentGroupInfo; };

  async getGroupInfo(groupId: string)  {
    const groupInfo = await server.getGroupInfo(groupId);
    const groupVisibilityLocal = _.find(groupVisibility, { value: groupInfo.visibility });
    if (!groupVisibilityLocal) {
      throw new Error('Should have group visibility here');
    }
    this.setCurrentGroupInfoAction({
      ...groupInfo,
      visibilityLabel: groupVisibilityLocal.label,
    });
  }
  
  async leaveGroup(groupId: string) {
    await server.leaveGroup(groupId);
    await this.fetchOwnGroups();
  }
  
  async joinGroup()  {
    if (!this.currentGroupInfo) {
      throw new Error('Group info expected here');
    }
    await server.joinGroup(this.currentGroupInfo.id);
  }
  
  async setGroupPin(params: { groupId: string, pinned: boolean }) {
    const { groupId, pinned } = params;
    await server.setGroupPin({ groupId, pinned });
    await this.fetchOwnGroups();
  }
  
  async fetchOwnGroups() {
    this.setOwnGroupsAction(await server.getOwnGroups());
  }

}
