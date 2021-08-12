import { init as firebaseInit } from './config/firebaseConfig';
import { notifications } from './rn_lib/notifications';
import { loginStore } from './rn_lib/storesFactory';
import { Navigation } from './rn_lib/Navigator.types';
import * as server from './lib/server';

export default async function init(navigation: Navigation) {
  try {
    firebaseInit();
    console.log('Firebase initialized');
  } catch (err) {
    console.error(`Error initializing Firebase Auth: ${err}`);
  }

  const notificationToken = await notifications.init(navigation);
  await loginStore.init(navigation, notificationToken);
  server.getHello('foca').then(() => console.log('Server Hello ok'));
}
