import * as _ from 'lodash';
import * as server from '../lib/server';
import { 
  CURRENT_GROUP_INFO,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import { groupVisibility } from '../constants/domainConstants';

export const getGroupInfo = (groupId) => async (dispatch) => {
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

export const leaveGroup = (groupId, onLeave) => async (dispatch/*, getState*/) => {
  await server.leaveGroup(groupId);
  onLeave();
  await fetchOwnGroups(dispatch);
}

export const joinGroup = (groupId, onJoin) => async (dispatch, getState) => {
  await server.joinGroup(groupId);
  onJoin(getState().base.currentGroupInfo.name);
}

export const setGroupPin = ({ groupId, pinned }) => async (dispatch/*, getState */) => {
  await server.setGroupPin({ groupId, pinned });
  await fetchOwnGroups(dispatch);
}
