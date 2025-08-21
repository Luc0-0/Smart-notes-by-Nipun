
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
} from 'firebase/firestore';
import { db } from './config';
import type { Note } from '@/lib/types';

const notesCollection = collection(db, 'notes');

// Create a new note
export const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
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

// Get a single note by ID
export const getNote = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    const docSnap = await getDoc(noteRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Note;
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
export const getNotes = async (userId: string) => {
  try {
    const q = query(notesCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() } as Note);
    });
    return notes;
  } catch (error) {
    console.error('Error getting documents: ', error);
    return [];
  }
};
