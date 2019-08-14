import { 
  USER_ID,
  FB_CONFIRM_RESULT,
} from "../constants/action-types";
import { fetchOwnGroups } from './rootActions';
import * as server from '../lib/server';
// TODO: remove include of React stuff
import { Alert } from 'react-native';
import * as graphqlConnect from '../lib/graphqlConnect';
import firebase from 'react-native-firebase';

export const login = (navigation) => async (dispatch, getState) => {
  const { phoneNumber } = getState().login;
  try {
    const confirmResult = await firebase.auth().signInWithPhoneNumber(phoneNumber);
    dispatch({ type: FB_CONFIRM_RESULT, payload: { confirmResult } });
    navigation.navigate('Register');
  } catch(error) {
    //TODO: handle wrong code
    const msgByCode = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/invalid-email': 'E-mail inválido',
      'auth/wrong-password': 'Senha inválida',
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
      graphqlConnect.setToken(fbToken);
      const userId = (await server.getUserId()).id;
      userLoggedIn({ dispatch, navigation, userId });
    }

    firebase.auth().onAuthStateChanged(async function(fbUser) {
      if (fbUser) {
        const fbToken = await fbUser.getIdToken(true);
        graphqlConnect.setToken(fbToken);
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
