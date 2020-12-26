const server = require('../lib/server');
const _ = require('lodash');

class GroupSearch {

  constructor() {
    this.groups = [];
  }

  async findGroups(searchText) {
    const findGroups = () => server.findGroups({ 
      searchText, 
      limit: 20, 
      startingId: '',
    });
    this.groups = _.isEmpty(searchText) ? [] : await findGroups();
  }

}

module.exports = GroupSearch;
