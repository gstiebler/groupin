const admin = require('firebase-admin');
const logger = require('../config/winston');

let pushService = {

  init() {
    const serviceAccount = {
      ...require("../../firebase_android_config.json"),
      private_key: JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`),
    };
    const config = {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://groupin-4700b.firebaseio.com"
    };
    admin.initializeApp(config);
    
    this.messaging = admin.messaging();
  },

  async pushMessage(fcmTopic, { payload, title, body }) {
    const message = {
      data: payload,
      notification: {
        title,
        body,
      },
      // token: registrationToken,
      topic: fcmTopic,
    };
    // Send a message to the device corresponding to the provided
    // registration token.
    try {
      const response = await this.messaging.send(message);
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    } catch(error) {
      console.log('Error sending message:', error);
    }
  },
  
  async subscribe(fcmToken, fcmTopic) {
    const response = await this.messaging.subscribeToTopic([fcmToken], fcmTopic);
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    logger.debug('Successfully subscribed to topic:', response);
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
      this.subscribe(fcmToken, fcmTopic)
    } else {
      this.unsubscribe(fcmToken, fcmTopic)
    }
  },

};

module.exports = pushService;
