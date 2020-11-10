const { 
  GROUPS_SEARCH_ITEMS,
} = require("../constants/action-types");
const { mutationHelper, reducerMain } = require('../lib/helpers');

const initialState = {
  groups: [],
};

const reducerFunctions = {
  [GROUPS_SEARCH_ITEMS]: mutationHelper('groups'),
  // TODO: merge groups option
};

module.exports = reducerMain(initialState, reducerFunctions);