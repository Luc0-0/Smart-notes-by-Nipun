
import type { Timestamp } from 'firebase/firestore';
import type { ChecklistItemType } from '@/components/ui/checklist';


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
  discussionTopics?: ChecklistItemType[];
  actionItems?: ChecklistItemType[];
  
  // Project-specific fields
  projectFeatures?: ChecklistItemType[];
  projectIdeas?: string;
  projectTimeline?: string;

  // Personal-specific fields
  habitName?: string;
  habitGoal?: string;
  habitStreak?: number;
  groceryList?: ChecklistItemType[];
  collectionType?: string;
  collectionItems?: ChecklistItemType[];
};

export type Notebook = {
  id: 'general' | 'projects' | 'meetings' | 'personal';
  title: string;
  description: string;
  icon: React.ReactNode;
};
