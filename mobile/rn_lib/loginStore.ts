import * as server from '../lib/server';
import graphqlConnect from '../lib/graphqlConnect';
import { Navigation } from './Navigator.types';
import { RootStore } from '../stores/rootStore';
import { AlertStatic } from 'react-native';
import firebase from 'firebase/app';

const updateFbUserToken = (fbUserToken: string) => graphqlConnect.setToken(fbUserToken);

export class LoginStore {
  navigation: Navigation;
  message?: { text: string, color: string };
  verificationId: string;
  firebaseConfig: unknown;
  firebaseApp: firebase.app.App;
  notificationToken: string;

  constructor(
    private rootStore: RootStore,
    private Alert: AlertStatic,
  ) { }

  setMessage(message: { text: string, color: string }) { this.message = message }

  async init(navigation: Navigation, firebaseApp: firebase.app.App, notificationToken: string) {
    this.navigation = navigation;
    this.firebaseApp = firebaseApp;
    this.notificationToken = notificationToken;
    const noConfigMessage = {
      text: 'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
      color: 'green'
    };
    this.firebaseConfig = firebaseApp.options;
    this.message = !this.firebaseConfig ? noConfigMessage : undefined;

    const firebaseUser = firebaseApp.auth().currentUser;
    // check if user is already logged in
    if (firebaseUser) {
      const fbUserToken = await firebaseUser.getIdToken(true);
      updateFbUserToken(fbUserToken);
      const userId = await server.getUserId();
      if (!userId) {
        throw new Error('Error getting user ID');
      }
      await this.loginRegisteredUser(userId);
    }

    firebase.auth().onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        const fbUserToken = await fbUser.getIdToken(true);
        updateFbUserToken(fbUserToken);
      } else {
        console.log('no user yet');
      }
    });
  }

  async onSendVerificationCode(phoneNumber: string, applicationVerifier: firebase.auth.ApplicationVerifier) {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      console.log('onSendVerificationCode', {
        phoneNumber,
        applicationVerifier});
      this.verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        applicationVerifier
      );
      console.log('verification code sent');
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

  async loginRegisteredUser(userId: string) {
    this.rootStore.setUserId(userId);
    if (!this.notificationToken) {
      throw new Error('Notification token is not yet available');
    }
    await this.updateNotificationToken(this.notificationToken);
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

  async updateNotificationToken(notificationToken: string) {
    if (!this.rootStore.userId) {
      throw new Error('There is no user yet');
    }
    await server.updateNotificationToken(notificationToken);
  }
}
