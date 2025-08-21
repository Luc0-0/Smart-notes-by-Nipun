
'use client';
import { useEffect, useState } from 'react';
import { Editor } from '@/components/editor';
import { getNote } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-provider';
import type { Note } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotePage({ params }: { params: { noteId: string } }) {
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNote = async () => {
      setLoading(true);
      const fetchedNote = await getNote(params.noteId);
      
      if (fetchedNote) {
        if (fetchedNote.userId === user.uid) {
          setNote(fetchedNote);
        } else {
          setError("You don't have permission to view this note.");
        }
      } else {
        setError("Note not found.");
      }
      setLoading(false);
    };

    fetchNote();
  }, [params.noteId, user]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (error) {
     return <div className="text-center text-destructive">{error}</div>;
  }
  
  // The editor can handle the note being null, but we pass notebookId for new notes
  return <Editor note={note} />;
}
