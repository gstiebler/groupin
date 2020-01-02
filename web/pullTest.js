const firebase = require('firebase');
require('firebase/messaging');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYsrQ9tI3q_2yz5uum-tj70u2lqyJvU04",
  authDomain: "groupin-4700b.firebaseapp.com",
  databaseURL: "https://groupin-4700b.firebaseio.com",
  projectId: "groupin-4700b",
  storageBucket: "groupin-4700b.appspot.com",
  messagingSenderId: "322488785136",
  appId: "1:322488785136:web:7435dd3b20e2b4e5cd4a35"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.onMessage((message) => {
  console.log('received message: ', message);
});
