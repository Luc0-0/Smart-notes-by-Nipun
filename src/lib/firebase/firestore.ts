import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { Note } from '@/lib/types';

const notesCollection = collection(db, 'notes');

// Helper to convert Firestore doc to Note type
const docToNote = (doc: any): Note => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
    meetingDate: data.meetingDate ? data.meetingDate.toDate() : undefined,
  } as Note;
};


// Create a new note
export const addNote = async (noteData: Partial<Note>) => {
  try {
    const docRef = await addDoc(notesCollection, {
      ...noteData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { id: null, error };
  }
};

// Update an existing note
export const updateNote = async (noteId: string, noteData: Partial<Note>) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      ...noteData,
      updatedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error) {
    console.error('Error updating document: ', error);
    return { error };
  }
};

// Delete a note
export const deleteNote = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
    return { error: null };
  } catch (error) {
    console.error('Error deleting document: ', error);
    return { error };
  }
}

// Get a single note by ID
export const getNote = async (noteId: string): Promise<Note | null> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    const docSnap = await getDoc(noteRef);
    if (docSnap.exists()) {
      return docToNote(docSnap);
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    return null;
  }
};


// Get all notes for a user
export const getNotes = async (userId: string): Promise<Note[]> => {
  try {
    const q = query(notesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToNote);
  } catch (error) {
    console.error('Error getting documents: ', error);
    return [];
  }
};

// Get all notes for a user within a specific notebook
export const getNotesByNotebook = async (userId: string, notebookId: string): Promise<Note[]> => {
  try {
    const q = query(
      notesCollection, 
      where('userId', '==', userId), 
      where('notebookId', '==', notebookId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToNote);
  } catch (error) {
    console.error('Error getting documents by notebook: ', error);
    return [];
  }
};
