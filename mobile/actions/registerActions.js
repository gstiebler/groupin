import firebase from 'react-native-firebase';
import * as server from '../lib/server';
import { baseAuth } from './loginActions';
import { Alert } from 'react-native';

export const register = (navigation) => async (dispatch, getState) => {
  const {name, username, password} = getState().register;
  try {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(username, password);
    } catch (error) {
      const msgByCode = {
        'auth/email-already-in-use': 'Usuário já registrado',
        'auth/invalid-email': 'E-mail inválido',
        'auth/weak-password': 'Senha fraca. Por favor, escolha uma senha mais complexa.',
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

    const user = firebase.auth().currentUser;
    // await user.sendEmailVerification();
    const { errorMessage } = await server.register({
      name, 
      userName: username, 
      password, 
      uid: user.uid,
    });
    baseAuth({ dispatch, getState, navigation, uid: user.uid, errorMessage });
  } catch (error) {
    console.error(error.message);
  }
}
