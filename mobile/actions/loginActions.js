import { 
  SET_TOKEN,
} from "../constants/action-types";
import * as server from '../lib/server';

export const login = (navigation) => async (dispatch, getState) => {
  const { username, password } = getState().login;
  const token = await server.login({ name, userName: username, password });
  dispatch({ type: SET_TOKEN, payload: { token } });
  navigation.navigate('GroupList');
}
