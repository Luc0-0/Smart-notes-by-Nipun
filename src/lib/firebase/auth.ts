'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from './config';

async function handleAuthSuccess(user: User) {
  const idToken = await user.getIdToken();
  await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });
  return { user, error: null };
}

export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return await handleAuthSuccess(userCredential.user);
  } catch (error) {
    return { user: null, error };
  }
}

export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return await handleAuthSuccess(userCredential.user);
  } catch (error) {
    return { user: null, error };
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return await handleAuthSuccess(result.user);
  } catch (error) {
    return { user: null, error };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    await fetch('/api/auth/logout', { method: 'POST' });
    return { error: null };
  } catch (error) {
    return { error };
  }
}
