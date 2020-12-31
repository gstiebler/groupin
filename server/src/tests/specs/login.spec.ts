const RootStore = require('../../../../mobile/stores/rootStore');
const LoginStore = require('../../../../mobile/stores/loginStore');
const GroupStore = require('../../../../mobile/stores/groupStore');

import { setCurrentUser, setup } from '../setup';
import userFixtures from '../fixtures/userFixtures';

describe('loginStore', () => {
  beforeAll(async () => {
    await setup();
  });

  setCurrentUser(userFixtures.robert);
  const groupStore = new GroupStore();
  const rootStore = new RootStore(groupStore);
  const authObj = {
    signInWithPhoneNumber: () => ({ confirm: jest.fn() }),
    currentUser: {
      getIdToken: async () => 'id token',
    },
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  };
  const navigation = {
    navigate: jest.fn(),
  };
  const Auth = () => authObj;
  const alert = { alert: jest.fn() };
  const loginStore = new LoginStore(rootStore, alert, Auth, jest.fn());

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
    await loginStore.userLoggedIn({ navigate: jest.fn(), userId: 'userId1' });
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
