
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqWYizk35mU4TxD5N5rW4jL7MmMLHKjjA",
  authDomain: "smart-notes-luc-edition.firebaseapp.com",
  projectId: "smart-notes-luc-edition",
  storageBucket: "smart-notes-luc-edition.appspot.com",
  messagingSenderId: "962099069023",
  appId: "1:962099069023:web:11bdff433b7ae8d53f9bea"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Due to a bug in the Firebase SDK, we need to initialize Firestore with memory cache
// to avoid long-running save operations.
// See: https://github.com/firebase/firebase-js-sdk/issues/7908
const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

const auth = getAuth(app);


export { app, auth, db };
