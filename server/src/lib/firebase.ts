import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { envConfig } from '../config/envConfig';

const convertLineBreaks = (input: string) => input.split('\\n').join('\n');

const serviceAccount: ServiceAccount = {
  projectId: "groupin-stiebler",
  clientEmail: "firebase-adminsdk-6ex1x@groupin-stiebler.iam.gserviceaccount.com",
  privateKey: convertLineBreaks(envConfig.FIREBASE_PRIVATE_KEY!),
};
const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: envConfig.FIREBASE_DATABASE_URL,
};
admin.initializeApp(config);
