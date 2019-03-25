const admin = require('firebase-admin');
const logger = require('./config/winston');

var serviceAccount = require("../groupin-4700b-firebase-adminsdk-3ut5h-d40e23c950.json");
var config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://groupin-4700b.firebaseio.com"
};
admin.initializeApp(config);

const messaging = admin.messaging();

// This registration token comes from the client FCM SDKs.
var registrationToken = 'fN-kf5k7AkE:APA91bEPcR0thW7rPa-twuB4BJKZqmIe3slk5lTIbuVbUCld7ucoCmOsqwYWTap5TX3LMYhh-o6WFvMv9-i0GGg8qkcx9uCKT_910sg6dJw3cmS4OmV0ANv5KPfvBrcEfP9OA-wzm0Uv';

var message = {
  data: {
    score: '850',
    time: '2:45'
  },
  token: registrationToken,
  // topic: 'groupin_main'
};

// Send a message to the device corresponding to the provided
// registration token.
messaging.send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

module.exports = { 
  messaging,
};
