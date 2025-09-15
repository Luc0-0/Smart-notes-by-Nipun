
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firestore with default settings for better performance
const db = getFirestore(app);

const auth = getAuth(app);


export { app, auth, db };
