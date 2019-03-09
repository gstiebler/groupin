import { 
  SET_TOKEN,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';
// TODO: remove include of React stuff
import { Toast } from 'native-base';
import { getToken, setToken } from '../lib/auth';

export const login = (navigation) => async (dispatch, getState) => {
  const { username, password } = getState().login;
  const result = await server.login({ userName: username, password });
  if (result.errorMessage) {
    Toast.show({
      text: result.errorMessage,
      buttonText: 'Ok'
    });
  } else {
    dispatch({ type: SET_TOKEN, payload: { token: result.token } });
    await setToken(result.token);
    await fetchOwnGroups(dispatch);
    navigation.navigate('GroupList');
  }
}

export const willFocus = (navigation) => async (dispatch, getState) => {
  try {
    const token = await getToken();
    if (token !== null) {
      await fetchOwnGroups(dispatch);
      dispatch({ type: SET_TOKEN, payload: { token } });
      navigation.navigate('GroupList');
    }
  } catch (error) {
    console.error(error);
  }
}
