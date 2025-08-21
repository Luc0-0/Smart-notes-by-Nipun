
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDqWYizk35mU4TxD5N5rW4jL7MmMLHKjjA",
  authDomain: "smart-notes-luc-edition.firebaseapp.com",
  projectId: "smart-notes-luc-edition",
  storageBucket: "smart-notes-luc-edition.firebasestorage.app",
  messagingSenderId: "962099069023",
  appId: "1:962099069023:web:11bdff433b7ae8d53f9bea",
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);

export { app, auth };
