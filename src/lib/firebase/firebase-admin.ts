
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let adminApp;

if (getApps().length === 0) {
  if (serviceAccountKey) {
    try {
      const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
      const serviceAccount = JSON.parse(serviceAccountJson);
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error("Error initializing Firebase Admin SDK with service account:", error);
      adminApp = initializeApp();
    }
  } else {
    console.warn(
      "Firebase Admin SDK not fully initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY env variable for production features."
    );
    adminApp = initializeApp();
  }
} else {
  adminApp = getApp();
}

export const app = adminApp;
