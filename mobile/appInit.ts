import { notifications } from './rn_lib/notifications';
import { loginStore } from './rn_lib/storesFactory';
import { Navigation } from './rn_lib/Navigator.types';
import firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseConfig } from './config/firebaseConfig';

export default async function init(navigation: Navigation) {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {
    console.error(`Error initializing Firebase Auth: ${err}`);
  }

  await notifications.init(navigation);
  await loginStore.init(navigation);
}
