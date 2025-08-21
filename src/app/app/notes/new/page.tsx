
'use client';
import { Editor } from '@/components/editor';
import { Suspense } from 'react';

function NewNoteContent() {
  return <Editor />;
}

export default function NewNotePage() {
  // The editor can handle the case where there is no initial data
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewNoteContent />
    </Suspense>
  );
}
