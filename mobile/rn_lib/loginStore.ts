import * as server from '../lib/server';
import graphqlConnect from '../lib/graphqlConnect';
import { Navigation } from './Navigator.types';
import { RootStore } from '../stores/rootStore';
import { AlertStatic } from 'react-native';
import firebase from 'firebase/app';
import { localStorage } from './localStorage';
import { decodeAuthToken } from '../lib/auth';

const updateAuthToken = (fbUserToken: string) => graphqlConnect.setToken(fbUserToken);

export class LoginStore {
  navigation: Navigation;
  message?: { text: string, color: string } = undefined;
  verificationId: string = undefined;
  firebaseConfig: unknown;
  firebaseApp: firebase.app.App;
  notificationToken: string;
  isLoading = false;

  constructor(
    private rootStore: RootStore,
    private Alert: AlertStatic,
  ) { }

  setVerificationIdAction = (verificationId: string) => { this.verificationId = verificationId; }
  setMessageAction = (message: { text: string, color: string }) => { this.message = message }
  setIsLoading = (isLoading: boolean) => { this.isLoading = isLoading; }

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

    this.setIsLoading(true);
    const authToken = await localStorage.getAuthToken();
    console.log(`Stored external user token: "${authToken}"`);
    // check if user is already logged in
    if (authToken) {
      updateAuthToken(authToken);
      await this.loginRegisteredUser(authToken);
    }

    this.setIsLoading(false);
  }

  async onSendVerificationCode(phoneNumber: string, applicationVerifier: firebase.auth.ApplicationVerifier) {
    this.setIsLoading(true);
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        applicationVerifier
      );
      console.log(`Verification id: ${verificationId}`);
      this.setVerificationIdAction(verificationId);
      this.setMessageAction({ text: 'Verification code has been sent to your phone.', color: 'green' });
    } catch (err) {
      this.setMessageAction({ text: `Error: ${err.message}`, color: 'red' });
    }
    this.setIsLoading(false);
  }

  async onConfirmVerificationCode(verificationCode: string) {
    this.setIsLoading(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        verificationCode
      );
      const userCredential = await firebase.auth().signInWithCredential(credential);
      const firebaseUser = userCredential.user;
      if (!firebaseUser) {
        this.setIsLoading(false);
        throw new Error('Firebase user not found');
      }
      const fbUserToken = await firebaseUser.getIdToken(true);
      this.setMessageAction({ text: 'Phone authentication successful 👍', color: 'green' });
      await this.confirmationCodeReceived(fbUserToken);
    } catch(err) {
      this.setMessageAction({ text: `Error: ${err.message}`, color: 'red' });
    }
    this.setIsLoading(false);
  }

  async confirmationCodeReceived(fbUserToken: string) {
    const authToken = await server.getAuthToken(fbUserToken);
    updateAuthToken(authToken);
    const { userId } = decodeAuthToken(authToken);
    if (!userId) {
      this.registerNewUser(fbUserToken);
    } else {
      this.loginRegisteredUser(authToken);
    }
  }

  async loginRegisteredUser(authToken: string) {
    const { userId } = decodeAuthToken(authToken);
    if (!userId) {
      throw new Error('Error getting user ID');
    }
    this.rootStore.setUserIdAction(userId);
    await localStorage.setAuthToken(authToken);
    if (!this.notificationToken) {
      throw new Error('Notification token is not yet available');
    }
    await this.rootStore.updateNotificationToken(this.notificationToken);
  }

  async isUserLoggedIn() {
    const userToken = await localStorage.getAuthToken();
    return !!(this.rootStore.userId && userToken);
  }

  registerNewUser(externalUserToken: string) {
    this.navigation.navigate('Register', { externalUserToken });
  }

  async register(name: string, externalUserToken: string) {
    this.setIsLoading(true);
    try {
      const { errorMessage, authToken } = await server.register(externalUserToken, name);
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
      this.loginRegisteredUser(authToken);
    } catch (error) {
      console.error(error);
    }
    this.setIsLoading(false);
  }

  async logout() {
    try {
      this.rootStore.setUserIdAction('');
      await localStorage.setAuthToken(null);
      this.navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  }
}
