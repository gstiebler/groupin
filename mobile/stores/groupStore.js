const _ = require('lodash');
const server = require('../lib/server');
const { groupVisibility } = require('../constants/domainConstants');

class GroupStore {

  constructor() {
    this.ownGroups = [];
    this.currentGroupInfo = {};
  }

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

module.exports = GroupStore;
