// import _ from 'lodash';
import * as FCM from './lib/fcm';
import { loginStore } from './stores/storesFactory';
import { Navigation } from './components/Navigator.types';

export default async function init(navigation: Navigation) {
  await FCM.init(navigation);
  await loginStore.init(navigation);
}
