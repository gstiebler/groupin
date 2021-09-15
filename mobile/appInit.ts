import { init as firebaseInit } from './config/firebaseConfig';
import { notifications } from './rn_lib/notifications';
import { rootStore, loginStore } from './rn_lib/storesFactory';
import { Navigation } from './rn_lib/Navigator.types';
import * as server from './lib/server';
import graphqlConnect from './lib/graphqlConnect';

export default async function init(navigation: Navigation) {
  graphqlConnect.setErrorHandler(error => rootStore.setErrorAction(error));
  const firebaseApp = firebaseInit();
  console.log('Firebase initialized');

  const notificationToken = await notifications.init(navigation);
  await loginStore.init(navigation, firebaseApp, notificationToken);
  server.getHello('foca').then(() => console.log('Server Hello ok'));
}
