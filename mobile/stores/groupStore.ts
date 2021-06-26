import _ from 'lodash';
import * as server from '../lib/server';
import { groupVisibility } from '../constants/domainConstants';

interface FeGroupInfo extends server.GroupInfo {
  visibilityLabel: string;
}

export class GroupStore {
  ownGroups: server.Group[] = [];
  currentGroupInfo: FeGroupInfo = null;

  constructor() {}

  async getGroupInfo(groupId)  {
    const groupInfo = await server.getGroupInfo(groupId);
    const groupVisibilityLocal = _.find(groupVisibility, { value: groupInfo.visibility });
    this.currentGroupInfo = {
      ...groupInfo,
      visibilityLabel: groupVisibilityLocal.label,
    };
  }
  
  async leaveGroup(groupId, onLeave) {
    await server.leaveGroup(groupId);
    onLeave();
    await this.fetchOwnGroups();
  }
  
  async joinGroup(groupId, onJoin)  {
    await server.joinGroup(groupId);
    onJoin(this.currentGroupInfo.name);
  }
  
  async setGroupPin({ groupId, pinned }) {
    await server.setGroupPin({ groupId, pinned });
    await this.fetchOwnGroups();
  }
  
  async fetchOwnGroups() {
    this.ownGroups = await server.getOwnGroups();
  }

}
