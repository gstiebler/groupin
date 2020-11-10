const { 
  GROUPS_SEARCH_ITEMS,
} = require("../constants/action-types");
const server = require('../lib/server');
const _ = require('lodash');

const findGroups = (searchText) => async (dispatch/* , getState */) => {
  const findGroups = () => server.findGroups({ 
    searchText, 
    limit: 20, 
    startingId: '',
  });
  const groups = _.isEmpty(searchText) ? [] : await findGroups();
  dispatch({ type: GROUPS_SEARCH_ITEMS, payload: { groups } });
}

module.exports = {
  findGroups,
};
