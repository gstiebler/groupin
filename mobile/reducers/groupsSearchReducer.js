const { 
  GROUPS_SEARCH_TEXT,
  GROUPS_SEARCH_ITEMS,
} = require("../constants/action-types");
const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  searchText: '',
  groups: [],
};

const reducerFunctions = {
  [GROUPS_SEARCH_TEXT]: mutationHelper('searchText'),
  [GROUPS_SEARCH_ITEMS]: mutationHelper('groups'),
  // TODO: merge groups option
};

module.exports.default = reducerMain(initialState, reducerFunctions);
