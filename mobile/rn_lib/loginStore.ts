import * as server from '../lib/server';
import graphqlConnect from '../lib/graphqlConnect';
import { Navigation } from './Navigator.types';
import { RootStore } from '../stores/rootStore';
import { AlertStatic } from 'react-native';
import firebase from 'firebase/app';
import { localStorage } from './localStorage';

const updateFbUserToken = (fbUserToken: string) => graphqlConnect.setToken(fbUserToken);

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
    const externalUserToken = await localStorage.getExternalUserToken();
    console.log(`Stored external user token: "${externalUserToken}"`);
    // check if user is already logged in
    if (externalUserToken) {
      updateFbUserToken(externalUserToken);
      const userId = await server.getUserId();

      if (!userId) {
        this.setIsLoading(false);
        throw new Error('Error getting user ID');
      }
      await this.loginRegisteredUser(userId, externalUserToken);
    }

    this.setIsLoading(false);
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
    updateFbUserToken(fbUserToken);
    const userId = await server.getUserId();
    if (userId === 'NO USER') {
      this.registerNewUser(fbUserToken);
    } else {
      this.loginRegisteredUser(userId, fbUserToken);
    }
  }

  async loginRegisteredUser(userId: string, fbUserToken: string) {
    this.rootStore.setUserIdAction(userId);
    await localStorage.setExternalUserToken(fbUserToken);
    if (!this.notificationToken) {
      throw new Error('Notification token is not yet available');
    }
    await this.rootStore.updateNotificationToken(this.notificationToken);
    this.navigation.navigate('TabNavigator');
  }

  registerNewUser(externalUserToken: string) {
    this.navigation.navigate('Register', { externalUserToken });
  }

  async register(name: string, externalUserToken: string) {
    this.setIsLoading(true);
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
      this.loginRegisteredUser(userId, externalUserToken);
    } catch (error) {
      console.error(error);
    }
    this.setIsLoading(false);
  }

  async logout() {
    try {
      this.rootStore.setUserIdAction('');
      await localStorage.setExternalUserToken(null);
      this.navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  }
}
