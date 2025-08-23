
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

async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return null;
    }
    const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
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

export async function getDashboardStats() {
  const userId = await getUserId();
  if (!userId) {
    return { totalNotes: 0, notesThisWeek: 0, mostActiveNotebookId: null, notebookCounts: {} };
  }
  
  const allNotesQuery = notesCollection.where('userId', '==', userId);

  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7);
  const notesThisWeekQuery = allNotesQuery.where('createdAt', '>=', aWeekAgo);

  const [allNotesSnapshot, notesThisWeekSnapshot] = await Promise.all([
    allNotesQuery.get(),
    notesThisWeekQuery.get(),
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
    
  return {
    totalNotes,
    notesThisWeek,
    mostActiveNotebookId,
    notebookCounts,
  };
}

export const getRecentNotes = async (count: number): Promise<Note[]> => {
  const userId = await getUserId();
  if (!userId) return [];
  
  try {
    const q = notesCollection
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .limit(count);
    const querySnapshot = await q.get();
    return querySnapshot.docs.map(docToNote);
  } catch (error) {
    console.error('Error getting recent documents: ', error);
    return [];
  }
}
