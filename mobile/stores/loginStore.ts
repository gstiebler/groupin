import * as server from '../lib/server';
import * as graphqlConnect from '../lib/graphqlConnect';
import { Navigation } from '../components/Navigator.types';
import { RootStore } from './rootStore';
import { AlertStatic } from 'react-native';
import { NavFn } from '../components/Navigator';

const updateFbUserToken = (fbUserToken: string) => graphqlConnect.setToken(fbUserToken);

export class LoginStore {
  phoneNumber = '';
  confirmResult = null;

  constructor(
    private rootStore: RootStore,
    private Alert: AlertStatic,
    private auth,
    private getAndUpdateFcmToken: () => Promise<void>
  ) {}

  async login(navigation: Navigation, phoneNumber: string) {
    this.phoneNumber = phoneNumber;
    try {
      this.confirmResult = await this.auth().signInWithPhoneNumber(phoneNumber);
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

  async init(navigate: NavFn) {
    try {
      const firebaseUser = this.auth().currentUser;
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

      this.auth().onAuthStateChanged(async (fbUser) => {
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

  async confirmationCodeReceived({ navigation, confirmationCode }: { navigation: Navigation, confirmationCode: string }) {
    try {
      await this.confirmResult.confirm(confirmationCode);
    } catch (error) {
      const msgByCode = {
        'auth/invalid-verification-code': 'Código de verificação inválido',
        'auth/missing-verification-code': 'Código de verificação vazio',
      };
      const errorMessage = msgByCode[error.code] || 'Erro';
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
      await this.userLoggedIn({  
        navigate: (route) => navigation.navigate(route), 
        userId,
      });
    }
  }

  async userLoggedIn(params: { navigate: NavFn, userId: string }) {
    const { navigate, userId } = params;
    this.rootStore.setUserId(userId);
    await this.getAndUpdateFcmToken();
    await this.rootStore.groupStore.fetchOwnGroups();
    navigate('TabNavigator');
  }
  
  async logout(navigation: Navigation) {
    try {
      this.rootStore.setUserId('');
      await this.auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  }

  async register({navigation, name}: { navigation: Navigation, name: string }) {
    try {
      const { errorMessage, id } = await server.register({
        name, 
        phoneNumber: this.phoneNumber,
      });
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
      await this.userLoggedIn({
        navigate: (route) => navigation.navigate(route), 
        userId: id,
      });
    } catch (error) {
      console.error(error);
    }
  }

}
