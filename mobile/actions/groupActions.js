const server = require('../lib/server');
const { 
  CURRENT_GROUP_INFO,
} = require("../constants/action-types");

const getGroupInfo = (groupId) => async (dispatch) => {
  const groupInfo = await server.getGroupInfo(groupId);
  dispatch({ type: CURRENT_GROUP_INFO, payload: { currentGroupInfo: groupInfo } });
}

module.exports = {
  getGroupInfo
};
