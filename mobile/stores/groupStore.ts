import * as _ from 'lodash';
import * as server from '../lib/server';
import { groupVisibility, NUM_ITEMS_PER_FETCH } from '../constants/domainConstants';

export interface FeGroupInfo extends server.GroupInfo {
  visibilityLabel: string;
}

export type Topic = {
  id: string;
  name: string;
  pinned: boolean;
  unread: boolean
};

export class GroupStore {
  ownGroups: server.Group[] = [];
  currentGroupInfo?: FeGroupInfo = undefined;
  currentlyViewedGroupId? = '';
  topics: Topic[] = []; // TODO: change name to `topicsOfGroup`

  setOwnGroupsAction = (ownGroups: server.Group[]) => { this.ownGroups = ownGroups; };
  setCurrentGroupInfoAction = (currentGroupInfo?: FeGroupInfo) => { this.currentGroupInfo = currentGroupInfo; };
  setCurrentViewedGroupId = (topicId?: string) => { this.currentlyViewedGroupId = topicId; }
  setTopicsAction = (topics: Topic[]) => { this.topics = topics; };

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
  
  async leaveGroupScreen() {
    this.setCurrentViewedGroupId(undefined);
    this.setTopicsAction([]);
    await this.fetchOwnGroups();
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

  async getTopicsOfGroup(groupId: string): Promise<void> {
    this.setTopicsAction(await server.getTopicsOfGroup(groupId, NUM_ITEMS_PER_FETCH));
  }

  async getTopicsOfCurrentGroup(): Promise<void> {
    if (!this.currentlyViewedGroupId) { return }
    await this.getTopicsOfGroup(this.currentlyViewedGroupId);
  }

  async setCurrentlyViewedGroup(groupId: string) {
    this.setCurrentViewedGroupId(groupId);
    await this.getTopicsOfGroup(groupId);
  }

  async setTopicPin(params: { topicId: string, pinned: boolean }) {
    const { topicId, pinned } = params;
    await server.setTopicPin({ topicId, pinned });
    if (!this.currentlyViewedGroupId) { return }
    await this.getTopicsOfGroup(this.currentlyViewedGroupId);
  }

}
