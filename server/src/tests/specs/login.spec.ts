import * as _ from 'lodash';

import { setup, setCurrentUser } from '../setup';

import userFixtures from '../fixtures/userFixtures';
const graphqlConnect = require('../../../../mobile/lib/graphqlConnect');
const server = require('../../../../mobile/lib/server');

const RootStore = require('../../../../mobile/stores/rootStore');
const LoginStore = require('../../../../mobile/stores/loginStore');
const GroupStore = require('../../../../mobile/stores/groupStore');

import groupFixtures from '../fixtures/groupFixtures';

function getInitializedStore() {
  setCurrentUser(userFixtures.robert);
  const groupStore = new GroupStore();
  const rootStore = new RootStore(groupStore);
  const confirmResultObj = { confirm: jest.fn() };
  const authObj = {
    signInWithPhoneNumber: () => confirmResultObj,
    currentUser: {
      getIdToken: async () => 'id token',
    },
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  };
  const navigation = {
    navigate: jest.fn(),
  };
  const auth = () => authObj;
  const Alert = { alert: jest.fn() };
  const getAndUpdateFcmToken = jest.fn();
  const loginStore = new LoginStore(rootStore, Alert, auth, getAndUpdateFcmToken);
  return {
    rootStore,
    loginStore,
    navigation,
    authObj,
    confirmResultObj,
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
    graphqlConnect.setToken = jest.fn();
    loginStore.userLoggedIn = jest.fn();
    server.getUserId = jest.fn(async () => ({ id: 'userId453' }));
    await loginStore.init(navigate);
    expect(graphqlConnect.setToken).toHaveBeenCalledWith('id token');
    const { userId } = loginStore.userLoggedIn.mock.calls[0][0];
    expect(userId).toEqual('userId453');
  });

  it('login', async () => {
    const { loginStore, navigation } = getInitializedStore();
    const phoneNumber = '222';
    await loginStore.login(navigation, phoneNumber);
  });

  describe('confirmationCodeReceived', () => {
    const {
      loginStore,
      navigation,
      navigate,
      confirmResultObj,
    } = getInitializedStore();
    graphqlConnect.setToken = jest.fn();

    beforeEach(async () => {
      await loginStore.init(navigate);
      await loginStore.login(navigation, '555');
    });

    it('not logged', async () => {
      server.getUserId = jest.fn(async () => ({ id: 'NO USER' }));
      await loginStore.confirmationCodeReceived({ navigation, confirmationCode: 'x34' });
      expect(confirmResultObj.confirm).toHaveBeenCalledWith('x34');
      expect(graphqlConnect.setToken).toHaveBeenCalledWith('id token');
      expect(navigation.navigate).toHaveBeenCalledWith('Register');
    });

    it('logged', async () => {
      server.getUserId = jest.fn(async () => ({ id: 'userId2' }));
      loginStore.userLoggedIn = jest.fn();
      await loginStore.confirmationCodeReceived({ navigation, confirmationCode: 'x34' });
      expect(confirmResultObj.confirm).toHaveBeenCalledWith('x34');
      expect(graphqlConnect.setToken).toHaveBeenCalledWith('id token');

      const { userId, navigate: mockNavigate } = loginStore.userLoggedIn.mock.calls[0][0];
      expect(userId).toEqual('userId2');
      mockNavigate('route');
      expect(navigation.navigate).toHaveBeenCalledWith('route');
    });
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
    const { rootStore, loginStore, navigation, navigate, authObj } = getInitializedStore();
    await loginStore.init(navigate);
    await loginStore.login(navigation, '555');
    await loginStore.logout(navigation);
    expect(rootStore.userId).toEqual('');
    expect(authObj.signOut).toHaveBeenCalled();
    expect(navigation.navigate).toHaveBeenLastCalledWith('Login');
  });

  it('register', async () => {
    const { loginStore, navigation } = getInitializedStore();
    server.register = jest.fn(async () => ({ id: 'id1' }));
    loginStore.userLoggedIn = jest.fn();
    await loginStore.register({ navigation, name: 'Alice', phoneNumber: '1235' });
    expect(server.register).toHaveBeenCalledWith({
      name: 'Alice',
      phoneNumber: '1235',
    });
    expect(loginStore.phoneNumber).toEqual('1235');
    const { userId, navigate: mockNavigate } = loginStore.userLoggedIn.mock.calls[0][0];
    expect(userId).toEqual('id1');
    mockNavigate('route');
    expect(navigation.navigate).toHaveBeenCalledWith('route');
  });
});
