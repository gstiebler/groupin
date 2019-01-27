import { 
  GROUPS_SEARCH_TEXT,
  GROUPS_SEARCH_ITEMS,
} from "../constants/action-types";
import * as server from '../lib/server';

export const findGroups = async (dispatch, searchText) => {
  dispatch({ type: GROUPS_SEARCH_TEXT, payload: { searchText } });
  const groups = await server.findGroups({ 
    searchText, 
    limit: 20, 
    startingId: '',
  });
  dispatch({ type: GROUPS_SEARCH_ITEMS, payload: { groups } });
}

export const joinGroup = async (dispatch, navigation, groupId) => {
  await server.joinGroup(groupId);
  navigation.navigate('GroupList');
}
