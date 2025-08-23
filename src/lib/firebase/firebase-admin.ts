
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

export function initAdminSDK() {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!serviceAccountKey) {
     console.warn(
        "Firebase Admin SDK not initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY env variable."
    );
    // This allows the app to build but server features will fail.
    return initializeApp();
  }

  try {
    // The key is expected to be a base64 encoded string.
    const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
     console.error("Error initializing Firebase Admin SDK:", error);
     // Fallback initialization if parsing fails
     return initializeApp();
  }
}
