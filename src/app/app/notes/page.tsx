
'use client';
import { NoteList } from '@/components/note-list';
import { Suspense } from 'react';

function NotesPageContent() {
  return <NoteList />;
}

export default function AllNotesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesPageContent />
    </Suspense>
  );
}
