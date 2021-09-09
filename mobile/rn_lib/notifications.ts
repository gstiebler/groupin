import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Navigation } from './Navigator.types';

import * as messageReceiver from '../lib/messageReceiver';
import { Platform } from 'react-native';
import { groupStore, topicStore } from './storesFactory';
import { GiNotification } from '../lib/notificationTypes';

async function registerForPushNotificationsAsync() {
  let notificationToken = '';
  let status = 'no_device';
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    status = existingStatus;
    if (existingStatus !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      status = newStatus;
    }
    notificationToken = (await Notifications.getExpoPushTokenAsync()).data;
    return { token: notificationToken, status };
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return { token: notificationToken, status };
}

type Subscription = ReturnType<typeof Notifications.addNotificationReceivedListener>;

export class GiNotifications {
  notificationListener: Subscription;
  responseListener: Subscription;
  navigation: Navigation;

  public async init(navigation: Navigation): Promise<string> {
    this.navigation = navigation;

    const { token: notificationToken, status } = await registerForPushNotificationsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      console.error('User has not authorized messaging');
      return;
    }

    if (status === 'granted') {
      console.log('Notification has permission');
      await this.startMessageListener();
    } else {
      console.error('User has not authorized messaging');
    }
    return notificationToken;
  }

  async startMessageListener() {
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
      messageReceiver.messageReceived(groupStore, topicStore);
    });

    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
      console.log('onNotificationOpenedApp');
      messageReceiver.onNotificationOpened({
        giNotification: response.notification.request.content.data as GiNotification,
        groupStore,
        topicStore,
        navigation: this.navigation,
      });
      const notificationOpen = response.notification.request.content.data as GiNotification;
      const { topicId, topicName } = notificationOpen.notification.data;
      this.navigation.navigate('Chat', { topicId, topicName });
    });
  }

  async subscribeToTopic(topic: string) {
    console.error('subscribeToTopic not implemented');
    // messaging().subscribeToTopic(topic);
  }

  async unsubscribeFromTopic(topic: string) {
    console.error('unsubscribeFromTopic not implemented');
    // messaging().unsubscribeFromTopic(topic);
  }

  releaseListeners() {
    Notifications.removeNotificationSubscription(this.notificationListener);
    Notifications.removeNotificationSubscription(this.responseListener);
  }
}

export const notifications = new GiNotifications();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

