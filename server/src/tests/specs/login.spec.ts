const RootStore = require('../../../../mobile/stores/rootStore');
const LoginStore = require('../../../../mobile/stores/loginStore');
const GroupStore = require('../../../../mobile/stores/groupStore');

import { setCurrentUser } from './index.spec';
import userFixtures from '../fixtures/userFixtures';

const emptyFunction = () => {};

describe('loginStore', () => {
  setCurrentUser(userFixtures.robert);
  const groupStore = new GroupStore();
  const rootStore = new RootStore(groupStore);
  const authObj = {
    signInWithPhoneNumber: () => ({ confirm: emptyFunction }),
    currentUser: {
      getIdToken: async () => 'id token',
    },
    onAuthStateChanged: emptyFunction,
    signOut: emptyFunction,
  };
  const navigation = {
    navigate: emptyFunction,
  };
  const Auth = () => authObj;
  const alert = { alert: emptyFunction };
  const loginStore = new LoginStore(rootStore, alert, Auth, emptyFunction);

  it('init', async () => {
    expect(true).toBe(true);
    await loginStore.init();
  });

  it('login', async () => {
    expect(true).toBe(true);
    const phoneNumber = '222';
    await loginStore.login(navigation, phoneNumber);
  });

  it('confirmationCodeReceived', async () => {
    expect(true).toBe(true);
    await loginStore.confirmationCodeReceived({ navigation, confirmationCode: 'x34' });
  });

  it('userLoggedIn', async () => {
    expect(true).toBe(true);
    await loginStore.userLoggedIn({ navigate: emptyFunction, userId: 'userId1' });
  });

  it('logout', async () => {
    expect(true).toBe(true);
    await loginStore.logout(navigation);
  });

  it('register', async () => {
    expect(true).toBe(true);
    await loginStore.register({ navigation, name: 'Alice' });
  });
});
