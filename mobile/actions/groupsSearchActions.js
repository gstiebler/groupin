const { 
  GROUPS_SEARCH_TEXT,
  GROUPS_SEARCH_ITEMS,
} = require("../constants/action-types");
const server = require('../lib/server');

const findGroups = async (dispatch, searchText) => {
  dispatch({ type: GROUPS_SEARCH_TEXT, payload: { searchText } });
  const groups = await server.findGroups({ 
    searchText, 
    limit: 20, 
    startingId: '',
  });
  dispatch({ type: GROUPS_SEARCH_ITEMS, payload: { groups } });
}

const joinGroup = async (dispatch, navigation, groupId) => {
  await server.joinGroup(groupId);
  navigation.navigate('GroupList');
}

module.exports = {
  findGroups,
  joinGroup,
};
