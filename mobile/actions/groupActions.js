const _ = require('lodash');
const server = require('../lib/server');
const { 
  CURRENT_GROUP_INFO,
} = require("../constants/action-types");
const { fetchOwnGroups } = require('./rootActions');
const { groupVisibility } = require('../constants/domainConstants');

const getGroupInfo = (groupId) => async (dispatch) => {
  const groupInfo = await server.getGroupInfo(groupId);
  const visibilityLabel = _.find(groupVisibility, { value: groupInfo.visibility }).label;
  dispatch({ 
    type: CURRENT_GROUP_INFO, 
    payload: { 
      currentGroupInfo: {
        ...groupInfo, 
        visibilityLabel,
      }
    }
  });
}

const leaveGroup = (groupId, onLeave) => async (dispatch/*, getState*/) => {
  await server.leaveGroup(groupId);
  onLeave();
  await fetchOwnGroups(dispatch);
}

const joinGroup = (groupId, onJoin) => async (dispatch, getState) => {
  await server.joinGroup(groupId);
  onJoin(getState().base.currentGroupInfo.name);
}

const setGroupPin = ({ groupId, pinned }) => async (dispatch/*, getState */) => {
  await server.setGroupPin({ groupId, pinned });
  await fetchOwnGroups(dispatch);
}

module.exports = {
  getGroupInfo,
  leaveGroup,
  joinGroup,
  setGroupPin,
};
