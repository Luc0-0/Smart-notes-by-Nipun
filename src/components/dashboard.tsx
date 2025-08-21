'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Book, BrainCircuit, Briefcase, PlusCircle, ShoppingCart } from 'lucide-react';

// Mock data for notebooks and their notes
const notebooks = [
  {
    id: 'general',
    title: 'General Notes',
    description: 'Quick thoughts and daily reminders.',
    icon: <Book className="w-8 h-8 text-primary" />,
    notes: [
      { id: '1', title: 'My First Note', excerpt: 'This is the beginning...' },
      { id: '4', title: 'Groceries', excerpt: 'Milk, bread, eggs...' },
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Ideas and plans for work.',
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    notes: [
      { id: '2', title: 'Project Ideas', excerpt: 'Brainstorming for the AI...' },
    ],
  },
  {
    id: 'meetings',
    title: 'Meetings',
    description: 'Summaries and action items.',
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    notes: [
        { id: '3', title: 'Meeting Summary', excerpt: 'Q3 planning with the team...' },
    ]
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Goals, journals, and personal tasks.',
    icon: <ShoppingCart className="w-8 h-8 text-primary" />,
    notes: [],
  },
];

export function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good morning');
    } else if (hours < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          {greeting}, {user?.displayName?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-muted-foreground">Here’s a look at your notebooks.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {notebooks.map((notebook) => (
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
                <div className="flex flex-col gap-1">
                  {notebook.notes.length > 0 ? (
                    notebook.notes.map((note) => (
                      <Link href={`/app/notes/${note.id}`} key={note.id}>
                         <div className="rounded-md p-2 hover:bg-accent text-sm cursor-pointer">
                            {note.title}
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
        ))}
      </div>
    </div>
  );
}
