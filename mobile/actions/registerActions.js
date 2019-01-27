import { 
  SET_TOKEN,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';

export const register = (navigation) => async (dispatch, getState) => {
  const {name, username, password} = getState().register;
  const token = await server.register({name, userName: username, password});
  dispatch({ type: SET_TOKEN, payload: { token } });
  await fetchOwnGroups(dispatch);
  navigation.navigate('GroupList');
}
