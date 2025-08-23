
import 'server-only';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { getApp as getAdminApp } from 'firebase-admin/app';
import { auth } from 'firebase-admin';
import { initAdminSDK } from './firebase-admin';
import type { Note } from '@/lib/types';

initAdminSDK();
const db = getFirestore(getAdminApp());
const notesCollection = db.collection('notes');

async function getAuthenticatedUser() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
    const user = await auth().getUser(decodedToken.uid);
    return user;
  } catch (error) {
    console.error('Error verifying session cookie or getting user:', error);
    return null;
  }
}

// Helper to convert Firestore doc to Note type
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
  const notesThisWeekQuery = allNotesQuery.where('createdAt', '>=', aWeekAgo);
  
  const recentNotesQuery = allNotesQuery.orderBy('updatedAt', 'desc').limit(5);

  const [allNotesSnapshot, notesThisWeekSnapshot, recentNotesSnapshot] = await Promise.all([
    allNotesQuery.get(),
    notesThisWeekQuery.get(),
    recentNotesQuery.get(),
  ]);

  const totalNotes = allNotesSnapshot.size;
  const notesThisWeek = notesThisWeekSnapshot.size;

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
