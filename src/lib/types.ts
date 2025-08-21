
import type { Timestamp } from 'firebase/firestore';

export type Note = {
  id: string;
  title: string;
  content: string;
  userId: string;
  notebookId: 'general' | 'projects' | 'meetings' | 'personal';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;

  // Meeting-specific fields
  meetingDate?: Timestamp | Date;
  meetingLink?: string;
  discussionTopics?: string;
  actionItems?: string;
  
  // Project-specific fields
  projectFeatures?: string;
  projectIdeas?: string;
  projectTimeline?: string;

  // Personal-specific fields
  habitName?: string;
  habitGoal?: string;
  habitStreak?: number;
  groceryList?: string;
  collectionType?: string;
  collectionItems?: string;
};

export type Notebook = {
  id: 'general' | 'projects' | 'meetings' | 'personal';
  title: string;
  description: string;
  icon: React.ReactNode;
};
