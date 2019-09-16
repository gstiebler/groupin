const server = require('../lib/server');
const { 
  CURRENT_GROUP_INFO,
} = require("../constants/action-types");
const { fetchOwnGroups } = require('./rootActions');

const getGroupInfo = (groupId) => async (dispatch) => {
  const groupInfo = await server.getGroupInfo(groupId);
  dispatch({ type: CURRENT_GROUP_INFO, payload: { currentGroupInfo: groupInfo } });
}

const leaveGroup = (groupId, onLeave) => async (dispatch, getState) => {
  await server.leaveGroup(groupId);
  onLeave();
  await fetchOwnGroups(dispatch);
}

const joinGroup = (groupId, onJoin) => async (dispatch, getState) => {
  await server.joinGroup(groupId);
  onJoin(getState().base.groupInfo.name);
}

module.exports = {
  getGroupInfo,
  leaveGroup,
  joinGroup,
};
