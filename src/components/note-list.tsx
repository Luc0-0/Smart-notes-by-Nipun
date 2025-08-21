
'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Book, Briefcase, BrainCircuit, ShoppingCart, Tag, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/firebase/auth-provider';
import { getNotes } from '@/lib/firebase/firestore';
import type { Note } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

const notebooks = [
  { id: 'general', title: 'General', icon: <Book /> },
  { id: 'projects', title: 'Projects', icon: <Briefcase /> },
  { id: 'meetings', title: 'Meetings', icon: <BrainCircuit /> },
  { id: 'personal', title: 'Personal', icon: <ShoppingCart /> },
];

type NoteListProps = {
  isArchive?: boolean;
  searchQuery?: string;
};

export function NoteList({ isArchive = false, searchQuery = '' }: NoteListProps) {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const notebookId = searchParams.get('notebook') as Note['notebookId'] | null;
    const tag = searchParams.get('tag');
    
    const [notes, setNotes] = useState<Note[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const isTagsPage = pathname.includes('/tags');

    useEffect(() => {
        if (user) {
            setLoading(true);
            getNotes(user.uid).then((userNotes) => {
                const sortedNotes = userNotes.sort((a, b) => {
                    const dateA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : a.updatedAt.toMillis();
                    const dateB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : b.updatedAt.toMillis();
                    return dateB - dateA;
                });
                setNotes(sortedNotes);
                const uniqueTags = [...new Set(sortedNotes.flatMap(note => note.tags || []))];
                setAllTags(uniqueTags.sort());
                setLoading(false);
            });
        }
    }, [user]);

    const filteredNotes = useMemo(() => {
      return notes.filter(note => {
        const matchesArchive = note.isArchived === isArchive;
        const matchesNotebook = !notebookId || note.notebookId === notebookId;
        const matchesTag = !tag || (note.tags && note.tags.includes(tag));
        const matchesSearch = !searchQuery ||
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesArchive && matchesNotebook && matchesTag && matchesSearch;
      });
    }, [notes, isArchive, notebookId, tag, searchQuery]);

    const getPageDetails = () => {
      if (isArchive) return { title: 'Archive', description: "Archived notes.", icon: <Archive /> };
      if (isTagsPage && !tag) return { title: 'Tags', description: "Browse your notes by tag.", icon: <Tag /> };
      if (tag) return { title: `Tagged: #${tag}`, description: `Notes tagged with "${tag}".`, icon: <Tag /> };
      const currentNotebook = notebookId ? notebooks.find(n => n.id === notebookId) : null;
      if (currentNotebook) return { title: `${currentNotebook.title} Notes`, description: `Notes from your '${currentNotebook.title}' notebook.`, icon: currentNotebook.icon };
      return { title: 'All Notes', description: "Here's a list of all your notes.", icon: <Book /> };
    };
    
    const { title: pageTitle, description: pageDescription } = getPageDetails();

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
    
    if (isTagsPage && !tag) {
        return (
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">{pageTitle}</h1>
                        <p className="text-muted-foreground">{pageDescription}</p>
                    </div>
                </div>
                {allTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {allTags.map(t => (
                            <Button key={t} variant="ghost" asChild className="border">
                                <Link href={`/app/tags?tag=${t}`}>
                                    <Tag className="mr-2 h-4 w-4" /> {t}
                                </Link>
                            </Button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold">No tags yet!</h3>
                        <p className="text-muted-foreground mt-2">Tags you add to your notes will appear here.</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">{pageTitle}</h1>
                    <p className="text-muted-foreground">{pageDescription}</p>
                </div>
                {!isArchive && (
                    <Button asChild>
                    <Link href={`/app/notes/new${notebookId ? `?notebook=${notebookId}` : ''}`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Note
                    </Link>
                    </Button>
                )}
            </div>
        
            {filteredNotes.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => (
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
                            {note.tags && note.tags.length > 0 && (
                                <CardContent>
                                    <div className="flex flex-wrap gap-1">
                                        {note.tags.map(t => (
                                            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">No notes yet!</h3>
                    <p className="text-muted-foreground mt-2">{searchQuery ? 'Try a different search term.' : "Click the button below to create your first note."}</p>
                    {!isArchive && !searchQuery && (
                        <Button asChild className="mt-4">
                            <Link href={`/app/notes/new${notebookId ? `?notebook=${notebookId}` : ''}`}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create a Note
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
