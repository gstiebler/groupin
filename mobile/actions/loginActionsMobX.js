// TODO: remove include of React stuff
import { Alert } from 'react-native';

import auth from '@react-native-firebase/auth';
import * as server from '../lib/server';
const graphqlConnect = require('../lib/graphqlConnect');
import { getAndUpdateFcmToken } from '../lib/fcm';

const updateFbUserToken = fbUserToken => graphqlConnect.setToken(fbUserToken);

class LoginActions {

  constructor(rootActions) {
    this.rootActions = rootActions;
    this.phoneNumber = '';
    this.confirmResult = null;
  }

  async login(navigation, phoneNumber) {
    this.phoneNumber = phoneNumber;
    try {
      this.confirmResult = await auth().signInWithPhoneNumber(phoneNumber);
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

  async init(navigate) {
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
        await this.userLoggedIn({ navigate, userId });
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

  async confirmationCodeReceived({ navigation, confirmationCode }) {
    try {
      await this.confirmResult.confirm(confirmationCode);
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
      await this.userLoggedIn({  
        navigate: (route) => navigation.navigate(route), 
        userId,
      });
    }
  }

  async userLoggedIn({ navigate, userId }) {
    this.rootActions.setUserId(userId);
    await getAndUpdateFcmToken();
    await this.rootActions.fetchOwnGroups();
    navigate('TabNavigator');
  }
  
  async logout(navigation) {
    try {
      this.rootActions.setUserId('');
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  }

  async register({navigation, name}) {
    try {
      const { errorMessage, id } = await server.register({
        name, 
        phoneNumber: this.phoneNumber,
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
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      await this.userLoggedIn({
        navigate: (route) => navigation.navigate(route), 
        userId: id,
      });
    } catch (error) {
      console.error(error);
    }
  }

}

module.exports = LoginActions;
