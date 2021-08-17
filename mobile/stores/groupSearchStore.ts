import * as server from '../lib/server';
import * as _ from 'lodash';
import { Group } from '../lib/server';

export class GroupSearchStore {
  groups: Group[] = [];

  setGroupsAction = (groups: Group[]) => { this.groups = groups; };

  async findGroups(searchText: string) {
    const findGroups = () => server.findGroups({ 
      searchText, 
      limit: 20, 
      skip: 0,
    });
    this.setGroupsAction(_.isEmpty(searchText) ? [] : await findGroups());
  }

  reset() {
    this.setGroupsAction([]);
  }

}
