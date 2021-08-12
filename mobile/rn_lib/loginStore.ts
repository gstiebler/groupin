import * as server from '../lib/server';
import graphqlConnect from '../lib/graphqlConnect';
import { Navigation } from './Navigator.types';
import { RootStore } from '../stores/rootStore';
import { notifications } from './notifications';
import { AlertStatic } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';

const updateFbUserToken = (fbUserToken: string) => graphqlConnect.setToken(fbUserToken);

export class LoginStore {
  navigation: Navigation;
  message?: { text: string, color: string };
  verificationId: string;
  firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;

  constructor(
    private rootStore: RootStore,
    private Alert: AlertStatic,
  ) { }

  setMessage(message: { text: string, color: string }) { this.message = message }

  async init(navigation: Navigation) {
    this.navigation = navigation;
    const noConfigMessage = {
      text: 'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
      color: 'green'
    };
    this.message = !this.firebaseConfig ? noConfigMessage : undefined;
  }

  async onSendVerificationCode(phoneNumber: string, applicationVerifier: firebase.auth.ApplicationVerifier) {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      this.verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        applicationVerifier
      );
      this.message = { text: 'Verification code has been sent to your phone.', color: 'green' };
    } catch (err) {
      this.message = { text: `Error: ${err.message}`, color: 'red' };
    }
  }

  async onConfirmVerificationCode(verificationCode: string) {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        verificationCode
      );
      const userCredential = await firebase.auth().signInWithCredential(credential);
      const firebaseUser = userCredential.user;
      if (!firebaseUser) {
        throw new Error('Firebase user not found');
      }
      const fbUserToken = await firebaseUser.getIdToken(true);
      this.message = { text: 'Phone authentication successful 👍', color: 'green' };
      await this.confirmationCodeReceived(fbUserToken);
    } catch(err) {
      this.message = { text: `Error: ${err.message}`, color: 'red' };
    }
  }

  async confirmationCodeReceived(fbUserToken: string) {
    updateFbUserToken(fbUserToken);
    const userId = await server.getUserId();
    if (userId === 'NO USER') {
      this.registerNewUser();
    } else {
      this.loginRegisteredUser(userId);
    }
  }

  loginRegisteredUser(userId: string) {
    this.rootStore.setUserId(userId);
    this.rootStore.updateNotificationToken(notifications.notificationToken);
    this.navigation.navigate('TabNavigator');
  }

  registerNewUser() {
    this.navigation.navigate('Register');
  }

  async register(name: string) {
    try {
      const { errorMessage, id: userId } = await server.register(name);
      if (errorMessage) {
        this.Alert.alert(
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
      this.loginRegisteredUser(userId);
    } catch (error) {
      console.error(error);
    }
  }

  async logout() {
    try {
      this.rootStore.setUserId('');
      this.navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  }
}
