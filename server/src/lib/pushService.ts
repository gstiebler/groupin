import logger from '../config/winston';
import { sendPushNotifications } from './expoPush';

export type PushPayload = {
  message?: string;
  authorName: string;
  groupId: string;
  topicId: string;
  topicName?: string;
  messageId?: string;
  type: string;
}

export type NotificationParams = {
  payload: PushPayload,
  title: string,
  body: string,
  sendNotification: boolean;
}

const pushService = {

  init() {

  },

  async pushMessage(expoPushTokens: string[], notificationParams: NotificationParams) {
    const { payload, title, body, sendNotification } = notificationParams;
    try {
      const message = {
        title,
        body,
        data: payload,
      };
      logger.debug(`Sending push message ${JSON.stringify(message)} to tokens ${JSON.stringify(expoPushTokens)}`);
      const receipts = await sendPushNotifications(message, expoPushTokens);
      // Response is a message ID string.
      logger.info('Successfully sent message:', receipts);
    } catch (error) {
      logger.info('Error sending message:', error);
    }
  },

  async subscribe(notificationToken: string, notificationTopic: string) {
    logger.debug(`Successfully subscribed to topic: ${notificationTopic}`);
  },

  async unsubscribe(notificationToken: string, notificationTopic: string) {
    logger.debug('Successfully unsubscribed from topic:');
  },

  /**
   * Subscribe or unsubscribe depending on `subscribed` parameter
   * @param {*} notificationToken
   * @param {*} notificationTopic
   * @param {*} subscribed
   */
  async setSubscription(notificationToken: string, notificationTopic: string, subscribed: boolean) {
    if (subscribed) {
      this.subscribe(notificationToken, notificationTopic);
    } else {
      this.unsubscribe(notificationToken, notificationTopic);
    }
  },

};

export default pushService;
