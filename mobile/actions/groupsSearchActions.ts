import { 
  GROUPS_SEARCH_ITEMS,
} from "../constants/action-types";
import * as server from '../lib/server';
import * as _ from 'lodash';

export const findGroups = (searchText) => async (dispatch/* , getState */) => {
  const findGroups = () => server.findGroups({ 
    searchText, 
    limit: 20, 
    startingId: '',
  });
  const groups = _.isEmpty(searchText) ? [] : await findGroups();
  dispatch({ type: GROUPS_SEARCH_ITEMS, payload: { groups } });
}
