
'use server';

import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { auth as adminAuth } from 'firebase-admin';
import { app as adminApp } from './firebase-admin'; // Use the initialized app
import type { Note } from '@/lib/types';

// This function now uses the pre-initialized adminApp
const db = getFirestore(adminApp);
const notesCollection = db.collection('notes');

async function getAuthenticatedUser() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedToken = await adminAuth(adminApp).verifySessionCookie(sessionCookie, true);
    const user = await adminAuth(adminApp).getUser(decodedToken.uid);
    return user;
  } catch (error) {
    if ((error as any).code === 'auth/session-cookie-revoked' || (error as any).code === 'auth/invalid-session-cookie') {
      return null;
    }
    console.error('Error verifying session cookie or getting user:', error);
    return null;
  }
}

const docToNote = (doc: FirebaseFirestore.DocumentSnapshot): Note => {
  const data = doc.data() as any;
  return {
    id: doc.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    meetingDate: data.meetingDate ? (data.meetingDate as Timestamp).toDate() : undefined,
  } as Note;
};

export function getGreeting() {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good morning';
  if (hours < 18) return 'Good afternoon';
  return 'Good evening';
}

export async function getDashboardData() {
  const user = await getAuthenticatedUser();
  if (!user?.uid) {
    return { 
      userName: 'User',
      stats: { totalNotes: 0, notesThisWeek: 0, mostActiveNotebookId: null, notebookCounts: {} },
      recentNotes: []
    };
  }
  
  const userId = user.uid;
  
  const allNotesQuery = notesCollection.where('userId', '==', userId);

  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);
  
  const recentNotesQuery = allNotesQuery.orderBy('updatedAt', 'desc').limit(5);

  const [allNotesSnapshot, recentNotesSnapshot] = await Promise.all([
    allNotesQuery.get(),
    recentNotesQuery.get(),
  ]);
  
  const notesThisWeekSnapshot = allNotesSnapshot.docs.filter(doc => {
    const createdAt = (doc.data().createdAt as Timestamp).toDate();
    return createdAt >= aWeekAgo;
  });

  const totalNotes = allNotesSnapshot.size;
  const notesThisWeek = notesThisWeekSnapshot.length;

  const notebookCounts: Record<string, number> = {};
  allNotesSnapshot.docs.forEach(doc => {
    const note = doc.data() as Note;
    notebookCounts[note.notebookId] = (notebookCounts[note.notebookId] || 0) + 1;
  });

  const mostActiveNotebookId = Object.keys(notebookCounts).length > 0
    ? Object.entries(notebookCounts).sort((a, b) => b[1] - a[1])[0][0]
    : null;
    
  const stats = {
    totalNotes,
    notesThisWeek,
    mostActiveNotebookId,
    notebookCounts,
  };
  
  const recentNotes = recentNotesSnapshot.docs.map(docToNote);
  
  return {
    userName: user.displayName || 'User',
    stats,
    recentNotes
  };
}
