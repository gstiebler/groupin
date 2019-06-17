import firebase from 'react-native-firebase';
import * as server from '../lib/server';
import { baseAuth } from './loginActions';

export const register = (navigation) => async (dispatch, getState) => {
  const {name, username, password} = getState().register;
  try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(username, password);

    const user = firebase.auth().currentUser;
    // TODO: store `user.uid`
    await user.sendEmailVerification();
    const { errorMessage } = await server.register({name, userName: username, password});
    baseAuth({ dispatch, getState, navigation, uid: user.uid, errorMessage });
  } catch (error) {
    console.error(error.message);
  }
}
