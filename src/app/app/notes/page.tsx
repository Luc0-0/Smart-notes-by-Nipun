
'use client';
import { NoteList } from '@/components/note-list';
import { Suspense } from 'react';

function NotesPageContent({ searchQuery }: { searchQuery: string }) {
  return <NoteList searchQuery={searchQuery} />;
}

export default function AllNotesPage({ searchQuery }: { searchQuery: string }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesPageContent searchQuery={searchQuery} />
    </Suspense>
  );
}
