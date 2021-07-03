// import _ from 'lodash';
import { notifications } from './lib/notifications';
import { loginStore, rootStore } from './stores/storesFactory';
import { Navigation } from './components/Navigator.types';

export default async function init(navigation: Navigation) {
  await notifications.init(navigation, (notificationToken) => rootStore.updateNotificationToken(notificationToken));
  await loginStore.init(navigation);
}
