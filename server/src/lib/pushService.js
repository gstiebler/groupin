const admin = require('firebase-admin');
const logger = require('../config/winston');

var serviceAccount = require("../../firebase_android_config.json");
var config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://groupin-4700b.firebaseio.com"
};
admin.initializeApp(config);

const messaging = admin.messaging();

async function pushMessage(fcmTopic, payload) {
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
    const response = await messaging.send(message);
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  } catch(error) {
    console.log('Error sending message:', error);
  }
}

module.exports = { 
  pushMessage,
};
