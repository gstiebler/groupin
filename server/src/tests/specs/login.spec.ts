import * as _ from 'lodash';
import { setCurrentUser, setup } from '../setup';
import userFixtures from '../fixtures/userFixtures';

const RootStore = require('../../../../mobile/stores/rootStore');
const LoginStore = require('../../../../mobile/stores/loginStore');
const GroupStore = require('../../../../mobile/stores/groupStore');

import groupFixtures from '../fixtures/groupFixtures';

function getInitializedStore() {
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
  const getAndUpdateFcmToken = jest.fn();
  const loginStore = new LoginStore(rootStore, alert, Auth, getAndUpdateFcmToken);
  return {
    rootStore,
    loginStore,
    navigation,
    navigate: jest.fn(),
    getAndUpdateFcmToken,
  };
}

describe('loginStore', () => {
  beforeAll(async () => {
    await setup();
  });

  it('init', async () => {
    const { loginStore, navigate } = getInitializedStore();
    expect(true).toBe(true);
    await loginStore.init(navigate);
  });

  it('login', async () => {
    const { loginStore, navigation } = getInitializedStore();
    expect(true).toBe(true);
    const phoneNumber = '222';
    await loginStore.login(navigation, phoneNumber);
  });

  it('confirmationCodeReceived', async () => {
    const { loginStore, navigation, navigate } = getInitializedStore();
    expect(true).toBe(true);
    await loginStore.init(navigate);
    await loginStore.login(navigation, '555');
    await loginStore.confirmationCodeReceived({ navigation, confirmationCode: 'x34' });
  });

  it('userLoggedIn', async () => {
    const { rootStore, loginStore, navigate, getAndUpdateFcmToken } = getInitializedStore();
    await loginStore.userLoggedIn({ navigate, userId: 'userId1' });
    expect(rootStore.userId).toEqual('userId1');
    expect(getAndUpdateFcmToken).toHaveBeenCalled();
    expect(_.map(rootStore.groupStore.ownGroups, 'id')).toEqual([
      groupFixtures.firstGroup._id.toHexString(),
      groupFixtures.secondGroup._id.toHexString(),
    ]);
    expect(navigate.mock.calls).toEqual([['TabNavigator']]);
  });

  it('logout', async () => {
    const { loginStore, navigation } = getInitializedStore();
    expect(true).toBe(true);
    await loginStore.logout(navigation);
  });

  it('register', async () => {
    const { loginStore, navigation } = getInitializedStore();
    expect(true).toBe(true);
    await loginStore.register({ navigation, name: 'Alice' });
  });
});
