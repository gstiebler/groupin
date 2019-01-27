import { 
  SET_TOKEN,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';

export const login = (navigation) => async (dispatch, getState) => {
  const { username, password } = getState().login;
  const token = await server.login({ userName: username, password });
  dispatch({ type: SET_TOKEN, payload: { token } });
  await fetchOwnGroups(dispatch);
  navigation.navigate('GroupList');
}
