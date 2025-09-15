import { useState, useEffect, useCallback } from 'react';
import { getRecentNotes } from '@/lib/firebase/firestore';
import type { Note } from '@/lib/types';

export function useNotes(userId: string | undefined, limit: number = 10) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const userNotes = await getRecentNotes(userId, limit);
      setNotes(userNotes);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return { notes, loading, error, refetch: loadNotes };
}