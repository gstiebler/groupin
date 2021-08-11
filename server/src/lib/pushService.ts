import logger from '../config/winston';
// eslint-disable-next-line @typescript-eslint/no-require-imports
// const firebaseConfig = require('../firebase_android_config.json');

// console.log(firebaseConfig);

export type NotificationParams = {
  payload: unknown,
  title: string,
  body: unknown,
  sendNotification: boolean;
}

const pushService = {

  init() {
    /*
    const serviceAccount = {
      ...firebaseConfig,
      private_key: JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`),
    };
    const config = {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    };
    admin.initializeApp(config);
    */

    // this.messaging = admin.messaging();
  },

  async pushMessage(notificationTopic: string, notificationParams: NotificationParams) {
    const { payload, title, body, sendNotification } = notificationParams;
    const message = {
      data: payload,
      // token: registrationToken, Only used when sending to an specific device
      topic: notificationTopic,
      notification: sendNotification ? { title, body } : undefined
    };
    try {
      logger.debug(`Sending push message to topic "${notificationTopic}", ${JSON.stringify(message)}`);
      const response = await this.messaging.send(message);
      // Response is a message ID string.
      logger.info('Successfully sent message:', response);
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
