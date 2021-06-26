import * as server from '../lib/server';
import * as _ from 'lodash';

export class GroupSearchStore {

  constructor(
    public groups: unknown[],
  ) {}

  public async findGroups(searchText) {
    const findGroups = () => server.findGroups({ 
      searchText, 
      limit: 20, 
      startingId: '',
    });
    this.groups = _.isEmpty(searchText) ? [] : await findGroups();
  }

}
