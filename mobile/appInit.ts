// import _ from 'lodash';
import { fcm } from './lib/fcm';
import { loginStore } from './stores/storesFactory';
import { Navigation } from './components/Navigator.types';

export default async function init(navigation: Navigation) {
  await fcm.init(navigation);
  await loginStore.init(navigation);
}
