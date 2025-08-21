'use client';
import { NoteList } from '@/components/note-list';
import { Suspense } from 'react';

function TagsPageContent() {
  return <NoteList />;
}

export default function TagsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagsPageContent />
    </Suspense>
  );
}
