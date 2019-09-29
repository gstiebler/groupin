import firebase from 'react-native-firebase';
import * as server from '../lib/server';
import { userLoggedIn } from './loginActions';
import { Alert } from 'react-native';
import { updateFbUserToken } from './rootActions';

export const register = ({navigation, name, verificationCode}) => async (dispatch, getState) => {
  const { phoneNumber, confirmResult } = getState().login;
  try {
    await confirmResult.confirm(verificationCode);
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

  try {
    // const fcmToken = await firebase.messaging().getToken();
    const fbUser = firebase.auth().currentUser;
    const fbToken = await fbUser.getIdToken(true);  

    await updateFbUserToken(dispatch, fbToken);
    const userId = (await server.getUserId()).id;
    if (userId === 'NO USER') {
      const { errorMessage } = await server.register({
        name, 
        phoneNumber,
      });
      if (errorMessage) {
        Alert.alert(
          'Erro',
          errorMessage,
          [
            {text: 'OK'},
          ],
          {cancelable: false},
        );
        console.error(error.message);
        throw new Error(errorMessage);
      }
    }
    await userLoggedIn({ dispatch, navigation, userId });
  } catch (error) {
    console.error(error);
  }
}
