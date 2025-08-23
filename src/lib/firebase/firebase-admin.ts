
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

export function initAdminSDK() {
  if (!getApps().length) {
    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
        console.warn(
            "Firebase Admin SDK not initialized. Set FIREBASE_SERVICE_ACCOUNT env variable."
        );
        // Initialize without credentials for local dev if desired, but some features will fail.
        initializeApp();
    }
  }
  return getApp();
}
