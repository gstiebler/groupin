// TODO: remove include of React stuff
import { Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import { 
  USER_ID,
  FB_CONFIRM_RESULT,
  LOGIN_PHONE_NUMBER,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';
const graphqlConnect = require('../lib/graphqlConnect');
import { getAndUpdateFcmToken } from '../lib/fcm';

const updateFbUserToken = fbUserToken => graphqlConnect.setToken(fbUserToken);

export const login = (navigation, phoneNumber) => async (dispatch) => {
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
    const firebaseUser = auth().currentUser;
    // check if user is already logged in
    if (firebaseUser) {
      const fbUserToken = await firebaseUser.getIdToken(true);  
      updateFbUserToken(fbUserToken);
      const userId = (await server.getUserId()).id;
      if (!userId) {
        throw new Error('Error getting user ID');
      }
      await userLoggedIn({ dispatch, navigate, userId });
    }

    auth().onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const fbUserToken = await fbUser.getIdToken(true);
        updateFbUserToken(fbUserToken);
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
  const fbUserToken = await fbUser.getIdToken(true);  
  console.log(`Confirmation code, token: ${fbUserToken}`);

  updateFbUserToken(fbUserToken);
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
  navigate('TabNavigator');
}
 
export const logout = (navigation) => async (dispatch/*, getState */) => {
  try {
    dispatch({ type: USER_ID, payload: { userId: '' } });
    await auth().signOut();
    navigation.navigate('Login');
  } catch (error) {
    console.error(error);
  }
}
