
import type { Timestamp } from 'firebase/firestore';

export type Note = {
  id: string;
  title: string;
  content: string;
  userId: string;
  notebookId: 'general' | 'projects' | 'meetings' | 'personal';
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Notebook = {
  id: 'general' | 'projects' | 'meetings' | 'personal';
  title: string;
  description: string;
  icon: React.ReactNode;
};
