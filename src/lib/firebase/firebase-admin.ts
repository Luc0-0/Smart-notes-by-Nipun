import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';

function initAdminSDK() {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (getApps().some(app => app.name === 'admin')) {
    return getApp('admin');
  }

  if (!serviceAccountKey) {
    // In a local environment, we can initialize without credentials to access some features.
    // For production, this key is essential.
    console.warn(
      "Firebase Admin SDK not fully initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY env variable for production features."
    );
    return initializeApp({}, 'admin');
  }
  
  try {
    const serviceAccountJson = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(serviceAccountJson);
    return initializeApp({
      credential: cert(serviceAccount),
    }, 'admin');
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK with service account:", error);
    // Fallback initialization
    return initializeApp({}, 'admin');
  }
}

export const getAdminApp = () => initAdminSDK();
