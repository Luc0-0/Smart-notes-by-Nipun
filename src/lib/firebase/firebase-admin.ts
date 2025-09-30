import { getApp, getApps, initializeApp, cert, App } from 'firebase-admin/app';

// This function ensures a single instance of the Firebase Admin app is initialized and reused.
function createAdminApp(): App {
  if (getApps().some((app) => app.name === 'admin')) {
    return getApp('admin');
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    console.warn(
      "Firebase Admin SDK not fully initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY env variable for production features."
    );
    // Initialize without credentials for local dev or limited functionality environments
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
    // Fallback to default initialization on error
    return initializeApp({}, 'admin');
  }
}

export const getAdminApp = () => createAdminApp();
