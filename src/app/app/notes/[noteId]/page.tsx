import { Editor } from '@/components/editor';

// This is a dynamic route for a specific note.
// In a real app, you would fetch the note data based on the noteId.
export default function NotePage({ params }: { params: { noteId: string } }) {
  // For now, we'll just pass a mock note object to the editor.
  const mockNote = {
    id: params.noteId,
    title: `Note ${params.noteId}`,
    content: `This is the content for note ${params.noteId}. Start editing!`,
  };

  return <Editor note={mockNote} />;
}
