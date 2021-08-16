import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: "groupin-stiebler",
  clientEmail: "firebase-adminsdk-6ex1x@groupin-stiebler.iam.gserviceaccount.com",
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};
const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};
admin.initializeApp(config);
