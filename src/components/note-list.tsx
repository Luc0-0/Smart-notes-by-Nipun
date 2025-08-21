'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

// Mock data for notes - in a real app, this would come from a database
const notes = [
  { id: '1', title: 'My First Note', excerpt: 'This is the beginning of something great...', lastEdited: '2 hours ago' },
  { id: '2', title: 'Project Ideas', excerpt: 'Brainstorming session for the new AI project...', lastEdited: 'Yesterday' },
  { id: '3', title: 'Meeting Summary', excerpt: 'Q3 planning meeting with the team...', lastEdited: '3 days ago' },
  { id: '4', title: 'Groceries', excerpt: 'Milk, bread, eggs, and coffee...', lastEdited: 'Last week' },
];

export function NoteList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">All Notes</h1>
          <p className="text-muted-foreground">Here's a list of all your notes.</p>
        </div>
        <Button asChild>
          <Link href="/app/notes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Link href={`/app/notes/${note.id}`} key={note.id}>
            <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50 cursor-pointer h-full flex flex-col">
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>{note.lastEdited}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-foreground/70">{note.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
