
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth-provider';
import { getNotes } from '@/lib/firebase/firestore';
import type { Note, Notebook } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Book, BrainCircuit, Briefcase, PlusCircle, ShoppingCart } from 'lucide-react';

const notebooks: Notebook[] = [
  {
    id: 'general',
    title: 'General Notes',
    description: 'Quick thoughts and daily reminders.',
    icon: <Book className="w-8 h-8 text-primary" />,
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Ideas and plans for work.',
    icon: <Briefcase className="w-8 h-8 text-primary" />,
  },
  {
    id: 'meetings',
    title: 'Meetings',
    description: 'Summaries and action items.',
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Goals, journals, and personal tasks.',
    icon: <ShoppingCart className="w-8 h-8 text-primary" />,
  },
];

export function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getNotes(user.uid).then((userNotes) => {
        setNotes(userNotes);
        setLoading(false);
      });
    }
  }, [user]);

  const getNotesForNotebook = (notebookId: string) => {
    return notes.filter((note) => note.notebookId === notebookId);
  };
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-5 w-1/3 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
             <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          {greeting}, {user?.displayName?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">Here’s a look at your notebooks.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {notebooks.map((notebook) => {
          const notebookNotes = getNotesForNotebook(notebook.id);
          return (
            <Popover key={notebook.id}>
              <PopoverTrigger asChild>
                <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50 cursor-pointer h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {notebook.icon}
                      <CardTitle>{notebook.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-foreground/70">{notebook.description}</p>
                  </CardContent>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none px-2 py-1.5">{notebook.title} Notes</h4>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                    {notebookNotes.length > 0 ? (
                      notebookNotes.map((note) => (
                        <Link href={`/app/notes/${note.id}`} key={note.id}>
                          <div className="rounded-md p-2 hover:bg-accent text-sm cursor-pointer truncate">
                            {note.title || 'Untitled Note'}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground px-2 py-1.5">No notes in this notebook yet.</p>
                    )}
                  </div>
                  <Button size="sm" className="w-full mt-2" asChild>
                    <Link href={`/app/notes/new?notebook=${notebook.id}`}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Note
                    </Link>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          );
        })}
      </div>
    </div>
  );
}
