// import _ from 'lodash';
import { notifications } from './rn_lib/notifications';
import { loginStore, rootStore } from './rn_lib/storesFactory';
import { Navigation } from './types/Navigator.types';
import firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from './config/firebaseConfig';

export default async function init(navigation: Navigation) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
    console.error(`Error initializing Firebase Auth: ${err}`);
  }

  await notifications.init(navigation, (notificationToken) => rootStore.updateNotificationToken(notificationToken));
  await loginStore.init(navigation);
}
