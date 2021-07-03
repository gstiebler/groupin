// import _ from 'lodash';
import { notifications } from './lib/notifications';
import { loginStore } from './stores/storesFactory';
import { Navigation } from './components/Navigator.types';

export default async function init(navigation: Navigation) {
  await notifications.init(navigation);
  await loginStore.init(navigation);
}
