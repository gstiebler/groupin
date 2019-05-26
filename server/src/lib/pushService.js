const admin = require('firebase-admin');
const logger = require('../config/winston');

let pushService = {

  init() {
    const serviceAccount = require("../../firebase_android_config.json");
    const config = {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://groupin-4700b.firebaseio.com"
    };
    config.private_key = process.env.FIREBASE_PRIVATE_KEY;
    admin.initializeApp(config);
    
    this.messaging = admin.messaging();
  },

  async pushMessage(fcmTopic, payload) {
    const message = {
      data: payload,
      /*notification: {
        title: 'Teste título',
        body: 'Corpo da notif',
      },*/
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
    console.log('Successfully subscribed to topic:', response);
  }

};

module.exports = pushService;
