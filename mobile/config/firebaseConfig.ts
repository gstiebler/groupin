import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAqeNtjeYXf8sXmACmJ9l_Y6ZUSzVqN9do",
  authDomain: "groupin-stiebler.firebaseapp.com",
  databaseURL: "https://groupin-stiebler.firebaseio.com",
  projectId: "groupin-stiebler",
  storageBucket: "groupin-stiebler.appspot.com",
  messagingSenderId: "995117614801",
  appId: "1:995117614801:web:6eeebeaa0f0f198101a7f0",
  measurementId: "G-HXPTVLXFED"
};

export function init(): firebase.app.App {
  return firebase.initializeApp(firebaseConfig);
}
