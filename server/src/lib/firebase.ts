import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: "groupin-4700b",
  clientEmail: "firebase-adminsdk-3ut5h@groupin-4700b.iam.gserviceaccount.com",
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};
const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};
admin.initializeApp(config);
