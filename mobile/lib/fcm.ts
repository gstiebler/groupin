import messaging from '@react-native-firebase/messaging';
import { Navigation } from '../components/Navigator.types';
import { rootStore } from '../stores/storesFactory';

import * as messageReceiver from './messageReceiver';

export type GiNotification = {
  notification: {
    data: {
      groupId: string;
      topicId: string;
      topicName: string
    }
  }
}
export class GiFcm {
  tokenRefreshListener: () => void;
  messagesListener: () => void;
  notificationOpenedListener: () => void;
  navigation: Navigation;

  public async init(navigation: Navigation) {
    this.navigation = navigation;
    this.tokenRefreshListener = messaging().onTokenRefresh((fcmToken: string) => {
      rootStore.updateFcmToken(fcmToken);
    });

    const hasPermission = await messaging().hasPermission();
    if (hasPermission) {
      console.log('FCM has permission');
      await this.startMessageListener();
    } else {
      try {
        await messaging().requestPermission();
        console.log('User has authorized messaging');
        this.startMessageListener();
      } catch (error) {
        console.error('User has not authorized messaging');
      }
    }
  }

  async getAndUpdateFcmToken() {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      await rootStore.updateFcmToken(fcmToken);
    } else {
      console.log('no firebase token');
    }
  }

  async startMessageListener() {
    await this.getAndUpdateFcmToken();
    this.messagesListener = messaging().onMessage((message: string) => {
      console.log('received message: ', message);
      messageReceiver.messageReceived(message);
    });

    this.notificationOpenedListener = messaging().onNotificationOpenedApp((notificationOpen: GiNotification) => {
      console.log('onNotificationOpenedApp');
      messageReceiver.onNotificationOpened(this.navigation, notificationOpen);
    });

    messaging().getInitialNotification().then((notificationOpen: GiNotification) => {
      console.log('getInitialNotification');
      messageReceiver.onInitialNotification(this.navigation, notificationOpen);
    });
  }

  async subscribeToTopic(topic: string) {
    messaging().subscribeToTopic(topic);
  }

  async unsubscribeFromTopic(topic: string) {
    messaging().unsubscribeFromTopic(topic);
  }

  releaseListeners() {
    this.tokenRefreshListener();
    this.messagesListener();
    this.notificationOpenedListener();
  }
}

export const fcm = new GiFcm();
