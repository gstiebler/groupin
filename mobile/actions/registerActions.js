import * as server from '../lib/server';
import { baseAuth } from './loginActions';

export const register = (navigation) => async (dispatch, getState) => {
  const {name, username, password} = getState().register;
  const { token, id, errorMessage } = await server.register({name, userName: username, password});
  baseAuth({ dispatch, getState, navigation, token, id, errorMessage });
}
