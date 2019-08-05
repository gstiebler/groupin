import { 
  USER_ID,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';
// TODO: remove include of React stuff
import { Toast } from 'native-base';
import { setToken } from '../lib/graphqlConnect';
import firebase from 'react-native-firebase';

async function initLogin(dispatch, getState, navigation, idToken) {      
  setToken(idToken);
  const userId = await server.updateFcmToken(getState().base.fcmToken);
  dispatch({ type: USER_ID, payload: { userId } });
  await fetchOwnGroups(dispatch);
  navigation.navigate('GroupList');
}

export const login = (navigation) => async (dispatch, getState) => {
  const { username, password } = getState().login;
  await firebase
     .auth()
     .signInWithEmailAndPassword(username, password);
  const userId = await server.updateFcmToken(getState().base.fcmToken);
  await baseAuth({ dispatch, getState, navigation, userId });
}

export const willFocus = (navigation) => async (dispatch, getState) => {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      initLogin(dispatch, getState, navigation, idToken);
    }

    firebase.auth().onAuthStateChanged(async function(fbUser) {
      if (fbUser) {
        const idToken = await fbUser.getIdToken(true);
        setToken(idToken);
      } else {
        console.log('no user yet');
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export async function baseAuth({ dispatch, getState, navigation, userId, errorMessage }) {
  if (errorMessage) {
    Toast.show({
      text: errorMessage,
      buttonText: 'Ok'
    });
  } else {
    dispatch({ type: USER_ID, payload: { userId } });
    const user = firebase.auth().currentUser;
    const idToken = await user.getIdToken(true);
    await initLogin(dispatch, getState, navigation, idToken);
  }
}
