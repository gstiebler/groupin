// TODO: remove include of React stuff
import { Alert } from 'react-native';

import firebase from 'react-native-firebase';
import { 
  USER_ID,
  FB_CONFIRM_RESULT,
  LOGIN_PHONE_NUMBER,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';
import { updateFbUserToken } from './rootActions';

export const login = (navigation, phoneNumber) => async (dispatch, getState) => {
  dispatch({ type: LOGIN_PHONE_NUMBER, payload: { phoneNumber } });
  try {
    const confirmResult = await firebase.auth().signInWithPhoneNumber(phoneNumber);
    dispatch({ type: FB_CONFIRM_RESULT, payload: { confirmResult } });
    navigation.navigate('Register');
  } catch(error) {
    //TODO: handle wrong code
    const msgByCode = {
      'auth/captcha-check-failed': 'Falha no Captcha',
      'auth/invalid-phone-number': 'Número de telefone inválido',
      'auth/quota-exceeded': 'Quota de SMS excedida',
      'auth/user-disabled': 'Usuário desabilitado',
      'auth/operation-not-allowed': 'Operação não permitida',
    };
    const errorMessage = msgByCode[error.code] || 'Erro';
    Alert.alert(
      'Erro',
      errorMessage,
      [
        {text: 'OK'},
      ],
      {cancelable: false},
    );
  }
}

export const willFocus = (navigation) => async (dispatch, getState) => {
  try {
    const firebaseUser = firebase.auth().currentUser;
    // check if user is already logged in
    if (firebaseUser) {
      const fbUser = firebase.auth().currentUser;
      const fbToken = await fbUser.getIdToken(true);  
      await updateFbUserToken(dispatch, fbToken);
      const userId = (await server.getUserId()).id;
      userLoggedIn({ dispatch, navigation, userId });
    }

    firebase.auth().onAuthStateChanged(async function(fbUser) {
      if (fbUser) {
        const fbToken = await fbUser.getIdToken(true);
        await updateFbUserToken(dispatch, fbToken);
      } else {
        console.log('no user yet');
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export async function userLoggedIn({ dispatch, navigation, userId }) {
  dispatch({ type: USER_ID, payload: { userId } });
  await fetchOwnGroups(dispatch);
  navigation.navigate('GroupList');
}
 
export const logout = (navigation) => async (dispatch, getState) => {
  try {
    await firebase.auth().signOut();
    navigation.navigate('Login');
  } catch (error) {
    console.log(error);
  }
}
