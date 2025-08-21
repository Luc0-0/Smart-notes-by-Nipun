
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Book, Briefcase, BrainCircuit, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-provider';
import { getNotes, getNotesByNotebook } from '@/lib/firebase/firestore';
import type { Note, Notebook } from '@/lib/types';
import { useEffect, useState }from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

const notebooks: Omit<Notebook, 'description'>[] = [
  { id: 'general', title: 'General', icon: <Book /> },
  { id: 'projects', title: 'Projects', icon: <Briefcase /> },
  { id: 'meetings', title: 'Meetings', icon: <BrainCircuit /> },
  { id: 'personal', title: 'Personal', icon: <ShoppingCart /> },
];

export function NoteList() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const notebookId = searchParams.get('notebook') as Note['notebookId'] | null;
    
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const currentNotebook = notebookId ? notebooks.find(n => n.id === notebookId) : null;
    const pageTitle = currentNotebook ? `${currentNotebook.title} Notes` : 'All Notes';
    const pageDescription = currentNotebook 
        ? `Notes from your '${currentNotebook.title}' notebook.` 
        : "Here's a list of all your notes.";

    useEffect(() => {
        if (user) {
            setLoading(true);
            const fetchNotes = notebookId ? getNotesByNotebook(user.uid, notebookId) : getNotes(user.uid);

            fetchNotes.then((userNotes) => {
                const sortedNotes = userNotes.sort((a, b) => {
                    const dateA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : a.updatedAt.toMillis();
                    const dateB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : b.updatedAt.toMillis();
                    return dateB - dateA;
                });
                setNotes(sortedNotes);
                setLoading(false);
            });
        }
    }, [user, notebookId]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-5 w-64 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-7 w-3/4" />
                                <Skeleton className="h-4 w-1/2 mt-1" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold font-headline">{pageTitle}</h1>
            <p className="text-muted-foreground">{pageDescription}</p>
            </div>
            <Button asChild>
            <Link href={`/app/notes/new${notebookId ? `?notebook=${notebookId}` : ''}`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Note
            </Link>
            </Button>
        </div>
        
        {notes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                <Link href={`/app/notes/${note.id}`} key={note.id}>
                    <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50 cursor-pointer h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="truncate">{note.title || 'Untitled Note'}</CardTitle>
                        <CardDescription>
                            Updated {formatDistanceToNow(new Date(note.updatedAt as Date), { addSuffix: true })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-foreground/70 line-clamp-3">
                            {note.content || note.projectIdeas || "No additional content."}
                        </p>
                    </CardContent>
                    </Card>
                </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No notes yet!</h3>
                <p className="text-muted-foreground mt-2">Click the button below to create your first note.</p>
                <Button asChild className="mt-4">
                    <Link href={`/app/notes/new${notebookId ? `?notebook=${notebookId}` : ''}`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create a Note
                    </Link>
                </Button>
            </div>
        )}
        </div>
    );
}
