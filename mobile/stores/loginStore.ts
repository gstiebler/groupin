import * as server from '../lib/server';
import * as graphqlConnect from '../lib/graphqlConnect';
import { Navigation } from '../components/Navigator.types';
import { RootStore } from './rootStore';
import { AlertStatic } from 'react-native';
// import { notifications } from '../lib/notifications';
import firebase from 'firebase/app';
import 'firebase/auth';

const updateFbUserToken = (fbUserToken: string) => graphqlConnect.setToken(fbUserToken);

export class LoginStore {
  // confirmResult = null;
  navigation: Navigation;
  message: { text: string, color: string };
  verificationId: string;
  verificationCode: string;
  phoneNumber: string;
  firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;

  constructor(
    private rootStore: RootStore,
    private Alert: AlertStatic,
    // private auth
  ) { }

  setPhoneNumber(phoneNumber: string) { this.phoneNumber = phoneNumber }
  setVerificationCode(verificationCode: string) { this.verificationCode = verificationCode }
  setMessage(message: { text: string, color: string }) { this.message = message }

  async login(fbUserToken: string) {
    // this.phoneNumber = phoneNumber;
    try {
      // this.confirmResult = await this.auth().signInWithPhoneNumber(phoneNumber);
      this.navigation.navigate('ConfirmationCode');
    } catch(error) {
      const msgByCode = {
        'auth/captcha-check-failed': 'Falha no Captcha',
        'auth/invalid-phone-number': 'Número de telefone inválido',
        'auth/quota-exceeded': 'Quota de SMS excedida',
        'auth/user-disabled': 'Usuário desabilitado',
        'auth/operation-not-allowed': 'Operação não permitida',
      };
      type errorCode = keyof (typeof msgByCode);
      const errorMessage = msgByCode[error.code as errorCode] || 'Erro';
      console.error(error);
      this.Alert.alert(
        'Erro',
        errorMessage,
        [
          {text: 'OK'},
        ],
        {cancelable: false},
      );
    }
  }

  async init(navigation: Navigation) {
    this.navigation = navigation;
    const noConfigMessage = {
      text: 'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
      color: 'green'
    };
    this.message = !this.firebaseConfig ? noConfigMessage : undefined;
  }

  async confirmationCodeReceived({ navigation, confirmationCode }: { navigation: Navigation, confirmationCode: string }) {
    /*
    try {
      await this.confirmResult.confirm(confirmationCode);
    } catch (error) {
      const msgByCode = {
        'auth/invalid-verification-code': 'Código de verificação inválido',
        'auth/missing-verification-code': 'Código de verificação vazio',
      };
      type errorCode = keyof (typeof msgByCode);
      const errorMessage = msgByCode[error.code as errorCode] || 'Erro';
      this.Alert.alert(
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
    const fbUser = this.auth().currentUser;
    const fbUserToken = await fbUser.getIdToken(true);  
    console.log(`Confirmation code, token: ${fbUserToken}`);

    updateFbUserToken(fbUserToken);
    const userId = (await server.getUserId()).id;
    if (userId === 'NO USER') {
      navigation.navigate('Register');
    } else {
      await this.userLoggedIn({ navigation, userId });
    }
    */
  }

  async onSendVerificationCode(applicationVerifier: firebase.auth.ApplicationVerifier) {
    // The FirebaseRecaptchaVerifierModal ref implements the
    // FirebaseAuthApplicationVerifier interface and can be
    // passed directly to `verifyPhoneNumber`.
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      this.verificationId = await phoneProvider.verifyPhoneNumber(
        this.phoneNumber,
        applicationVerifier
      );
      this.message = { text: 'Verification code has been sent to your phone.', color: 'green' };
    } catch (err) {
      this.message = { text: `Error: ${err.message}`, color: 'red' };
    }
  }

  async onConfirmVerificationCode() {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        this.verificationCode
      );
      const userCredential = await firebase.auth().signInWithCredential(credential);
      const firebaseUser = userCredential.user;
      const fbUserToken = await firebaseUser.getIdToken(true);
      this.message = { text: 'Phone authentication successful 👍', color: 'green' };
      this.login(fbUserToken);
    }catch(err) {
      this.message = { text: `Error: ${err.message}`, color: 'red' };
    }
  }

  async userLoggedIn(params: { navigation: Navigation, userId: string }) {
    const { navigation, userId } = params;
    this.rootStore.setUserId(userId);
    // await notifications.getAndUpdateFcmToken();
    await this.rootStore.groupStore.fetchOwnGroups();
    navigation.navigate('TabNavigator');
  }
  
  async logout(navigation: Navigation) {
    /*
    try {
      this.rootStore.setUserId('');
      await this.auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
    */
  }

  async register({navigation, name}: { navigation: Navigation, name: string }) {
    /*
    try {
      const { errorMessage, id } = await server.register(name);
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
      await this.userLoggedIn({ navigation, userId: id });
    } catch (error) {
      console.error(error);
    }
  */
  }
}
