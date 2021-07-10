const admin = require('firebase-admin');
const logger = require('../config/winston');
const firebaseConfig = require('../../firebase_android_config.json');

const pushService = {

  init() {
    const serviceAccount = {
      ...firebaseConfig,
      private_key: JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`),
    };
    const config = {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    };
    admin.initializeApp(config);

    this.messaging = admin.messaging();
  },

  async pushMessage(fcmTopic, { payload, title, body, sendNotification }) {
    const message = {
      data: payload,
      // token: registrationToken, Only used when sending to an specific device
      topic: fcmTopic,
      notification: undefined,
    };
    if (sendNotification) {
      message.notification = {
        title,
        body,
      };
    }
    try {
      logger.debug(`Sending push message to topic "${fcmTopic}", ${JSON.stringify(message)}`);
      const response = await this.messaging.send(message);
      // Response is a message ID string.
      logger.info('Successfully sent message:', response);
    } catch (error) {
      logger.info('Error sending message:', error);
    }
  },

  async subscribe(fcmToken, fcmTopic) {
    const response = await this.messaging.subscribeToTopic([fcmToken], fcmTopic);
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    logger.debug(`Successfully subscribed to topic: ${fcmTopic}, ${response}`);
  },

  async unsubscribe(fcmToken, fcmTopic) {
    const response = await this.messaging.unsubscribeFromTopic([fcmToken], fcmTopic);
    logger.debug('Successfully unsubscribed from topic:', response);
  },

  /**
   * Subscribe or unsubscribe depending on `subscribed` parameter
   * @param {*} fcmToken
   * @param {*} fcmTopic
   * @param {*} subscribed
   */
  async setSubscription(fcmToken, fcmTopic, subscribed) {
    if (subscribed) {
      this.subscribe(fcmToken, fcmTopic);
    } else {
      this.unsubscribe(fcmToken, fcmTopic);
    }
  },

};

export default pushService;
