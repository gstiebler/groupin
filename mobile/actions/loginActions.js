import { 
  SET_TOKEN,
  USER_ID,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';
// TODO: remove include of React stuff
import { Toast } from 'native-base';
import { getToken, setToken } from '../lib/auth';

export const login = (navigation) => async (dispatch, getState) => {
  const { username, password } = getState().login;
  const { token, id, errorMessage } = await server.login({ userName: username, password });
  baseAuth({ dispatch, getState, navigation, token, id, errorMessage });
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

export async function baseAuth({ dispatch, getState, navigation, token, id, errorMessage }) {
  if (errorMessage) {
    Toast.show({
      text: errorMessage,
      buttonText: 'Ok'
    });
  } else {
    dispatch({ type: SET_TOKEN, payload: { token } });
    dispatch({ type: USER_ID, payload: { userId: id } });
    await setToken(token);
    server.updateFcmToken(getState().base.fcmToken);
    await fetchOwnGroups(dispatch);
    navigation.navigate('GroupList');
  }
}
