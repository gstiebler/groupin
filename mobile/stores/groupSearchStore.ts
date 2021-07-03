import * as server from '../lib/server';
import * as _ from 'lodash';
import { Group } from '../lib/server';

export class GroupSearchStore {
  public groups: Group[];

  constructor() {}

  public async findGroups(searchText: string) {
    const findGroups = () => server.findGroups({ 
      searchText, 
      limit: 20, 
      startingId: '',
    });
    this.groups = _.isEmpty(searchText) ? [] : await findGroups();
  }

  public reset() {
    this.groups = [];
  }

}
