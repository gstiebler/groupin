// TODO: remove include of React stuff
import { Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import { 
  USER_ID,
  FB_CONFIRM_RESULT,
  FB_USER_TOKEN,
  LOGIN_PHONE_NUMBER,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';
const graphqlConnect = require('../lib/graphqlConnect');
import localStorage from '../lib/localStorage';
import _ from 'lodash';
import { getAndUpdateFcmToken } from '../lib/fcm';

const FIREBASE_USER_TOKEN_LS_KEY = 'firebaseUserToken';

const updateFbUserToken = async (dispatch, fbUserToken) => {
  await localStorage.setItem(FIREBASE_USER_TOKEN_LS_KEY, fbUserToken);
  graphqlConnect.setToken(fbUserToken);
  dispatch({ type: FB_USER_TOKEN, payload: { fbUserToken } });
}

export const login = (navigation, phoneNumber) => async (dispatch/*, getState*/) => {
  dispatch({ type: LOGIN_PHONE_NUMBER, payload: { phoneNumber } });
  try {
    const confirmResult = await auth().signInWithPhoneNumber(phoneNumber);
    dispatch({ type: FB_CONFIRM_RESULT, payload: { confirmResult } });
    navigation.navigate('ConfirmationCode');
  } catch(error) {
    const msgByCode = {
      'auth/captcha-check-failed': 'Falha no Captcha',
      'auth/invalid-phone-number': 'Número de telefone inválido',
      'auth/quota-exceeded': 'Quota de SMS excedida',
      'auth/user-disabled': 'Usuário desabilitado',
      'auth/operation-not-allowed': 'Operação não permitida',
    };
    const errorMessage = msgByCode[error.code] || 'Erro';
    console.error(error);
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

export const init = async (navigate, dispatch) => {
  try {
    const localFbUserToken = await localStorage.getItem(FIREBASE_USER_TOKEN_LS_KEY);
    const firebaseUser = auth().currentUser;
    // check if user is already logged in
    if (!_.isEmpty(localFbUserToken) && firebaseUser) {
      const fbToken = await firebaseUser.getIdToken(true);  
      await updateFbUserToken(dispatch, fbToken);
      const userId = (await server.getUserId()).id;
      if (!userId) {
        throw new Error('Error getting user ID');
      }
      await userLoggedIn({ dispatch, navigate, userId });
    }

    auth().onAuthStateChanged(async (fbUser) => {
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

export const confirmationCodeReceived = ({ navigation, confirmationCode }) => async (dispatch, getState) => {
  const { confirmResult } = getState().login;
  try {
    await confirmResult.confirm(confirmationCode);
  } catch (error) {
    const msgByCode = {
      'auth/invalid-verification-code': 'Código de verificação inválido',
      'auth/missing-verification-code': 'Código de verificação vazio',
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
    console.error(error);
    throw new Error(error);
  }

  // const fcmToken = await firebase.messaging().getToken();
  const fbUser = auth().currentUser;
  const fbToken = await fbUser.getIdToken(true);  
  console.log(`Confirmation code, token: ${fbToken}`);

  await updateFbUserToken(dispatch, fbToken);
  const userId = (await server.getUserId()).id;
  if (userId === 'NO USER') {
    navigation.navigate('Register');
  } else {
    await userLoggedIn({ 
      dispatch, 
      navigate: (route) => navigation.navigate(route), 
      userId,
    });
  }
}

export async function userLoggedIn({ dispatch, navigate, userId }) {
  dispatch({ type: USER_ID, payload: { userId } });
  await getAndUpdateFcmToken();
  await fetchOwnGroups(dispatch);
  navigate('GroupList');
}
 
export const logout = (navigation) => async (dispatch/*, getState */) => {
  try {
    await localStorage.setItem(FIREBASE_USER_TOKEN_LS_KEY, '');
    dispatch({ type: USER_ID, payload: { userId: '' } });
    await auth().signOut();
    navigation.navigate('Login');
  } catch (error) {
    console.log(error);
  }
}
